import type { Prisma } from "@prisma/client";

export const userFixture: Prisma.UserUncheckedCreateWithoutExpenseInput = {
  id: 1,
  name: "demo",
  email: "demo@example.com",
  password: "$2a$10$78kQ8/Mil0AwTSUUwvwhROFSeQbl.L72CgAPIpXDxv4k2tmPPG7h6", // demo
};
