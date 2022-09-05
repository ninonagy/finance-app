import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createExpense } from "~/db/expense";
import { ExpenseType, PaymentType } from "@prisma/client";
import { zfd } from "zod-form-data";
import { requireUserId } from "~/utils/session.server";
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

  await createExpense({
    ...data,
    date: data.date,
    time: data.date,
    userId: userId,
  });

  return redirect("/");
};
