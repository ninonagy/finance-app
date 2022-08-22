import { Prisma } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Dayjs } from "dayjs";
import {
  expenseAggregateInWeek,
  expenseGroupByDateInWeek,
  expenseGroupByExpenseTypeInWeek,
} from "~/db/expense";
import ExpensesBarChartWeek from "~/components/expenses/ExpensesBarChartWeek";
import ExpensesTab from "~/components/expenses/ExpensesTab";
import ExpensesTable from "~/components/expenses/ExpensesTable";
import TotalSpentStat from "~/components/expenses/TotalSpentStat";
import dayjs from "~/utils/dayjs";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  let { week } = params;

  const weekNum = Number.parseInt(week as string);

  if (isNaN(weekNum) || weekNum < 0 || weekNum > dayjs().week()) {
    return redirect(`/expenses/week/${dayjs().week()}`);
  }

  const expensesGroupedByDateInWeek = await expenseGroupByDateInWeek(
    weekNum,
    userId
  );

  return json({
    expensesByTypeInWeek: await expenseGroupByExpenseTypeInWeek(
      weekNum,
      userId
    ),
    expensesByDateInWeek: expensesGroupedByDateInWeek,
    expensesAggregatedInWeek: await expenseAggregateInWeek(weekNum, userId),
  });
};

export default function ExpensesWeek() {
  const {
    expensesByTypeInWeek,
    expensesByDateInWeek,
    expensesAggregatedInWeek,
  } = useLoaderData();
  const { week } = useParams();

  const weeksAgo: number =
    (week ? Number.parseInt(week as string) : 0) - dayjs().week();

  const weeksAgoWords: string =
    weeksAgo === 0
      ? "this week"
      : new Intl.RelativeTimeFormat("en", {
          style: "long",
        }).format(weeksAgo, "weeks");

  return (
    <>
      <TotalSpentStat
        title={`Total spent ${weeksAgoWords}`}
        amount={expensesAggregatedInWeek._sum.amount}
      />

      <ExpensesBarChartWeek
        week={Number.parseInt(week as string)}
        min={0}
        avg={expensesAggregatedInWeek._avg.amount}
        max={expensesAggregatedInWeek._sum.amount}
        data={expensesByDateInWeek}
      />

      <ExpensesTab />
      <ExpensesTable expenses={expensesByTypeInWeek} />
    </>
  );
}
