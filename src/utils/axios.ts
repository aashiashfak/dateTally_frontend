import axios from "axios";
import {store} from "@/redux/storefile/store";
import {hasTokenExpired, refreshToken} from "./axiosFunctions";

const isLocalhost = window.location.hostname === "localhost";

const baseURL = isLocalhost
  ? "http://localhost:8000/"
  : "https://shoeclub.vercel.app/";

// Axios instance for regular API calls
export const instance = axios.create({
  baseURL: baseURL,
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
});

// Axios instance for unauthenticated API calls
export const noAuthInstance = axios.create({
  baseURL: baseURL,
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
});

// Request interceptor to refresh token if needed before sending any request
instance.interceptors.request.use(
  async (config) => {
    console.log("Inside request interceptor");

    const state = store.getState();
    const isAuthenticated = state.userAuth.isAuthenticated;
    const accessToken = state.userAuth.accessToken;

    console.log("User logged in:", isAuthenticated);

    if (!isAuthenticated || !accessToken) {
      console.log(
        "No user logged in or no access token available, skipping refresh logic."
      );
      return config;
    }

    if (hasTokenExpired()) {
      console.log("Access token expired, attempting to refresh...");
      const newAccessToken = await refreshToken();

      if (!newAccessToken) {
        console.error("Token refresh failed.");
        return Promise.reject("Token refresh failed");
      }

      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }
    } else {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
