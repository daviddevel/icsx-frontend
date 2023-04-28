import { apiService } from ".";
import { UserSignup } from "../types/user";

export class AuthService {
  
  signup = (registerdata: UserSignup) => {
    return apiService.instance
    .post("/auth/register",
    {
        registerdata
      })
  };

  login = (username: string, password: string) => {
    return apiService.instance
      .post("/auth/login", {
        username,
        password,
      })
      .then((res) => {
        return {
          username: res.data.username,
          id: res.data.id,
          accessToken: res.data.accessToken,
          expiredAt: res.data.expiredAt
        };
      });
  };
  }
