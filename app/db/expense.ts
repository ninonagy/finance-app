import type { ExpenseType, Prisma } from "@prisma/client";
import { Dayjs } from "dayjs";
import dayjs from "~/utils/dayjs";
import prisma from "./prisma/client";

export function createExpense(expense: Prisma.ExpenseUncheckedCreateInput) {
  return prisma.expense.create({ data: expense });
}

function getWeekDiff(week: number) {
  let curWeek = dayjs().week();
  let startWeek = week;
  let weekDiff = curWeek - startWeek;
  return weekDiff;
}

export async function expenseAggregateInWeek(
  week: number,
  userId: number
): Promise<
  Prisma.GetExpenseAggregateType<{
    _sum: {
      amount: true;
    };
    _avg: {
      amount: true;
    };
    where: {
      date: {
        gte: string;
        lte: string;
      };
    };
  }>
> {
  const weekDiff = getWeekDiff(week);

  return await prisma.expense.aggregate({
    _sum: { amount: true },
    _avg: { amount: true },
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .startOf("week")
          .toISOString(),
        lte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .endOf("week")
          .toISOString(),
      },
    },
  });
}

export async function expenseGroupByExpenseTypeInWeekday(
  week: number,
  day: number,
  userId: number
) {
  const weekDiff = getWeekDiff(week);

  return await prisma.expense.groupBy({
    by: ["expenseType"],
    _sum: { amount: true },
    _count: { expenseType: true },
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .add(day, "day")
          .startOf("day")
          .toISOString(),
        lte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .add(day, "day")
          .endOf("day")
          .toISOString(),
      },
    },
    orderBy: { _sum: { amount: "desc" } },
  });
}

export async function expenseGroupByExpenseTypeInWeek(
  week: number,
  userId: number
) {
  const weekDiff = getWeekDiff(week);

  return await prisma.expense.groupBy({
    by: ["expenseType"],
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .startOf("week")
          .toISOString(),
        lte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .endOf("week")
          .toISOString(),
      },
    },
    _sum: { amount: true },
    _count: { expenseType: true },
    orderBy: { _sum: { amount: "desc" } },
  });
}

export async function expenseGroupByDateInWeek(week: number, userId: number) {
  const weekDiff = getWeekDiff(week);

  const groupedByDateInWeek = await prisma.expense.groupBy({
    by: ["date"],
    _sum: { amount: true },
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .startOf("week")
          .toISOString(),
        lte: dayjs()
          .utc()
          .subtract(weekDiff, "weeks")
          .endOf("week")
          .toISOString(),
      },
    },
    orderBy: { date: "asc" },
  });

  // fill missing dates: from monday to sunday
  const filledGroupedByDateInWeek = [];
  let rangeAt: Dayjs = dayjs()
    .utc()
    .subtract(weekDiff, "weeks")
    .startOf("week");
  for (let day = 0; day <= 6; day++) {
    const found = groupedByDateInWeek.find(
      // eslint-disable-next-line no-loop-func
      (group) =>
        new Date(group.date).toISOString() ===
        new Date(rangeAt.toDate()).toISOString()
    );

    filledGroupedByDateInWeek.push({
      date: new Date(rangeAt.toISOString()),
      _sum: { amount: found ? found._sum.amount : 0 },
    });

    rangeAt = rangeAt.add(1, "day");
  }

  return filledGroupedByDateInWeek;
}
