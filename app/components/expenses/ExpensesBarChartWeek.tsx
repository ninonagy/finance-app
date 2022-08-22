import { NavLink } from "@remix-run/react";
import dayjs from "dayjs";

export default function ExpensesBarChartWeek({
  week,
  min,
  max,
  avg,
  data,
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
}: {
  week: number;
  min: number;
  max: number;
  avg: number;
  data: any;
  labels: string[];
}) {
  return (
    <div>
      <div className="flex flex-row justify-between pb-4 text-sm">
        <NavLink
          to={`/expenses/week/${week - 1}`}
          replace
          className={`flex flex-row items-center opacity-40 hover:opacity-60 ${
            week > 0 ? "visible" : "invisible"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>Prev</span>
        </NavLink>
        <NavLink
          to={`/expenses/week/${week + 1}`}
          replace
          className={`flex flex-row items-center opacity-40 hover:opacity-60 ${
            week < dayjs().week() ? "visible" : "invisible"
          }`}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </NavLink>
      </div>
      <div className="flex w-full flex-row items-start gap-x-3 pb-6 font-normal">
        <div className="w-full">
          <div className="relative mb-6">
            {/* Bar Chart  */}
            <div className="-mx-2 mb-2 flex h-[200px] items-end">
              {data.map((item: { _sum: { amount: number } }, index: number) => (
                <NavLink
                  key={`${week}-${index}`}
                  to={`/expenses/week/${week}/day/${index}`}
                  className="group w-1/6 px-2 md:px-3 lg:px-4"
                >
                  <div className="relative h-[200px] rounded bg-base-200">
                    <div
                      style={{
                        height: `
                        ${Number.parseFloat(
                          ((item._sum.amount / max) * 100).toString()
                        ).toFixed(2)}%
                      `,
                      }}
                      data-amount={item._sum.amount}
                      className="absolute bottom-0 left-0 right-0 rounded bg-neutral group-hover:bg-neutral-focus group-focus:bg-neutral-focus"
                    ></div>
                  </div>
                </NavLink>
              ))}
            </div>
            {/* Labels */}
            <div className="mx-auto w-full">
              <div className="-mx-2 flex items-end">
                {labels.map((label, index) => (
                  <div key={index} className="w-1/6 px-2">
                    <div className="relative">
                      <div className="absolute top-0 left-0 right-0 text-center text-sm font-semibold opacity-60">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-16 items-end text-sm">
          <div className="relative top-0 h-[200px]">
            {max && (
              <div className="absolute top-0 opacity-40">
                {Number.parseFloat(max.toString()).toFixed(2)}
              </div>
            )}
            {avg && (
              <div
                className="absolute font-semibold"
                style={{
                  bottom: `${(avg / max ?? 0) * 100}%`,
                }}
              >
                {Number.parseFloat(avg.toString()).toFixed(2)}
              </div>
            )}
            <div className="absolute bottom-0 opacity-40">
              {Number.parseFloat(min.toString()).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
