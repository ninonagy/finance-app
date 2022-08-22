import { humanizeExpense, mapExpenseToEmoji } from "~/utils/expenses";

export default function ExpensesTable({ expenses }: { expenses: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full font-semibold">
        <tbody>
          {/* Row */}
          {expenses.map((group) => (
            <tr key={group.expenseType.toString()}>
              <td className="w-0 text-2xl">
                {mapExpenseToEmoji(group.expenseType)}
              </td>
              <td>
                {humanizeExpense(group.expenseType)}
                <span className="ml-2 opacity-60">
                  x{group._count.expenseType}
                </span>
              </td>
              <td className="text-right">
                {Number.parseFloat(group._sum.amount).toFixed(2)} kn
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
