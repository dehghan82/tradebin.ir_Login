
export const urls = {
    userExists: "https://auth.tradebin.ir/auth/user/exists/*",
    otpRequest: "https://auth.tradebin.ir/auth/otp/request/login-or-signup/",
    otpVerify: "https://auth.tradebin.ir/auth/otp/verify/login-or-signup/",
    profile: "https://auth.tradebin.ir/auth/profile/*",
  };
  
  export const data = {
    verifiedEmail: "reyhaneh.dehghan1400@gmail.com",
    user_nopass_phonenum: "09903288674",
    user_nopass_email:"dehghanfatemeh1400@gmail.com",
    //user_nopass_phonenum:"09354487877",
    otpCode: "0000",
    wrong_otp:"0912",
    otp:"90901",
  };
  
  export const handleUncaughtException = () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes("Invalid token specified")) {
        return false;
      }
      return true;
    });
  };
  export function generateRandomIranianPhoneNumber() {
    const prefixes = ["0910", "0911", "0912", "0913", "0914", "0915", "0916", "0917", "0918", "0919", "0920", "0921", "0922", "0923"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return randomPrefix + randomNumber;
  }
  export const interceptRequests_secondOTP=()=>{
    cy.intercept("GET", urls.userExists, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("user_exists", true);
        expect(res.body).to.have.property("user_has_password", false);
      });
    }).as("userExistance");
  
    cy.intercept("POST",urls.otpRequest,(req)=>{
      req.continue((res) => {
        expect(res.body).to.have.property("description", "Message has been sent before.");
      });
    }).as("OTP_Second");
  }
  export const interceptRequests_wrongOTP=()=>{
    cy.intercept("GET", urls.userExists, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("user_exists", false);
        expect(res.body).to.have.property("user_has_password", false);
      });
    }).as("userExistance_false");
  
    cy.intercept("POST", urls.otpRequest, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("description", "OTP sent successfully.");
      });
    }).as("OTP_wrong");
   
  }
  
  export const interceptRequests_firstOTP = () => {
    cy.intercept("GET", urls.userExists, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("user_exists", true);
        expect(res.body).to.have.property("user_has_password", false);
      });
    }).as("userExistance");
  
    cy.intercept("POST", urls.otpRequest, (req) => {
      req.continue((res) => {
        expect(res.body).to.have.property("description", "OTP sent successfully.");
      });
    }).as("OTP_First");
  };
  