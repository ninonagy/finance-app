import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import dayjs from "dayjs";
import ExpensesLayout from "~/components/expenses/ExpensesLayout";

export const loader: LoaderFunction = ({ request }) => {
  if (new URL(request.url).pathname.endsWith("/expenses")) {
    return redirect(`/expenses/week/${dayjs().week()}`);
  } else return null;
};

export default function Index() {
  return (
    <ExpensesLayout>
      <Outlet />
    </ExpensesLayout>
  );
}
