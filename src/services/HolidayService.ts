import axios, { AxiosInstance } from "axios";
import { setupCache } from 'axios-cache-interceptor';
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class HolidayService {

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
  
  getHolidays = async (): Promise<any> => {
    return this.instance.get("/holidays")
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

  createHoliday = async (date: string, status: number, comment: string): Promise<any> => {
    return this.instance.post(`/holidays/add`, { date, status, comment })
   .catch((error: any) => console.error(error));
  };

  updateHoliday = async (id: number, date: string, status: number, comment: string): Promise<any> => {
    return this.instance.post(`/holidays/update/{id}`, { id, date, status, comment })
   .catch((error: any) => console.error(error));
  };

  deleteHoliday = async (id: number): Promise<any> => {
    return this.instance.post(`/holidays/delete/{id}`, { id })
   .catch((error: any) => console.error(error));
  };

}