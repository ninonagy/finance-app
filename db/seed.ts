import { PrismaClient } from "@prisma/client";
import { AddDemoUserWithRandomExpensesSeeder } from "./seeds/001-add-demo-user-with-random-expenses.seeder";

const db = new PrismaClient();

async function main() {
  await AddDemoUserWithRandomExpensesSeeder(db);
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log(`Seeding finished.`);
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
