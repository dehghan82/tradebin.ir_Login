import {
  urls,
  users,
  handleUncaughtException,
  interceptUserExists,
  firstProfile,
  interceptProfile,
  interceptOtpRequest,
} from "./utils";

describe("Login scenarios", () => {
  beforeEach(() => {
    const exist_status=true;
    const pass_status=false;
    cy.visit("/");
    cy.get("a.login-btn").contains("ورود").click();
    cy.url().should("contain", "/auth");
    handleUncaughtException();
    interceptUserExists(exist_status,pass_status); 
    firstProfile();
    interceptProfile();
    interceptOtpRequest();
  });

  function performOtpLogin() {
    cy.get('input[name="username"]').focus().clear().type(users.otp_phone_user.phoneNumber);
    cy.get('button[type="submit"]').contains("تایید").click();

    cy.wait("@userExistance");
    cy.wait("@OTP_send");
    cy.contains("h5", "ورود").should("exist");

    cy.get('div.text-end.mb-3').contains("کد تایید ارسال‌شده را وارد کنید");
    cy.get('input[name="otpPassword"]').type(users.otp_phone_user.otpCode);
    interceptProfile();
    cy.get('button[type="submit"]').contains("ورود").click();

    cy.wait("@OTP_validate")
    // .then((interception) => {
    //   console.log("OTP validation response:", interception.response);
    //   // You can verify the token if needed
    //   expect(interception.response.body).to.have.property('token', 'mockToken123');
    // });

     cy.wait("@firstProfile");
     //cy.wait("@profile");
     //.then((interception) => {
    //   console.log("Profile response:", interception.response);
    //   // Ensure the profile request was successful
    //   expect(interception.response.statusCode).to.equal(200);

    // });

    cy.url().should("include", "/market");
  }

  it("Should login using phone number with otp login", () => {
    performOtpLogin();
  });

  // it("Should login using Email with otp login", () => {
  //   performOtpLogin(data.verifiedEmail);
  // });
});
