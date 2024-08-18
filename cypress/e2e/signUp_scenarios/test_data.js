
export const urls = {
    userExists: "https://auth.tradebin.ir/auth/user/exists/*",
    otpRequest: "https://auth.tradebin.ir/auth/otp/request/login-or-signup/",
    otpVerify: "https://auth.tradebin.ir/auth/otp/verify/login-or-signup/",
    userProfile: "https://auth.tradebin.ir/auth/profile/*",
  };
  
  export function generateRandomIranianPhoneNumber() {
    const prefixes = ["0910", "0911", "0912", "0913", "0914", "0915", "0916", "0917", "0918", "0919", "0920", "0921", "0922", "0923"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return randomPrefix + randomNumber;
  }
  
  export function generateRandomEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for (let i = 0; i < 10; i++) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${string}@example.com`;
  }
  