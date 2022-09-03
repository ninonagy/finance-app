import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import * as bcrypt from "bcryptjs";
import { db } from "~/db/prisma/client";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required environment variable!");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "finance_app_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getSession() {
  return storage.getSession();
}

export async function commitSession(session: Session) {
  return storage.commitSession(session);
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: Number.parseInt(userId as string) },
      select: { id: true, email: true },
    });
    return user;
  } catch (error) {
    throw logout(request);
  }
}

export async function requireUserId(request: Request): Promise<number> {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    throw redirect(`/login`);
  }

  return userId;
}

type LoginForm = {
  email: string;
  password: string;
};

export async function register({ email, password }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, password: passwordHash },
  });
  return { id: user.id, email };
}

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;

  return { id: user.id, email };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
