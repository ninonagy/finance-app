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
  // Special fast path to drop data from a postgres database.
  // This is much faster than using prisma client to delete data.
  // Source: https://github.com/keystonejs/keystone/blob/119f3f791ad072eef49719a2c8c8db10ed93611c/packages/adapter-prisma/lib/adapter-prisma.js#L232-L248
  const dbSchemaName = "'public'";
  for (const {
    tablename,
  } of await db.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname=${dbSchemaName}`) {
    await db.$queryRaw`TRUNCATE TABLE ${dbSchemaName}.'${tablename}' CASCADE;`;
  }
  for (const {
    relname,
  } of await db.$queryRaw`SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON c.relnamespace = n.oid WHERE c.relkind='S' AND n.nspname=${dbSchemaName};`) {
    await db.$queryRaw`ALTER SEQUENCE ${dbSchemaName}.'${relname}' RESTART WITH 1;`;
  }
  await db.$disconnect();
};
