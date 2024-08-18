import {
  urls,
  generateRandomIranianPhoneNumber,
  generateRandomEmail,
} from "./test_data";

describe("Signup scenario", () => {
  function interceptUserExistence() {
    cy.intercept("GET", urls.userExists, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("user_exists", false);
        expect(res.body).to.have.property("user_has_password", false);
      });
    }).as("userExistance");
  }

  it("Should ban the user from logging in with email", () => {
    const randomEmail = generateRandomEmail();

    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    interceptUserExistence();

    cy.get('input[name="username"]').focus().clear().type(randomEmail);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.get("div.Toastify").contains(
      "حساب کاربری با مشخصات وارد شده وجود ندارد. لطفا از شماره تلفن همراه برای ساخت حساب کاربری استفاده نمایید."
    );
  });
  it("Should show error for invalid phone number", () => {
    const invalid_phonenum = "00000000000";
    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    interceptUserExistence();

    cy.get('input[name="username"]').focus().clear().type(invalid_phonenum);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.get("div.Toastify").contains(
      "حساب کاربری با مشخصات وارد شده وجود ندارد. لطفا از شماره تلفن همراه برای ساخت حساب کاربری استفاده نمایید."
    );
  });

  it("Should signup using phone number with otp login", () => {
    const randomPhoneNumber = generateRandomIranianPhoneNumber();

    Cypress.on("uncaught:exception", (err, runnable) => {
      if (err.message.includes("Invalid token specified")) {
        return false;
      }
      return true;
    });

    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    interceptUserExistence();

    cy.intercept("POST", urls.otpRequest, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property(
          "description",
          "OTP sent successfully."
        );
      });
    }).as("OTP_send");

    cy.intercept("POST", urls.otpVerify, (req) => {
      req.reply({
        statusCode: 200,
        body: { success: true, token: "mockToken123" },
      });
    }).as("OTP_validate");

    cy.intercept("GET", urls.userProfile, (req) => {
      req.reply({ statusCode: 200 });
    }).as("profile");

    cy.get('input[name="username"]').focus().clear().type(randomPhoneNumber);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.wait("@OTP_send");
    cy.contains("h5", "ثبت‌نام").should("exist");

    cy.get("div.text-end.mb-3").contains("کد تایید ارسال‌شده را وارد کنید");
    cy.get('input[name="otpPassword"]').type("123456");
    cy.get('button[type="submit"]').contains("ثبت‌نام").click();

    cy.wait("@OTP_validate").then((interception) => {
      console.log("OTP validation response:", interception.response);
    });

   // cy.wait("@profile");
  });
});
