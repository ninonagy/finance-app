import { ExpenseType, PaymentType } from "@prisma/client";
import { user } from "../../fixtures/user.json";

import mapExpenseToEmoji from "../../app/utils/expenses";

describe("Creating new expense", () => {
  beforeEach(function () {
    cy.task("db:seed");
    cy.login(user.email, user.password);

    cy.intercept("POST", "/expenses/new").as("new_expense");
  });

  it("should create new expense", function () {
    cy.visit("/");

    // open modal
    cy.get('[data-cy="new-expense-button"]').click();
    cy.location("href").should("contain", "?new_expense=true");
    cy.get("[data-cy=new-expense-modal]").should("be.visible");

    // fill modal form and submit
    cy.get("input[name=amount]").clear().type("100");
    cy.get("input[name=note]").clear().type("Test");
    cy.get('[name="paymentType"]').select(PaymentType.CASH);
    cy.get('[name="expenseType"]').select(ExpenseType.ENTERTAINMENT);
    cy.get("button[type=submit]").click();
    cy.wait("@new_expense");

    // validate presence of new expense in table
    cy.get("table tbody").should("be.visible").contains("Test");
  });
});
