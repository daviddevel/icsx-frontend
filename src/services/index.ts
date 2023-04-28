import API from "./API";
import { AuthService } from "./AuthService";

const BaseURL = "//localhost:8080";

export const apiService = new API(BaseURL);
export const authService = new AuthService();