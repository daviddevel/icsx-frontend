import axios, { AxiosInstance } from "axios";
import { setupCache } from 'axios-cache-interceptor';
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class AdvertisementService {

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

  getAdvertisements = async (): Promise<any> => {
    return this.instance.get("/advertisements")
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

  createAdvertisement = async (
    company: string, 
    website?: string, 
    photo?: string, 
    description?: string, 
    Email?: string, 
    phone?: string, 
    release?: string, 
    expire?: string, 
    activated?: number) : Promise<any> => {
    return this.instance.post(`/advertisements/add`, { company, website, photo, description, Email, phone, activated, release, expire })
   .catch((error: any) => console.error(error));
  };

}