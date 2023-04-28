import axios, { AxiosInstance } from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import { setupCache } from 'axios-cache-interceptor';

export class UserGroupService {

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

  getUserGroups = async (): Promise<any> => {
    return this.instance.get(`/usergroups`)
      .then((res: { data: any; }) => {
        return res.data.data;
      })
      .catch((error: any) => console.error(error)
      );
    ;
  };  

  createUserGroup = async (name: string, role: string): Promise<any> => {
    return this.instance.post(`/usergroups/add`, { name, role })
   .catch((error: any) => console.error(error));
  };

  updateUserGroup = async (id: number, name: string, role: string): Promise<any> => {
    return this.instance.post(`/usergroups/update/{id}`, { id, name, role })
   .catch((error: any) => console.error(error));
  };

  deleteUserGroup = async (id: number): Promise<any> => {
    return this.instance.post(`/usergroups/delete/{id}`, { id })
   .catch((error: any) => console.error(error));
  };

  
}
