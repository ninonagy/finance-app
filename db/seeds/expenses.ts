import type { Prisma } from "@prisma/client";
import { PrismaClient, PaymentType, ExpenseType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

const prisma = new PrismaClient();

faker.seed(1);

const expenseFactory = () => {
  const date = faker.date.between(
    dayjs().startOf("year").toISOString(),
    dayjs().endOf("day").toISOString()
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

async function main() {
  console.log(`Start seeding ...`);

  await Promise.all(
    Array.from({ length: 500 }).map(async () => {
      await prisma.expense.createMany({
        data: { ...expenseFactory(), userId: 1 },
      });
    })
  );

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
