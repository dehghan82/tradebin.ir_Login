export const users = {
  emailUser: {
    email: "khalili.tayebeh55@gmail.com",
    password: "Z82F84_r88",
  },
  phoneUser: {
    phoneNumber: "09123182007",
    password: "Z82F84_r87",
  },
  userName: {
    username: "dehghan_z82",
    password: "hello1233Z?",
  },
};

export const urls = {
  userExists: "https://auth.tradebin.ir/auth/user/exists/*",
  profile: "https://auth.tradebin.ir/auth/profile/*",
  otpRequest: "https://auth.tradebin.ir/auth/otp/request/login-or-signup/",
  LoginReq: "https://auth.tradebin.ir/auth/login/",
};

export const interceptUserExists = () => {
  cy.intercept("GET", urls.userExists, (req) => {
    req.continue((res) => {
      expect(res.body).to.have.property("user_exists", true);
      expect(res.body).to.have.property("user_has_password", true);
    });
  }).as("userExistance");
};

export const interceptProfile = () => {
  cy.intercept("GET", urls.profile).as("profile");
};

export const interceptLoginPass = () => {
  cy.intercept("POST", urls.LoginReq).as("loginPass");
};

export const interceptOtpRequest = () => {
  cy.intercept("POST", urls.otpRequest, (req) => {
    req.continue((res) => {
      expect(res.body).to.have.property(
        "description",
        "OTP sent successfully."
      );
    });
  }).as("OTP_send");
};

export const login = (username, password,visit_page) => {
  cy.visit(visit_page);
  cy.get("a.login-btn").contains("ورود").click();
  cy.url().should("contain", "/auth");

  interceptUserExists();
  interceptProfile();
  interceptLoginPass();

  cy.get('input[name="username"]').focus().clear().type(username);
  cy.get('button[type="submit"]').contains("تایید").click();

  cy.wait("@userExistance");

  cy.contains("label", "گذرواژه").siblings("input").should("exist");

  cy.get("div.text-end.mb-3").contains("گذرواژه خود را وارد کنید");

  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').contains("ورود").click();
  cy.wait("@loginPass").its("response.statusCode").should("eq", 464);

  cy.get("div.Toastify").contains("گذرواژه اشتباه است");
};

export const loginWithOtp = (username,visit_page) => {
  cy.visit(visit_page);

  interceptUserExists();
  interceptOtpRequest();

  cy.get("div.login-button.clickable").contains("ورود").click();

  cy.get('input[name="username"]').focus().clear().type(username);
  cy.get('button[type="submit"]').contains("ورود").click();

  cy.wait("@userExistance");

  cy.contains("label", "گذرواژه").siblings("input").should("exist");

  cy.get("div.text-end.mb-3").contains("کد تائید ارسال‌شده را وارد کنید");

  cy.get("div a").contains("ورود با رمز یکبار مصرف").click();
  cy.wait("@OTP_send").its("response.statusCode").should("eq", 201);

  cy.get("div").contains("کد تائید ارسال‌شده را وارد کنید");
};
