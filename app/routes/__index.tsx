import type { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Layout from "~/components/layout/Layout";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Home() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
