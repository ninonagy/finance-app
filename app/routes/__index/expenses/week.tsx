import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import dayjs from "~/utils/dayjs";

// Redirect to the current week period
export const loader: LoaderFunction = () => {
  return redirect(`/expenses/week/${dayjs().week()}`);
};
