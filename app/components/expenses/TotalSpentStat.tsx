export default function TotalSpentStat({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  return (
    <div className="mb-6">
      <div className="text-4xl font-semibold text-base-content">
        {/* Total amount this week */}
        {/* {expenses.byDayThisWeek.reduce(
            (prev: number, e: { _sum: { amount: number } }) =>
              prev + e._sum.amount,
            0
          )} */}
        {amount ?? 0}
        <span> kn</span>
      </div>
      <div className="opacity-60">{title}</div>
    </div>
  );
}
