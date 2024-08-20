import {
  urls,
  generateRandomIranianPhoneNumber,
  generateRandomEmail,
} from "./test_data";

describe("Signup scenario", () => {
  const visit_tradebin = "/";
  const visit_blog = "/blog";
  function interceptUserExistence() {
    cy.intercept("GET", urls.userExists, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("user_exists", false);
        expect(res.body).to.have.property("user_has_password", false);
      });
    }).as("userExistance");
  }
  function signupErrors(signup_type, visit_page) {
    cy.visit(visit_page);
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    interceptUserExistence();

    cy.get('input[name="username"]').focus().clear().type(signup_type);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.get("div.Toastify").contains(
      "حساب کاربری با مشخصات وارد شده وجود ندارد. لطفا از شماره تلفن همراه برای ساخت حساب کاربری استفاده نمایید."
    );
  }
  function otpSignup(visit_page) {
    const randomPhoneNumber = generateRandomIranianPhoneNumber();

    Cypress.on("uncaught:exception", (err, runnable) => {
      if (err.message.includes("Invalid token specified")) {
        return false;
      }
      return true;
    });

    cy.visit(visit_page);
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
  }

  it("Should ban the user from logging in with email in tradebin", () => {
    const randomEmail = generateRandomEmail();
    signupErrors(randomEmail, visit_tradebin);
  });
  it("Should show error for invalid phone number in tradebin", () => {
    const invalid_phonenum = "00000000000";
    signupErrors(invalid_phonenum, visit_tradebin);
  });

  it("Should signup using phone number with otp login in tradebin", () => {
    otpSignup(visit_tradebin);
  });
  it("Should ban the user from logging in with email in tradebin blog", () => {
    const randomEmail = generateRandomEmail();
    signupErrors(randomEmail, visit_blog);
  });
  it("Should show error for invalid phone number in tradebin", () => {
    const invalid_phonenum = "00000000000";
    signupErrors(invalid_phonenum, visit_blog);
  });
  it("Should signup using phone number with otp login in tradebin blog", () => {
    otpSignup(visit_blog);
  });
});
