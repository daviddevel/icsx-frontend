import { authService } from "../../services";
import Cookies from "js-cookie";
import { UserSignup } from "../../types/user";

export const useSignup = () => {
  const signup = async (registerdata: UserSignup) => {
    const userSignup = await authService.signup(registerdata);
    if (userSignup) {
      Cookies.set("currentUser", JSON.stringify(userSignup));
    }
    return userSignup as unknown as UserSignup;
  };

  return { signup };
};
