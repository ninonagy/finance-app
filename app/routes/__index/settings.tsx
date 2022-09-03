import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { db } from "~/db/prisma/client";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await db.user.findUnique({ where: { id: userId } });
  return user;
};

export default function Settings() {
  const user = useLoaderData<User>();

  return (
    <Container>
      <h1>Settings</h1>
      <div className="flex flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div>
            <h2>Some info about you</h2>
            <div className="form-control pb-4">
              <label htmlFor="name" className="label">
                <span className="label-text">Your name</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="input input-primary"
                defaultValue={user?.name ?? ""}
              />
            </div>
            <div className="form-control pb-4">
              <label htmlFor="password" className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className={"input input-primary input-disabled"}
                disabled
              />
            </div>
            <div className="form-control pb-4">
              <label htmlFor="passwordConfirm" className="label">
                <span className="label-text">Confirm new Password</span>
              </label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                className={"input input-primary input-disabled"}
                disabled
              />
            </div>
            <div className="form-control pb-4">
              <button className="btn w-max" type="submit">
                Save changes
              </button>
            </div>
          </div>
          <div>
            <h2>Danger zone</h2>
            <div className="form-control pb-4">
              <Link className="btn btn-warning w-max" to={"/logout"}>
                Logout
              </Link>
            </div>
            <div className="form-control pb-4 pt-8">
              <Link
                className="btn btn-disabled btn-error w-max"
                to={"/settings"}
              >
                Delete account
              </Link>
              <label className="label">
                <span className="label-text opacity-40">
                  If you choose to delete account then all your data will be
                  lost.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
