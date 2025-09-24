import axios from "axios";
import toast from "react-hot-toast";
import { Toast } from "types/app";

export default function handleError(err: any, toastType?: Toast, silent?: boolean) {
  const error = err;
  let toastMessage = "";
  if (axios.isAxiosError(err)) {
    toastMessage = error.response?.data?.error
      ? error.response?.data?.error
      : error.response?.data?.code
      ? error.response?.data?.code
      : error.response?.data?.message;
  } else if (err instanceof Error) {
    toastMessage = error.message || error.response?.data?.error;
  } else {
    toastMessage = error?.data?.error;
  }
  if (!silent)
    toast.error(toastMessage || "Something went wrong!!", { id: toastType || Toast.FALLBACK });
}
