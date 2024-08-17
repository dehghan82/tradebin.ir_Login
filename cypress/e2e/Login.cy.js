import { interceptProfile, interceptUserExists, users } from "./utils";

describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    interceptUserExists();
    interceptProfile();

    cy.get('input[name="username"]')
      .focus()
      .clear()
      .type(users.username_user.username);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");

    cy.contains("label", "گذرواژه").siblings("input").should("exist");

    cy.get("div.text-end.mb-3").contains("گذرواژه خود را وارد کنید");

    cy.get('input[name="password"]').type(users.username_user.password);
    cy.get('button[type="submit"]').contains("ورود").click();

    cy.wait("@profile").its("response.statusCode").should("eq", 200);
  });
});
