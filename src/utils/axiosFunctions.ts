import { setAccessToken, logout } from "@/redux/slices/authSlice";
import logoutService from "@/services/logoutService";
import {store} from "@/redux/storefile/store";
import Cookies from "js-cookie";
import { noAuthInstance } from "./axios";

// ====================== Token Expiry Helpers ======================

/**
 * Gets the access token expiry time from cookies.
 */
const getExpiryTime = (): number | null => {
  const expiryTime = Cookies.get("expiryTime");
  return expiryTime ? parseInt(expiryTime, 10) : null;
};

/**
 * Sets the access token expiry time to 5 minutes from now.
 */
const setExpiryTime = (): void => {
  const currentTime = new Date().getTime();
  const newExpiryTime = currentTime + 5 * 60 * 1000;
  Cookies.set("expiryTime", newExpiryTime.toString(), {
    path: "/",
    secure: true,
  });
};

/**
 * Checks if the current token has expired based on the stored expiry time.
 */
const hasTokenExpired = (): boolean => {
  const expiryTime = getExpiryTime();
  const currentTime = new Date().getTime();
  return !expiryTime || currentTime >= expiryTime;
};

// ====================== Logout Handler ======================

/**
 * Logs out the user by calling the logout service and clearing Redux + cookies.
 */
const logoutUser = async (): Promise<void> => {
  try {
    await logoutService();
  } catch (error) {
    console.error("Error while user logout API", error);
  }

  Cookies.remove("expiryTime", {path: "/"});
  store.dispatch(logout());
};

// ====================== Token Refresh Handler ======================

/**
 * Refreshes the access token using a stored refresh token.
 * Dispatches new token to Redux and updates expiry.
 */
const refreshToken = async (): Promise<string | null> => {
  console.log("Entered in refresh token logic");

  try {
    const response = await noAuthInstance.post<{access: string}>(
      "accounts/api/token/refresh/"
    );

    const newAccessToken = response.data.access;

    if (newAccessToken) {
      store.dispatch(setAccessToken({accessToken: newAccessToken}));
      console.log("New access token", newAccessToken);
      setExpiryTime();
      return newAccessToken;
    } else {
      console.warn("Refresh failed, no access token returned");
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed, logging out...", error);
    await logoutUser();
    window.location.href = "/";
    return null;
  }
};

// ====================== Exports ======================

export {
  setExpiryTime,
  refreshToken,
  logoutUser,
  hasTokenExpired,
  getExpiryTime,
};
