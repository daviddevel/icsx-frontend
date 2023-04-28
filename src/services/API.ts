import axios, { AxiosInstance } from 'axios';

export default class API {

    public readonly instance: AxiosInstance;

    public constructor(url: string) {
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!",
        });
    }


}

export const BASE_URL_API = "http://localhost:8080"
