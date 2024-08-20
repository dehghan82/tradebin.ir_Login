import { interceptProfile, interceptUserExists,handleUncaughtException,interceptOtpRequest, users } from "./utils";

describe("template spec", () => {
 
  const visit_tradebin="/";
  const visit_blog="/blog";
  function performPassLogin(user_data , password ,full_name ,visit_option){
    const exist_status=true;
    const pass_status=true;
    cy.visit(visit_option);
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    handleUncaughtException();
    interceptUserExists(exist_status,pass_status); 
    interceptProfile();
    interceptOtpRequest();
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


  it("Should test Scenario of user having password logging in with username in tradebin", () => { 
    performPassLogin(users.username_user.username,users.username_user.password,users.username_user.full_name,visit_tradebin)
  });

  it("Should test Scenario of user having password logging in with phone number in tradebin" , ()=>{
    performPassLogin(users.username_user.phoneNumber,users.username_user.password,users.username_user.full_name,visit_tradebin)
  });
  it("Should test Scenario of user having password logging in with email in tradebin",()=>{
    performPassLogin(users.username_user.email,users.username_user.password,users.username_user.full_name,visit_tradebin)
  });
  it("Should test Scenario of user having password logging in with username in tradebin blog", () => {
    performPassLogin(users.username_user.username,users.username_user.password,users.username_user.full_name,visit_blog)
  });
  it("Should test Scenario of user having password logging in with phone number in tradebin blog" , ()=>{
    performPassLogin(users.username_user.phoneNumber,users.username_user.password,users.username_user.full_name,visit_blog)
  });
  it("Should test Scenario of user having password logging in with email in tradebin blog",()=>{
    performPassLogin(users.username_user.email,users.username_user.password,users.username_user.full_name,visit_blog)
  });
});
