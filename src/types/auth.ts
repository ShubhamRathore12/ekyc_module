export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  status: "success" | "failed";
  data: {
    admin_type:
      | "kra"
      | "telecaller"
      | "super_admin"
      | "backoffice"
      | "grootsupport"
      | "lms_user"
      | "mf_user" | 'sub_user' | 'stx_user';

    username: string;
  };
}