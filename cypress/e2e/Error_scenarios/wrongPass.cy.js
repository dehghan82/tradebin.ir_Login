import { login, users } from "./wrongPass_data";

describe("Login Tests", () => {
  it("Should show error of wrong password for user logging in with email", () => {
    const { email, password } = users.emailUser;
    login(email, password);
  });

  it("Should show error of wrong password for user logging in with mobile phone", () => {
    const { phoneNumber, password } = users.phoneUser;
    login(phoneNumber, password);
  });

  it("Should show error of wrong password for user logging in with username", () => {
    const { username, password } = users.userName;
    login(username, password);
  });
});
