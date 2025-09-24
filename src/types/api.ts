export type AxiosApiError = AxiosError<ApiErrorDetails>;
import type { AxiosError } from "axios";
export interface APIError {
  status: "failed";
  error: string;
}

export type ApiErrorDetails = {
  action: string;
  error: string;
  status: string;
};
