export interface Option {
  title: string;
  type: string;
  disabled?: boolean;
}

export enum Toast {
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  FALLBACK = "FALLBACK",
  LOGIN_ERROR = "LOGIN_ERROR",
}
