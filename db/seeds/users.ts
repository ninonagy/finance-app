import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { userFixture } from "./fixtures/user";
import db from "~/db/prisma/client";

const prisma = new PrismaClient();

faker.seed(2);

async function main() {
  console.log(`Start seeding...`);

  const user = userFixture;
  if (!(await db.user.findUnique({ where: { id: user.id } }))) {
    await db.user.create({ data: user });
  }

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
