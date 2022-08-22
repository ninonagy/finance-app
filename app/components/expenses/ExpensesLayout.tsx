import { Link } from "@remix-run/react";
import Container from "../Container";
import ExpensesTab from "./ExpensesTab";
import ExpensesTable from "./ExpensesTable";
import TotalSpentStat from "./TotalSpentStat";

const ExpensesNavbar = () => (
  <div className="navbar px-6">
    <div className="navbar-end w-full">
      <Link
        to={"/expenses/new"}
        className="modal-button btn btn-primary btn-ghost btn-circle h-16 w-16"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  </div>
);

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ExpensesNavbar />
      <Container>{children}</Container>
    </>
  );
}
