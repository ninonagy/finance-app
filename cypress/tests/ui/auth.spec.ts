import { user } from "../../fixtures/user.json";

describe("User sign-up and login", () => {
  beforeEach(function () {
    cy.task("db:seed");

    cy.intercept("POST", "/signup").as("signup");
  });

  it("should redirect unauthenticated user to login page", function () {
    cy.visit("/");
    cy.location("pathname").should("be.equal", "/login");
  });

  it("should redirect to the home page after login", () => {
    cy.login(user.email, user.password);
    cy.location("pathname").should("be.equal", "/");
  });

  it("should remember a user for 30 days after login", function () {
    cy.login(user.email, user.password);

    // Verify Session Cookie
    cy.getCookie("finance_app_session").should("have.property", "expiry");
  });

  it("should display login errors", function () {
    cy.login("invalid@email.com", "invalid-password");

    cy.get('[data-cy="login-error"]')
      .should("be.visible")
      .and("have.class", "text-error")
      .contains(
        "Sorry, we can't find user with the provided credentials. Please check your email and password one more time."
      );
  });

  it("should display signup errors", function () {
    cy.visit("signup");

    // passwords don't match
    cy.get("input[name=email]").clear().type("some@email.com");
    cy.get("input[name=password]").clear().type("one-pass");
    cy.get("input[name=passwordConfirm]").clear().type("second-pass");
    cy.get("button[type=submit]").click();
    cy.get('[data-cy="signup-error"]')
      .should("be.visible")
      .contains("Passwords don't match.");

    // password must be at least 8 characters long
    cy.get("input[name=email]").clear().type("some@email.com");
    cy.get("input[name=password]").clear().type("short");
    cy.get("input[name=passwordConfirm]").clear().type("short");
    cy.get("button[type=submit]").click();
    cy.get('[data-cy="signup-error"]')
      .should("be.visible")
      .contains("Password must be at least 8 characters.");

    // email is already in use
    cy.get("input[name=email]").clear().type(user.email);
    cy.get("input[name=password]").clear().type("password");
    cy.get("input[name=passwordConfirm]").clear().type("password");
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=signup-error]")
      .should("be.visible")
      .contains(
        "Sorry, it looks like this email is already in use. Please try another one."
      );
  });

  it("should signup", function () {
    cy.visit("signup");
    cy.intercept("POST", "/signup").as("signup");

    cy.get("input[name=email]").type("some@email.com");
    cy.get("input[name=password]").type("some-valid-password");
    cy.get("input[name=passwordConfirm]").type("some-valid-password");

    cy.get("button[type=submit]").click();
    cy.wait("@signup");

    cy.location("pathname").should("be.equal", "/");
  });

  it("should logout user", () => {
    cy.login(user.email, user.password);
    cy.visit("/settings");
    cy.get('[data-cy="logout-button"]').click();
    cy.location("pathname").should("be.equal", "/login");
  });
});
