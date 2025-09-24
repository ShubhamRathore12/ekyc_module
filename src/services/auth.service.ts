import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import authSlice from "slices/auth.slice";
import { store } from "store";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "types/admin";
import { LoginRequest, LoginResponse } from "../types/auth";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error.response.status === 401) {
        toast.error("Your session is expired! Please login again.", { id: "401" });
        store.dispatch(authSlice.actions.logout());
      }
    } catch (error) {
      console.error(error);
    }
    return Promise.reject(error);
  }
);

class AuthAPI {
  login(credentials: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return authClient.post("/admin/login", credentials, {
      withCredentials: true,
    });
  }
  setOtp(credentials: ForgotPasswordRequest): Promise<AxiosResponse<ForgotPasswordResponse>> {
    return authClient.put("/admin/forget-password/send-otp", credentials);
  }
  verifyOTP(credentials: VerifyOTPRequest): Promise<AxiosResponse<VerifyOTPResponse>> {
    const { at, otp } = credentials;
    return authClient.put(
      "/admin/forget-password/verify",
      {
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${at}`,
        },
      }
    );
  }
  resetPassword(
    credentials: UpdatePasswordRequest
  ): Promise<AxiosResponse<UpdatePasswordResponse>> {
    const { at, ...rest } = credentials;
    return authClient.put(
      "/admin/forget-password/reset",
      { ...rest },
      {
        headers: {
          Authorization: `Bearer ${at}`,
        },
      }
    );
  }
}

export const authApi = new AuthAPI();
