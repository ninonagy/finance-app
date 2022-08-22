import type { LoaderFunction } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await logout(request);
};