import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import {
  expenseGroupByDateInWeek,
  expenseGroupByExpenseTypeInWeekday,
  expenseAggregateInWeek,
} from "~/db/expense";
import prisma from "~/db/prisma/client";
import ExpensesBarChartWeek from "~/components/expenses/ExpensesBarChartWeek";
import ExpensesTab from "~/components/expenses/ExpensesTab";
import ExpensesTable from "~/components/expenses/ExpensesTable";
import TotalSpentStat from "~/components/expenses/TotalSpentStat";
import dayjs from "~/utils/dayjs";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  let { week, day } = params;

  const weekNum = Number.parseInt(week as string);
  const dayNum = Number.parseInt(day as string);

  if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
    return redirect(`/expenses/week/${week}/day/0`);
  }
  if (isNaN(weekNum) || weekNum < 0 || weekNum > dayjs().week()) {
    return redirect(`/expenses/week/${dayjs().week()}/day/0`);
  }

  const expensesGroupedByExpenseTypeInWeekday =
    await expenseGroupByExpenseTypeInWeekday(weekNum, dayNum, userId);

  const expensesGroupedByDateInWeek = await expenseGroupByDateInWeek(
    weekNum,
    userId
  );

  return {
    expensesInWeek: expensesGroupedByDateInWeek,
    expensesInWeekday: expensesGroupedByExpenseTypeInWeekday,
    expensesAggregatedInWeek: await expenseAggregateInWeek(weekNum, userId),
  };
};

export default function ExpensesWeekDay() {
  const { week, day } = useParams();
  const { expensesInWeek, expensesInWeekday, expensesAggregatedInWeek } =
    useLoaderData();

  const dayDate = dayjs()
    .week(Number.parseInt(week as string))
    .weekday(Number.parseInt(day as string))
    .toDate();
  const weeksAgo: number =
    (week ? Number.parseInt(week as string) : 0) - dayjs().week();
  const weeksAgoWords: string =
    weeksAgo === 0
      ? "this week"
      : new Intl.RelativeTimeFormat("en", {
          style: "long",
        }).format(weeksAgo, "weeks");

  const totalInDay = expensesInWeekday.reduce(
    (prev: number, e: { _sum: { amount: number } }) => prev + e._sum.amount,
    0
  );

  return (
    <>
      <TotalSpentStat
        title={`Spent ${weeksAgoWords} on ${dayDate.toLocaleDateString(
          "en-us",
          {
            weekday: "long",
          }
        )}`}
        amount={totalInDay}
      />

      <ExpensesBarChartWeek
        week={Number.parseInt(week as string)}
        min={0}
        avg={expensesAggregatedInWeek._avg.amount}
        max={expensesAggregatedInWeek._sum.amount}
        data={expensesInWeek}
      />

      <ExpensesTab />
      <ExpensesTable expenses={expensesInWeekday} />
    </>
  );
}
