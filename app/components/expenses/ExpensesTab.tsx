import { NavLink } from "@remix-run/react";

export default function ExpensesTab() {
  return (
    <>
      {/* Tabs: week, month and year */}
      <div className="tabs tabs-boxed bg-transparent">
        <NavLink
          to={`/expenses/week`}
          className={({ isActive }) =>
            isActive ? "tab tab-active !bg-base-300 !text-base-content" : "tab"
          }
        >
          Week
        </NavLink>
        <NavLink
          to={"/expenses/month"}
          className={({ isActive }) =>
            isActive ? "tab tab-active !bg-base-300 !text-base-content" : "tab"
          }
        >
          Month
        </NavLink>
        {/* <NavLink
          to={"/expenses/year"}
          className={({ isActive }) =>
            isActive ? "tab tab-active !bg-base-300 !text-base-content" : "tab"
          }
        >
          Year
        </NavLink> */}
      </div>
    </>
  );
}
