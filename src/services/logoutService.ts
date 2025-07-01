import {noAuthInstance} from "@/utils/axios";

interface LogoutResponse {
  message: string; // Adjust based on actual API response
}

const logoutService = async (): Promise<LogoutResponse> => {
  const response = await noAuthInstance.post<LogoutResponse>(
    "accounts/logout/",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export default logoutService;
