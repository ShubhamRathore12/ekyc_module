//common

interface Response {
  message: string;
  success: "success" | "failed";
}

export interface SearchAdminRequest {
  admin_id?: string;
  username?: string;
  email?: string;
  name?: string;
  phone_number?: string;
}

export interface SearchAdminResponse {
  success: boolean;
  message: string;
  data: AdminEntity[];
}

//create admin
export interface CreateAdminRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  phone_number?: string;
  location?: string;
  admin_type?: string;   
  created_by?: string;
}

export type CreateAdminResponse = Response;

//get admin

export interface GetAdminRequest {
  username?: string;
  page_number: number;
  no_of_records: number;
  email?: string;
  is_blocked?: string;
  admin_type?: string;
  created_by?: string;
  from_date?: string;
  to_date?: string;
}

export interface GetAdminResponse {
  message: string;
  status: string;
  data: GetAdminData;
}
export interface GetAdminData {
  admin: AdminEntity[];
  no_of_pages: number;
  total_no_of_records: number;
}
export interface AdminEntity {
  admin_id: string;
  username: string;
  email: string;
  name: string;
  password_changed: boolean;
  phone_number: string;
  created_by: string;
  admin_type: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  otp: string;
  expiration_time: string;
  otp_verified: boolean;
  location: string;
}

//new password

export interface NewPasswordRequest {
  username: string;
  old_password: string;
  new_password: string;
}

export type NewPasswordResponse = Response;

//change password

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}
export type ChangePasswordResponse = Response;

// block admin
export interface BlockAdminRequest {
  username: string;
  is_blocked: boolean;
}

export type BlockAdminResponse = Response;

export interface ForgotPasswordRequest {
  username: string;
}

export interface VerifyOTPRequest {
  otp: string;
  at: string;
}

export type VerifyOTPResponse = Response;
export interface UpdatePasswordRequest {
  new_password: string;
  confirm_password: string;
  at: string;
}

export type UpdatePasswordResponse = Response;

export interface ForgotPasswordResponse {
  message: string;
  status: string;
  data: Token;
}

export interface Token {
  token: string;
}

export const orderedAdminKeys: (keyof AdminEntity)[] = [
  "admin_id",
  "username",
  "email",
  "name",
  "password_changed",
  "phone_number",
  "location",
  "created_by",
  "admin_type",
  "expiration_time",
  "otp_verified",
  "created_at",
  "updated_at",
];


export interface GetSchemeDetailsResponse {
  message: string;
  status:  string;
  data:    SchemeData;
}

export interface SchemeData {
  scheme_detail: SchemeDetail;
}

export interface SchemeDetail {
  map(arg0: (detail: any, index: any) => JSX.Element): import("react").ReactNode;
  client_id:                   string;
  promo_code:                  string;
  account_opening_scheme_code: string;
  account_opening_scheme_name: string;
  brokerage_scheme_code:       string;
  brokerage_scheme_name:       string;
  status:                      number;
  created_at:                  Date;
  updated_at:                  Date;
}

export interface GetSchemeDetailsRequest{
  client_id: string;
}

export interface GetDematAccountDetailsResponse {
  message: string;
  status:  string;
  data:    DematAccountDetailsData;
}

export interface DematAccountDetailsData {
  demat_account_detail: DematAccountDetail;
}

export interface DematAccountDetail {
  client_id:              string;
  demat_account_type:     string;
  is_all_segments_active: boolean;
  cash_mutual_fund:       boolean;
  future_options:         boolean;
  debit:                  boolean;
  commodity_derivatives:  boolean;
  currency:               boolean;
  slbm:                   boolean;
  dpid:any;
  dp_id:any;
  status:                 number;
  created_at:             Date;
  updated_at:             Date;
  s3url?:                  any;
  is_existing_dp_account?: any;
}

export interface GetDematAccountDetailsRequest{
  client_id:              string;
}