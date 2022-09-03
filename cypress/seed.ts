import { Prisma, PrismaClient } from "@prisma/client";
import { ExpenseType, PaymentType } from "@prisma/client";
import dayjs from "dayjs";
import fs from "fs";
import { faker } from "@faker-js/faker";
import * as path from "path";
import { times } from "lodash";
import * as bcrypt from "bcryptjs";

import { user } from "./fixtures/user.json";

const db = new PrismaClient();
user.password = bcrypt.hashSync(user.password, 10);

// ensures that test data is consistent every time the tests are run.
faker.seed(1);

const createFakeExpense = (userId: number) => {
  const date = faker.date.between(
    dayjs().startOf("year").toISOString(),
    dayjs().endOf("year").toISOString()
  );

  return {
    id: undefined,
    userId: userId,
    amount: faker.datatype.number({ min: 0, max: 150 }),
    paymentType: Object.keys(PaymentType)[
      faker.datatype.number({
        min: 0,
        max: Object.keys(PaymentType).length - 1,
      })
    ] as PaymentType,
    expenseType: Object.keys(ExpenseType)[
      faker.datatype.number({
        min: 0,
        max: Object.keys(ExpenseType).length - 1,
      })
    ] as ExpenseType,
    date: date,
    time: date,
    note: "",
  } as Prisma.ExpenseUncheckedCreateInput;
};

export const createSeedExpenses = (numOfExpenses: number) =>
  times(numOfExpenses, () => createFakeExpense(user.id as number));

export const seed = async () => {
  const seedExpenses = createSeedExpenses(1000);

  const data = {
    users: [user],
    expenses: seedExpenses,
  };

  // write seed data to database-seed.json
  // fs.writeFileSync(
  //   path.join(process.cwd(), "cypress/data/database-seed.json"),
  //   JSON.stringify(data)
  // );

  return await db.$transaction([
    db.user.createMany({ data: data.users, skipDuplicates: true }),
    db.expense.createMany({ data: data.expenses }),
  ]);
};

export const teardown = async () => {
  await db.$transaction([
    db.$executeRawUnsafe(`TRUNCATE TABLE "public"."User" CASCADE;`),
  ]);
  await db.$disconnect();
};
