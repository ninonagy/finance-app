import { ExpenseType, PaymentType } from "@prisma/client";
import { user } from "../../fixtures/user.json";

describe("Creating new expense", () => {
  beforeEach(function () {
    cy.task("db:seed");
    cy.login(user.email, user.password);

    cy.intercept("POST", "/expenses/new").as("createExpense");

    // open modal
    cy.visit("/");
    cy.get('[data-cy="new-expense-button"]').click();
    cy.location("href").should("contain", "?new_expense=true");
    cy.get("[data-cy=new-expense-modal]").should("be.visible");
  });

  it("should not proceed with invalid data", function () {
    // fill modal form with invalid amount and submit, should display native error
    cy.get("input[name=amount]").clear().type("-10");
    cy.get("input[name=note]").clear().type("Test");
    cy.get('[name="paymentType"]').select(PaymentType.CASH);
    cy.get('[name="expenseType"]').select(ExpenseType.ENTERTAINMENT);
    cy.get("button[type=submit]").click();
    // stay on the same page
    cy.location("href").should("contain", "?new_expense=true");

    // have form with empty amount and submit, should display native error
    cy.get("input[name=amount]").clear();
    cy.get("input[name=note]").clear().type("Test");
    cy.get('[name="paymentType"]').select(PaymentType.CASH);
    cy.get('[name="expenseType"]').select(ExpenseType.ENTERTAINMENT);
    cy.get("button[type=submit]").click();
    // stay on the same page
    cy.location("href").should("contain", "?new_expense=true");
  });

  it("should create new expense", function () {
    // fill modal form and submit
    cy.get("input[name=amount]").clear().type("100");
    cy.get("input[name=note]").clear().type("Test");
    cy.get('[name="paymentType"]').select(PaymentType.CASH);
    cy.get('[name="expenseType"]').select(ExpenseType.ENTERTAINMENT);
    cy.get("button[type=submit]").click();
    cy.wait("@createExpense");

    // validate presence of new expense in table
    cy.get("table tbody").should("be.visible").contains("Test");
  });
});
