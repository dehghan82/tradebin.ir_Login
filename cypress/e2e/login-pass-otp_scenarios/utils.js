export const users = {
  emailUser: {
    email: "khalili.tayebeh55@gmail.com",
    password: "Z82F84_r87",
  },
  phoneUser: {
    phoneNumber: "09360257232",
    password: "Z82F84_r87",
    full_name: "نرگس دهقان",
  },
  otp_phone_user: {
    verifiedEmail: "z.abbasgholi10@gmail.com",
    phoneNumber: "09944854093",
    otpCode: "123456",
  },
  username_user: {
    email: "khalili.tayebeh55@gmail.com",
    phoneNumber: "09360257232",
    username: "narges84",
    password: "Z82F84_r87",
    full_name: "نرگس دهقان",
  },
};
export const urls = {
  filters:
    "https://api-v2.tradebin.ir/market-screener/api/v1/custom-screeners/?page_size=-1",
  userExists: "https://auth.tradebin.ir/auth/user/exists/*",
  gozaresh_tajmiee:
    "https://ui.tradebin.ir/market/codal/aggregate_report/income_statement/?category_id=34295935482222451",
  profile: "https://auth.tradebin.ir/auth/profile/*",
  otpRequest: "https://auth.tradebin.ir/auth/otp/request/login-or-signup/",
  jadval_vorod_khroj:
    "https://api-v2.tradebin.ir/instrument-overview/api/v1/capital-flow/all-instruments?page_size=-1&date=2024-08-04",
  naghshe_sarane_kharid_forosh:
    "https://api-v2.tradebin.ir/instrument-overview/api/v1/per-capita/sector?page_size=-1&date=2024-08-04&market_cap_min=0&market_cap_max=10000",
  goroh_boorsi:
    "https://api.tradebin.ir/sergeant/api/v1/category_growth_data/?page_size=-1&n_month=2&sort_type=desc",
  index_daily_summary:
    "https://api-v2.tradebin.ir/market-overview/api/v1/index-daily-summary?page_size=-1",
  collect_data: "https://www.google-analytics.com/g/collect**",
  otpVerify: "https://auth.tradebin.ir/auth/otp/verify/login-or-signup/",
};
export const handleUncaughtException = () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    if (err.message.includes("Invalid token specified")) {
      return false;
    }
    return true;
  });
};
export const interceptUserExists = (exist_status, pass_status) => {
  cy.intercept("GET", urls.userExists, (req) => {
    req.continue((res) => {
      expect(res.body).to.have.property("user_exists", exist_status);
      expect(res.body).to.have.property("user_has_password", pass_status);
    });
  }).as("userExistance");
};
export const firstProfile =() => {
cy.intercept("GET","https://auth.tradebin.ir/auth/profile/?redirect_to=https://tradebin.ir&need_token=true",{
    statusCode:200,
}).as("firstProfile");
};
export const interceptProfile = () => {
  cy.intercept("GET", urls.profile, {
    statusCode: 200,
    body: {
      username: "zahra1212",
      first_name: "زهرا",
      last_name: "دهقان",
      phone_number: "09944854093",
      email: "farhangi.comp.iust@gmail.com",
      email_verified: true,
      birthday: "2003-03-03",
      gender: "female",
      user_has_password: false,
    },
  }).as("profile");
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

  cy.intercept("POST", urls.otpVerify, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        success: true,
        token: "mockToken123",
      },
    });
  }).as("OTP_validate");
};
