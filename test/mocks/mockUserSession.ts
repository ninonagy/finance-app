import { commitSession, getSession } from "~/utils/session.server";

export async function mockCookieSession(name: string, value: number) {
  const session = await getSession();
  session.set(name, value);
  return commitSession(session);
}
