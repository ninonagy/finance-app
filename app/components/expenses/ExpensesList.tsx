import { Expense } from "@prisma/client";
import dayjs from "~/utils/dayjs";
import { humanizeExpense, mapExpenseToEmoji } from "~/utils/expenses";

export default function ExpensesList({
  title,
  items,
}: {
  title: string;
  items: Expense[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full font-semibold">
        <thead>
          <tr className="opacity-30">
            <th className="bg-transparent normal-case"></th>
            <th className="bg-transparent text-sm font-medium normal-case">
              {title}
            </th>
            <th className="bg-transparent text-right text-sm font-medium normal-case">
              {items.reduce((prev: number, e: any) => prev + e.amount, 0)}
              <span> kn</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Row */}
          {items.map((expense: Expense) => (
            <tr key={expense.expenseType.toString()}>
              <td className="w-0 text-2xl">
                {mapExpenseToEmoji(expense.expenseType)}
              </td>
              <td className="w-0">
                <div className="flex flex-col">
                  {expense.note !== null && expense.note !== ""
                    ? `"${expense.note}"`
                    : humanizeExpense(expense.expenseType)}
                  <span className="opacity-60">
                    {dayjs(expense.time).format("LT")}
                  </span>
                </div>
              </td>
              <td className="text-right">
                <span className="opacity-80">
                  {Number.parseFloat(expense.amount.toString()).toFixed(2)} kn
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
