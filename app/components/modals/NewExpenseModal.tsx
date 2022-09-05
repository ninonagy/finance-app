import { ExpenseType } from "@prisma/client";
import { Form, NavLink, useLocation, useTransition } from "@remix-run/react";
import dayjs from "~/utils/dayjs";
import { humanizeExpense, mapExpenseToEmoji } from "~/utils/expenses";

// Modal is bottom on mobile and middle on desktop
export default function NewExpenseModal() {
  const transition = useTransition();
  const location = useLocation();

  return (
    <>
      <label
        id="new-expense-modal"
        className="modal modal-open modal-bottom sm:modal-middle"
        data-cy="new-expense-modal"
      >
        <div className="modal-box">
          <NavLink
            to={location.pathname}
            className="btn btn-circle btn-sm absolute right-2 top-2"
            data-cy="new-expense-modal-close-button"
          >
            ✕
          </NavLink>
          <Form className="space-y-8" action="/expenses/new" method="post">
            <input
              name="date"
              type="text"
              className="hidden"
              defaultValue={dayjs().utc().toISOString()}
            />
            <div className="flex justify-center">
              <input
                name="amount"
                type="number"
                placeholder="80.00 kn"
                autoFocus
                min={0}
                required
                className="input input-bordered input-lg"
              />
            </div>
            <div className="space-y-2">
              <div className="form-control">
                <label className="input-group input-group-sm">
                  <span className="bg-transparent text-base-content opacity-30">
                    Today
                  </span>
                  <input
                    name="note"
                    type="text"
                    placeholder="Add note"
                    className="input input-ghost input-sm w-full"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="input-group">
                  <select name="paymentType" className="select select-ghost">
                    <option value="CREDIT_CARD" selected>
                      💳 Credit Card
                    </option>
                    <option value="DEBIT_CARD">💳 Debit Card</option>
                    <option value="CASH">💶 Cash</option>
                  </select>
                  <span className="bg-transparent stroke-base-content opacity-30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <select name="expenseType" className="select select-ghost">
                    {Object.keys(ExpenseType).map((type: string, index) => (
                      <option key={index} value={type}>
                        {mapExpenseToEmoji(type)} {humanizeExpense(type)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-2 flex w-full justify-end">
                <button className="btn" type="submit">
                  {transition.state === "submitting" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </label>
    </>
  );
}
