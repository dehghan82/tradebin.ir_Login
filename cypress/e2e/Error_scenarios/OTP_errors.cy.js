import {
  data,
  handleUncaughtException,
  interceptRequests_firstOTP,
  interceptRequests_secondOTP,
  interceptRequests_wrongOTP,
  generateRandomIranianPhoneNumber,
} from "./OTP_errors_data";

describe("Login scenarios", () => {
  
  const phoneNumber_success = generateRandomIranianPhoneNumber();
  const phoneNumber_fail= generateRandomIranianPhoneNumber();
  const visit_tradebin = "/";
  const visit_blog = "/blog";
  beforeEach(() => {
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
  }
  function otpErr(visit_page, login_option, user_exist, pass_status) {
    const otp_type = "@OTP_First";
    cy.visit(visit_page);

    interceptRequests_firstOTP(user_exist, pass_status);
    performOtpLogin(login_option, otp_type, data.otp);
    cy.get("div.Toastify div").contains("کد تایید ارسال شد.");
    cy.get("button").contains("بازگشت").click();
    interceptRequests_secondOTP(user_exist,pass_status);
    const otp_type2 = "@OTP_Second";
    performOtpLogin(login_option, otp_type2, data.otp);
    cy.get("div.Toastify").contains("کد تایید قبلا ارسال شده است");
  }
  function wrongOtp(visit_page,num) {
    const otp_type = "@OTP_wrong";
    cy.visit(visit_page);

    interceptRequests_wrongOTP();
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");

    cy.get('input[name="username"]').focus().clear().type(num);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance_false");
    cy.wait(otp_type);
    cy.get("div.Toastify div").contains("کد تایید ارسال شد.");
    cy.get("input#otpPassword").type(data.wrong_otp);
    cy.contains("h5", "ثبت‌نام").should("exist");

    cy.get('button[type="submit"]').contains("ثبت‌نام").click();

    cy.get("div.Toastify").contains("رمز یک‌بار مصرف واردشده اشتباه است");
  }
  it("Should send the otp to phone number for the first time and give error for otp back in tradebin", () => {
    otpErr(visit_tradebin, data.user_nopass_phonenum, true, false);
  });
  it("Should send the otp to email for the first time and give error for otp back in tradebin", () => {
    otpErr(visit_tradebin, data.verifiedEmail, true, false);
  });
  it("Should show toast error of wrong otp to user who is using phone number in tradebin", () => {
    wrongOtp(visit_tradebin,phoneNumber_success);
  });
  it("Should send the otp to phone number for the first time and give error for otp back in tradebin blog", () => {
    const phone_num = generateRandomIranianPhoneNumber();
    otpErr(visit_blog, phone_num, false, false);
  });
  it("Should send the otp to email for the first time and give error for otp back in tradebin blog", () => {
    const email = "z.abbasgholi10@gmail.com";
    otpErr(visit_blog, email, true, false);
  });
  it("Should show toast error of wrong otp to user who is using phone number in tradebin blog", () => {
    wrongOtp(visit_blog,phoneNumber_fail);
  });
});
