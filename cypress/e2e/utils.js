export const users = {
  emailUser: {
    email: "khalili.tayebeh55@gmail.com",
    password: "Z82F84_r87",
  },
  phoneUser: {
    phoneNumber: "09360257232",
    password: "Z82F84_r87",
    full_name:"نرگس دهقان",
  },
  username_user: {
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
