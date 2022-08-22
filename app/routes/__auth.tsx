import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <div className="prose max-w-full">
      <div className="pt-32">
        <Outlet />
      </div>
    </div>
  );
}
