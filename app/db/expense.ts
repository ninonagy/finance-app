import type { ExpenseType, Prisma } from "@prisma/client";
import { Dayjs } from "dayjs";
import dayjs from "~/utils/dayjs";
import { db } from "./prisma/client";

export function createExpense(expense: Prisma.ExpenseUncheckedCreateInput) {
  return db.expense.create({ data: expense });
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
  return await db.expense.aggregate({
    _sum: { amount: true },
    _avg: { amount: true },
    where: {
      userId: userId,
      date: {
        gte: dayjs().utc().week(week).startOf("week").toISOString(),
        lte: dayjs()
          .utc()
          .week(week)
          .endOf("week")
          .startOf("day")
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
  // UI sends `day` as a value from 1 to 7, where 1 is Monday and 7 is Sunday
  // (or based on locale settings). In this case, we need to convert it to 0 to 6,
  // where 0 is Monday and 6 is Sunday, to match the dayjs API.
  day = day - 1;

  return await db.expense.groupBy({
    by: ["expenseType"],
    _sum: { amount: true },
    _count: { expenseType: true },
    where: {
      userId: userId,
      date: {
        equals: dayjs()
          .utc()
          .week(week)
          .weekday(day)
          .startOf("day")
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
  return await db.expense.groupBy({
    by: ["expenseType"],
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .week(week)
          .startOf("week")
          .startOf("day")
          .toISOString(),
        lte: dayjs()
          .utc()
          .week(week)
          .endOf("week")
          .startOf("day")
          .toISOString(),
      },
    },
    _sum: { amount: true },
    _count: { expenseType: true },
    orderBy: { _sum: { amount: "desc" } },
  });
}

export async function expenseGroupByDateInWeek(week: number, userId: number) {
  const groupedByDateInWeek = await db.expense.groupBy({
    by: ["date"],
    _sum: { amount: true },
    where: {
      userId: userId,
      date: {
        gte: dayjs()
          .utc()
          .week(week)
          .startOf("week")
          .startOf("day")
          .toISOString(),
        lte: dayjs()
          .utc()
          .week(week)
          .endOf("week")
          .startOf("day")
          .toISOString(),
      },
    },
    orderBy: { date: "asc" },
  });

  // fill missing dates: from monday to sunday
  const filledGroupedByDateInWeek = [];
  let rangeAt: Dayjs = dayjs().utc().week(week).startOf("week");

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

    rangeAt = rangeAt.weekday(day + 1);
  }

  return filledGroupedByDateInWeek;
}
