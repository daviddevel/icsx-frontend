import axios, { AxiosInstance } from "axios";
import { setupCache } from 'axios-cache-interceptor';
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class IssueService {

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

  getIssues = async (): Promise<any> => {
    return this.instance.get("/issues")
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

  createIssue = async (
    icode: string, 
    inameAbbrev: string, 
    inameEnglishAbbrev: string, 
    iname: string, 
    inameEnglish: string): Promise<any> => {
    return this.instance.post(`/issues/add`, 
    { icode, inameAbbrev, inameEnglishAbbrev, iname, inameEnglish })
   .catch((error: any) => console.error(error));
  };

  updateIssue = async (
    id: number,
    icode: string, 
    inameAbbrev: string, 
    inameEnglishAbbrev: string, 
    iname: string, 
    inameEnglish: string): Promise<any> => {
    return this.instance.post(`/issues/update/{id}`, { id, icode, inameAbbrev, inameEnglishAbbrev, iname, inameEnglish })
   .catch((error: any) => console.error(error));
  };

}