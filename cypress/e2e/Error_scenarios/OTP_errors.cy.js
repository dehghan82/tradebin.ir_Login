import {
  data,
  handleUncaughtException,
  interceptRequests_firstOTP,
  interceptRequests_secondOTP,
  interceptRequests_wrongOTP,
  generateRandomIranianPhoneNumber,
} from "./OTP_errors_data";

describe("Login scenarios", () => {
  const phoneNumber = generateRandomIranianPhoneNumber();
  beforeEach(() => {
    cy.visit("/");
    handleUncaughtException();
  });

  function performOtpLogin(phoneNumber, otp_type, otp_code) {
    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");

    cy.get('input[name="username"]').focus().clear().type(phoneNumber);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.wait(otp_type);
    cy.contains("h5", "ورود").should("exist");
  }

  it("Should send the otp to phone number for the first time and give error for otp back", () => {
    const otp_type = "@OTP_First";
    interceptRequests_firstOTP();
    performOtpLogin(data.user_nopass_phonenum, otp_type, data.otp);
    cy.get("div.Toastify div").contains("کد تایید ارسال شد.");
    cy.get("button").contains("بازگشت").click();
    interceptRequests_secondOTP();
    const otp_type2 = "@OTP_Second";
    performOtpLogin(data.user_nopass_phonenum, otp_type2, data.otp);
    cy.get("div.Toastify").contains("کد تایید قبلا ارسال شده است");
  });
  it("Should send the otp to email for the first time and give error for otp back", () => {
    const otp_type = "@OTP_First";
    interceptRequests_firstOTP();
    performOtpLogin(data.verifiedEmail, otp_type, data.otp);
    cy.get("div.Toastify div").contains("کد تایید ارسال شد.");
    cy.get("button").contains("بازگشت").click();
    interceptRequests_secondOTP();
    const otp_type2 = "@OTP_Second";
    performOtpLogin(data.verifiedEmail, otp_type2, data.otp);
    cy.get("div.Toastify").contains("کد تایید قبلا ارسال شده است");
  });

  it("Should show toast error of wrong otp to user who is using phone number", () => {
    const otp_type = "@OTP_wrong";
    interceptRequests_wrongOTP();
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");

    cy.get('input[name="username"]').focus().clear().type(phoneNumber);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance_false");
    cy.wait(otp_type);
    cy.get("div.Toastify div").contains("کد تایید ارسال شد.");
    cy.get('input#otpPassword').type(data.wrong_otp);
    cy.contains("h5", "ثبت‌نام").should("exist");

    cy.get('button[type="submit"]').contains("ثبت‌نام").click();
    
    cy.get("div.Toastify").contains("رمز یک‌بار مصرف واردشده اشتباه است");
  });
});
