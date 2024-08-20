import { login, users } from "./wrongPass_data";

describe("Login Tests", () => {
  const visit_tradebin = "/";
  const visit_blog = "/blog";
  it("Should show error of wrong password for user logging in with email in tradebin", () => {
    const { email, password } = users.emailUser;
    login(email, password, visit_tradebin);
  });

  it("Should show error of wrong password for user logging in with mobile phone in tradebin", () => {
    const { phoneNumber, password } = users.phoneUser;
    login(phoneNumber, password, visit_tradebin);
  });

  it("Should show error of wrong password for user logging in with username in tradebin", () => {
    const { username, password } = users.userName;
    login(username, password, visit_tradebin);
  });
  it("Should show error of wrong password for user logging in with email in tradebin blog", () => {
    const { email, password } = users.emailUser;
    login(email, password, visit_blog);
  });
  it("Should show error of wrong password for user logging in with mobile phone in tradebin blog", () => {
    const { phoneNumber, password } = users.phoneUser;
    login(phoneNumber, password, visit_blog);
  });
  it("Should show error of wrong password for user logging in with username in tradebin blog", () => {
    const { username, password } = users.userName;
    login(username, password, visit_blog);
  });
});
