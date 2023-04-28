import axios, { AxiosInstance } from "axios";
import { setupCache } from 'axios-cache-interceptor';
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class FirmService {

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

  getFirms = async (): Promise<any> => {
    return this.instance.get("/firms")
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

  createFirm = async (
    code: string, 
    abbr: string, 
    name: string, 
    email: string, 
    phone: string, 
    address: string, 
    logo: string): 
    Promise<any> => { return this.instance.post(`/firms/add`, { code, abbr, name, email, phone, address, logo })
   .catch((error: any) => console.error(error));
  };

  updateFirm = async (
    id: number,
    code: string, 
    abbr: string, 
    name: string, 
    email: string, 
    phone: string, 
    address: string, 
    logo: string): 
    Promise<any> => {
    return this.instance.post(`/firms/update/{id}`, { id, code, abbr, name, email, phone, address, logo })
   .catch((error: any) => console.error(error));
  };

  deleteFirm = async (id: number): Promise<any> => {
    return this.instance.post(`/firms/delete/{id}`, { id })
   .catch((error: any) => console.error(error));
  };

  uploadFirmLogo = async (file: string): Promise<any> => {
    return this.instance.post(`/upload`, { file })
   .catch((error: any) => console.error(error));
  };





}