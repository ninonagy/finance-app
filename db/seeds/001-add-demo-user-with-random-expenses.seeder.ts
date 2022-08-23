import type { Prisma, PrismaClient } from "@prisma/client";
import { PaymentType, ExpenseType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { userFixture } from "./fixtures/user";

faker.seed(1);

const expenseFactory = () => {
  const date = faker.date.between(
    dayjs().startOf("year").toISOString(),
    dayjs().endOf("year").toISOString()
  );

  return {
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
  } as Prisma.ExpenseCreateWithoutUserInput;
};

export async function AddDemoUserWithRandomExpensesSeeder(db: PrismaClient) {
  console.log(`Running AddDemoUserWithRandomExpensesSeeder...`);

  const user = userFixture;
  if (!(await db.user.findUnique({ where: { email: user.email } }))) {
    await db.user.create({ data: user });

    await Promise.all(
      Array.from({ length: 1000 }).map(async () => {
        await db.expense.createMany({
          data: { ...expenseFactory(), userId: userFixture.id as number },
        });
      })
    );
  }
}
