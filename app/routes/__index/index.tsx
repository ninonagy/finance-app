import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import ExpensesList from "~/components/expenses/ExpensesList";
import { db } from "~/db/prisma/client";
import dayjs from "~/utils/dayjs";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const expensesToday = await db.expense.findMany({
    where: {
      userId,
      date: {
        equals: dayjs().utc().startOf("day").toISOString(),
      },
    },
    orderBy: { time: "desc" },
  });

  const expensesYesterday = await db.expense.findMany({
    where: {
      userId,
      date: {
        equals: dayjs().utc().subtract(1, "day").startOf("day").toISOString(),
      },
    },
    orderBy: { time: "desc" },
  });

  const thisWeek = await db.expense.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      date: {
        gte: dayjs().utc().startOf("week").toISOString(),
        lte: dayjs().utc().endOf("week").startOf("day").toISOString(),
      },
    },
  });

  const thisMonth = await db.expense.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      date: {
        gte: dayjs().utc().startOf("month").toISOString(),
        lte: dayjs().utc().endOf("month").startOf("day").toISOString(),
      },
    },
  });

  return json({
    today: { items: expensesToday, title: "Today" },
    yesterday: { items: expensesYesterday, title: "Yesterday" },
    totalAmountThisWeek: thisWeek._sum.amount,
    totalAmountThisMonth: thisMonth._sum.amount,
  });
};

const HomeNavbar = () => (
  <div className="navbar px-6">
    <div className="navbar-end w-full">
      <Link
        to={"/expenses/new"}
        className="modal-button btn btn-primary btn-ghost btn-circle h-16 w-16"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  </div>
);

export default function Index() {
  const expenses = useLoaderData();

  // console.log(expenses.today);

  return (
    <>
      <HomeNavbar />
      <Container>
        <div className="stats w-full flex-row">
          <div className="stat">
            <div className="stat-title">Spent this week</div>
            <div className="stat-value font-semibold">
              {expenses.totalAmountThisWeek ?? 0}
              <sup className="ml-1 opacity-60">kn</sup>
            </div>
            {/* <div className="stat-desc">21% more than last month</div> */}
          </div>
          <div className="stat">
            <div className="stat-title">Spent this month</div>
            <div className="stat-value font-semibold">
              {expenses.totalAmountThisMonth ?? 0}
              <sup className="ml-1 opacity-60">kn</sup>
            </div>
            {/* <div className="stat-desc">21% more than last month</div> */}
          </div>
        </div>

        {[expenses.today, expenses.yesterday].map(
          (group, index) =>
            group.items.length > 0 && (
              <ExpensesList
                key={index}
                title={group.title}
                items={group.items}
              />
            )
        )}
      </Container>
    </>
  );
}
