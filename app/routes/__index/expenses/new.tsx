import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { createExpense } from "~/db/expense";
import { ExpenseType, PaymentType } from "@prisma/client";
import { zfd } from "zod-form-data";
import { mapExpenseToEmoji, humanizeExpense } from "~/utils/expenses";
import { requireUserId } from "~/utils/session.server";
import dayjs from "~/utils/dayjs";
import { z } from "zod";

const ExpenseFormSchema = zfd.formData({
  date: zfd.text().transform((v) => new Date(v)),
  amount: zfd.numeric(z.number().min(0)),
  expenseType: z.nativeEnum(ExpenseType),
  paymentType: z.nativeEnum(PaymentType),
  note: z.string().trim().optional(),
});
type Expense = z.infer<typeof ExpenseFormSchema>;

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const data: Expense = ExpenseFormSchema.parse(
    Object.fromEntries(await request.formData())
  );

  // const user = await prisma.user.findUnique({ where: { id: 1 } });
  await createExpense({
    ...data,
    date: data.date,
    time: data.date,
    userId: userId,
  });

  return redirect("/");
};

export default function NewExpenseRoute() {
  const transition = useTransition();

  return (
    <>
      {/* Modal is bottom on mobile and middle on desktop */}
      <div className="modal modal-open modal-bottom sm:modal-middle">
        <div className="modal-box">
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
      </div>
    </>
  );
}
