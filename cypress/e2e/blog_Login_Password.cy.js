import { interceptProfile, interceptUserExists,handleUncaughtException,interceptOtpRequest, users } from "./utils";

describe("Tests of tradebin blog", () => {
  beforeEach(() => {
    const exist_status=true;
    const pass_status=true;
    cy.visit("/blog");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    handleUncaughtException();
    interceptUserExists(exist_status,pass_status); 
    interceptProfile();
    interceptOtpRequest();
  });
  function performPassLogin(user_data , password ,full_name){

    cy.get('input[name="username"]')
      .focus()
      .clear()
      .type(user_data);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");

    cy.contains("h5", "ورود").should("exist");

    cy.get("div.text-end.mb-3").contains("گذرواژه خود را وارد کنید");

    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').contains("ورود").click();

    cy.wait("@profile").its("response.statusCode").should("eq", 200);
    cy.url().should("contain", "/market");
    cy.get("a#profile").click();
    cy.contains("a", "خروج").click();
    cy.url().should("contain", "/");
    cy.get('div[data-id="b6e2d08"] span.username').should(
      "contain",
      full_name
    );
  }


  it("Should test Scenario of user having password logging in with username", () => {
    performPassLogin(users.username_user.username,users.username_user.password,users.username_user.full_name)
  });

  it("Should test Scenario of user having password logging in with phone number" , ()=>{
    performPassLogin(users.username_user.phoneNumber,users.username_user.password,users.username_user.full_name)
  });
  it("Should test Scenario of user having password logging in with email",()=>{
    performPassLogin(users.username_user.email,users.username_user.password,users.username_user.full_name)
  });
});
