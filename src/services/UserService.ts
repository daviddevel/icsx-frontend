import axios, { AxiosInstance } from "axios";
import { setupCache } from 'axios-cache-interceptor';
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class UserService {

  protected readonly instance: AxiosInstance;
  
  public constructor(url: string) {
    this.instance = setupCache(axios.create(
      {
        baseURL: url,
        headers: getAuthorizationHeader(),
        timeout: 30000,
        timeoutErrorMessage: "Time out!",
      }
    ));
  }

  getUsers = async (): Promise<any> => {
    return this.instance.get("/users")
      .then((res: { data: any; }) => {
        return res.data.data;
      })
      .catch((error: any) => { console.log(error)
        return {
          status: error.status,
          data: error.response
        }
      })
  }

  createICSXUser = async (
    username: string,
    investor: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    firm: string,
    activation: string,
    role: string,
    expired: string): Promise<any> => {
    return this.instance.post(`/users/icsx/add`, { username, investor, name, email, phone, password, firm, activation, role, expired })
   .catch((error: any) => console.error(error));
  };

}