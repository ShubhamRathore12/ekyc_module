import { Option } from "./app";
import { ApplicationStatus } from "./reports";

//--------common------------
export enum KYCStatus {
  Pending = 0,
  Awaiting = 1,
  Completed = 2,
  Rejected = 3,
  START_OVER = 4,
  NOT_REQUIRED = 5,
  REDO = 6,
}

export enum VerifyStatus {
  Esigndone = 1,
  Rejected = 3,
}

export enum ProductCode {
  GRUJJIVAN = "GRUJJIVAN",
  GRIOP = "GRIOP",
  DEMAT = "DEMAT",
  PNB = "PNB",
  IOB = "IOB",
  NAINITAL = "NAINITAL",
  GRNAINITAL = "GRNAINITAL",
  DEMAT_UPMOVE = "DEMAT_UPMOVE",
  GRPNB = "GRPNB",
  SMCDIY = "SMCDIY",
  FRANCHISE = "FRANCHISE",
  UJJIVAN = "UJJIVAN",
  MFCNK = "MFCNK",
  MFCK = "MFCK",
  SUBNKRA = "SUBNKRA",
  SUBKRA = "SUBKRA",
  STXKRA = "STXKRA",
  STXNKRA = "STXNKRA",
}

interface Response<T = unknown> {
  message: string;
  success: "success" | "failed";
  data?: T;
}
//--------------------------

////////////////////////////////////////
export enum ApplicationType {
  AADHAR_VERIFIED = "Aadhar Verified",
  CAMSKAR = "CAMSKAR",
  CLVKRA = "CLVKRA",
}

export enum PromoCode {
  AOCFREE = "AOCFREE",
}

export enum UploadType {
  bank_statement = "Last 6 months Bank statement",
  salary_slip = "Latest Salary Slip",
  form_16 = "Latest Form16",
  itr_ack = "Latest ITR Acknowledgement",
  latest_holding_statement = "Latest Holding statement with Value",
}

export enum ReferralCode {
  SM09127 = "SM09127",
  "00143" = "00143",
  "0587" = "0587",
}

export enum NomineeUploadStatus {
  N = "No",
  Y = "Yes",
}

export enum Scheme {
  ALL_SEGEMENTS = "All Segments",
  EQUITY_SEGEMENT_ONLY = "Equity Segment only",
  FREE_ACCOUNT_WITH = "Free Account with",
}
export enum AOCPlanType {
  PREMIUM = "Premium",
  STANDARD = "Standard",
}

// export enum HideColumns {
//   CLIENT_ID = "Client Id",
//   STATUS = "Status",
//   PAN_NUMBER = "Pan Number",
//   ADMIN_ID = "Admin Id",
//   ADMIN_USERNAME = "Admin User Name",
//   NAME_PREFIX = "Name Prefix",
//   FULL_NAME = "Full Name",
//   MOBILE_NUMBER = "Mobile Number",
//   EMAIL = "Email",
//   DATE_OF_BIRTH = "Date of Birth",
//   APPLICATION_TYPE = "Application Type",
//   PROMO_CODE = "Promo Code",
//   REFERRAL_CODE = "Referral Code",
//   SCHEME = "Scheme",
//   AOC_PLAN_TYPE = "Aoc Plan Type",
//   LOCKED_BY_ADMIN_ID = "Locked by Admin Id",
//   LOCKED_BY_ADMIN_USERNAME = "Locked by Admin Username",
//   UPDATED_AT = "Updated At",
//   CREATED_AT = "Created At",
// }
////////////////////////////////////////

export const hideColumns = [
  {
    label: "CLIENT_ID",
    value: "client_id",
  },
  {
    label: "STATUS",
    value: "status",
  },

  {
    label: "PAN_NUMBER",
    value: "pan_number",
  },

  {
    label: "ADMIN_ID",
    value: "admin_id",
  },

  {
    label: "ADMIN_USERNAME",
    value: "admin_username",
  },

  {
    label: "NAME_PREFIX",
    value: "name_prefix",
  },

  {
    label: "FULL_NAME",
    value: "full_name",
  },

  {
    label: "MOBILE_NUMBER",
    value: "mobile_number",
  },

  {
    label: "EMAIL",
    value: "email",
  },
  {
    label: "DATE_OF_BIRTH",
    value: "date_of_birth",
  },

  {
    label: "APPLICATION_TYPE",
    value: "application_type",
  },

  {
    label: "PROMO_CODE",
    value: "promo_code",
  },

  {
    label: "REFERRAL_CODE",
    value: "referral_code",
  },

  {
    label: "SCHEME",
    value: "scheme",
  },

  {
    label: "AOC_PLAN_TYPE",
    value: "aoc_plan_type",
  },

  {
    label: "LOCKED_BY_ADMIN_ID",
    value: "locked_by_admin_id",
  },

  {
    label: "LOCKED_BY_ADMIN_USERNAME",
    value: "locked_by_admin_username",
  },

  {
    label: "UPDATED_AT",
    value: "updated_at",
  },

  {
    label: "CREATED_AT",
    value: "created_at",
  },
];

export interface InfoKYC {
  total_applicants: number;
  pending_applicants: number;
  verified_applicants: number;
  rejected_applicants: number;
}

export interface InfoKYCResponse {
  message: string;
  status: string;
  data: InfoKYC;
}

export interface GetEkycRequest {
  page_number: number;
  no_of_records: number;
  email?: string;
  from_date?: string;
  to_date?: string;
  kyc_status?: KYCStatus; // enum
  pan_number?: string;
  verifier?: string;
  applicant_name?: string;
  mobile_number?: string;
  date_of_birth?: string;
}
export interface GetPaymentRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  client_id?: string;
  pan_number?: string;
  mobile_number?: string;
  payment_order_id?: string;
}
export interface GetEkycResponse {
  message: string;
  status: string;
  data: GetEkycData | any;
}

export interface GetEkycData {
  ekycs: Ekyc[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface Ekyc {
  // pan: string;
  // dob: string;
  // verifier: string;
  // applicant_name: string;
  // mobile: string;
  location: string;
  client_id: string;
  kyc_status: KYCStatus; //enum
  pan_number: string;
  admin_id: string;
  admin_username: string;
  name_prefix: string;
  full_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  application_type: string;
  product_code: string;
  referral_code: string;
  scheme: string;
  aoc_plan_type: string;
  locked_by_admin_id: string;
  locked_by_admin_username: string;
  kyc_reject_reason: string;
  updated_at: string;
  created_at: string;
  verify_stage: string;
  verify_status: number;
  app_status: number;
  app_stage: string;
  kra_pdf_url: string;
  media_xml_url: string;
  last_verifier: string;
  credit_category: string;
}
export interface GetPaymnetResponse {
  message: string;
  status: string;
  data: GetPaymentData;
}

export interface GetPaymentData {
  scheme_detail: PaymentResponse[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface PaymentResponse {
  client_id?: string;
  status?: number;
  promo_code?: string;
  account_opening_scheme_code?: string;
  account_opening_scheme_name?: string;
  brokerage_scheme_code?: string;
  brokerage_scheme_name?: string;
  payment_amount?: number;
  payment_status?: string;
  payment_order_id?: string;
  payment_reject_reason?: string;
  bank_account_number?: string;
  ifsc_code?: string;
  created_at?: string;
  updated_at?: string;
  mobile_number?: string;
  pan_number?: string;
}

export interface SegmentDetailsRequest {
  client_id: string;
}
export interface SegmentDetailsData {
  segment_detail: SegmentDetail;
}

export type SegmentDetailsResponse = Response<SegmentDetailsData>;

export interface SegmentDetail {
  client_id: string;
  upload_type: string;
  uploaded_image_urls: string[];
  status: KYCStatus;
  reject_reason: string;
  remarks: string;
  updated_at: Date;
  created_at: Date;
}

// ----------Bank Inerface----------

export interface GetBankDetailsRequest {
  client_id: string;
}
export interface GetBankDetailsResponse {
  message: string;
  status: string;
  data: GetBankDetailsData;
}

export interface GetBankDetailsData {
  dropdown_value: {
    [key in keyof BankDetail]: Option[];
  };
  bank_detail: BankDetail[];
}

export enum BankStatus {
  PENDING = 0,
  WAITING_FOR_APPROVAL = 1,
  COMPLETED = 2,
  REJECTED = 3,
  START_OVER = 4,
}

export enum EKYCStages {
  MobileVerificationStage = "mobile_verification",
  EmailVerificationStage = "email_verification",
  PANUploadStage = "pan_upload",
  PersonalDetailsStage = "personal_details",
  BankVerificationStage = "bank_verification",
  SelfieVerificationStage = "selfie_verification",
  SignatureUploadStage = "signature_upload",
  SegmentUploadStage = "segment_upload",
  DigioStage = "digio",
  EsignStage = "esign",
  AllStageCompleted = "complete",
  DematVerificationStage = "demat_verification"
}

export interface BankDetail {
  name_as_per_bank: string;
  penny_drop_status: string;
  client_id: string;
  mobile_number: string;
  account_id: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  account_holder_name: string;
  bank_name: string;
  branch_name: string;
  status: KYCStatus; //enum
  reject_reason: string;
  verification_type: string;
  uploaded_image_urls: string[];
  created_at: string; //date
  updated_at: string; //date
  micr: string;
  referral_code: string;
}

// ----------Pan Details Interface----------
export interface GetBasicDetailsRequest {
  client_id: string;
}
export interface GetBasicDetailsResponse {
  message: string;
  status: string;
  data: GetBasicDetailsData;
}

export interface GetBasicDetailsData {
  basic_detail: BasicDetail;
  dropdown_value: {
    [key in keyof BasicDetail]: Option[];
  };
}

export interface BasicDetail {
  client_id: string;
  pan_number: string;
  name_prefix: string;
  full_name: string;
  date_of_birth: string;
  father_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  mother_name: string;
  gender: string;
  nationality: string;
  uploaded_image_urls: string[];
  status: number;
  reject_reason: string;
  created_at: string;
  updated_at: string;
  is_kra_verified: boolean;
}

//----------Personal details interface----------

export interface GetPersonalDetailsRequest {
  client_id: string;
}
export interface GetPersonalDetailsResponse {
  message: string;
  status: string;
  data: GetPersonalDetailsData;
}

export interface GetPersonalDetailsData {
  dropdown_value: {
    [key in keyof PersonalDetail]: Option[];
  };
  personal_detail: PersonalDetail;
}

export interface PersonalDetail {
  education: string;
  client_id: string;
  occupation: string;
  trade_experience: string;
  annual_income: string;
  marital_status: string;
  father_name: string;
  mother_name: string;
  is_indian_citizen: boolean;
  is_tax_resident_of_india: boolean;
  is_not_politically_exposed: boolean;
  //
  status: KYCStatus;
  reject_reason: string;
  //
  created_at: string; //date
  updated_at: string; //date
}

//----------Selfie details interface----------
export interface GetSelfieDetailsRequest {
  client_id: string;
}
export interface GetSelfieDetailsResponse {
  message: string;
  status: string;
  data: GetSelfieDetailsData;
}

export interface GetSelfieDetailsData {
  dropdown_value: {
    [key in keyof SelfieDetail]: Option[];
  };
  selfie_detail: SelfieDetail;
}

export interface SelfieDetail {
  client_id: string;
  live: string;
  liveness_score: string;
  to_be_reviewed: string;
  image_url: string;
  video_url: string;
  //
  status: KYCStatus;
  reject_reason: string;
  //
  created_at: string; //date
  updated_at: string; //date
}

//----------Signature details interface----------
export interface GetSignatureDetailsRequest {
  client_id: string;
}
export interface GetSignatureDetailsResponse {
  message: string;
  status: string;
  data: GetSignatureDetailsData;
}

export interface GetSignatureDetailsData {
  dropdown_value: {
    [key in keyof SignatureDetail]: Option[];
  };
  signature_detail: SignatureDetail;
}

export interface SignatureDetail {
  client_id: string;
  uploaded_image_urls: string[];
  //
  status: KYCStatus;
  reject_reason: string;
  //
  created_at: string;
  updated_at: string;

  occupation: string;
  trade_experience: string;
  annual_income: string;
}

//----------User details interface----------
export interface GetUserDetailsRequest {
  client_id: string;
}
export interface GetUserDetailsResponse {
  message: string;
  status: string;
  data: GetUserDetailsData;
}

export interface GetUserDetailsData {
  dropdown_value: {
    [key in keyof UserDetail]: Option[];
  };
  user_detail: UserDetail;
}

export interface UserDetail {
  client_id: string;
  mobile_number: string;
  is_mobile_verified: boolean;
  email: string;
  is_email_verified: boolean;
  sign_url: string;
  settlement_preference: string;
  is_fno_activated: boolean;
  is_equity_activated: boolean;
  is_commodity_activated: boolean;
  ucc_code: string;
  is_pushed_to_bo: boolean;
  bo_pushed_time: string;
  is_pushed_to_ft: string;
  ft_pushed_time: string;
  is_nse_activated: boolean;
  is_bse_activated: boolean;
  is_mcx_activated: boolean;
  mst_pdf_url: string;
  admin_id: string;
  source: string;
  partner_id: string;
  kyc_status: KYCStatus;
  kyc_reject_reason: string;
  created_at: string;
  updated_at: string;
}

export type LockKYCRequest = {
  client_id: string;
};

export type LockKYCResponse = {
  data: { expiration_time: string };
  message: string;
  status: string;
};

export type UnlockKYCRequest = {
  client_id: string;
};

export type UnlockKYCResponse = {
  message: string;
  status: string;
};

export type UpdateImageRequest = {
  client_id: string;
  stage: string;
  image: File | string;
  action: "edit" | "delete";
};

export type UpdateImageResponse = {
  message: string;
  status: string;
};

export type UpdateSegmentImageRequest = {
  client_id: string;
  stage?: string;
  image: File | string;
  action: "edit" | "delete";
  index?: number;
  remarks: string;
};

export type UpdateSegmentImageResponse = {
  message: string;
  status: string;
};

//---------- update interfaces -----------
export interface UpdateUserDetailsRequest {
  client_id: string;
  // mobile_number?: string;
  // email?: string;
  status?: KYCStatus;
  reject_reason?: string;
}
export type UpdateUserDetailsResponse = Response;

export interface UpdatePanDetailsRequest {
  client_id: string;
  // date_of_birth: string;
  father_name?: string;
  // gender?: string;
  status?: KYCStatus;
  reject_reason?: string;
  // occupation?: string;
  // trade_experience?: string;
  // annual_income?: string;
  // marital_status?: string;
  mother_name?: string;
  // is_indian_citizen?: boolean;
  // is_tax_resident_of_india?: boolean;
  // is_not_politically_exposed?: boolean;
}

export type UpdatePanDetailsResponse = Response;

export interface UpdateSelfieDetailsRequest {
  client_id: string;
  status?: KYCStatus;
  reject_reason?: string;
}
export type UpdateSelfieDetailsResponse = Response;

export interface UpdateSignatureDetailsRequest {
  client_id: string;
  status?: KYCStatus;
  reject_reason?: string;
}

export type UpdateSignatureDetailsResponse = Response;

export interface UpdateSegmentDetailsRequest {
  client_id: string;
  status?: KYCStatus;
  reject_reason?: string;
}

export type UpdateSegmentDetailsResponse = Response;

export interface UpdatePersonalDetailsRequest {
  client_id: string;
  status?: KYCStatus;
  reject_reason?: string;
  // occupation?: string;
  // trade_experience?: string;
  // annual_income?: string;
  // marital_status?: string;
  // father_name?: string;
  // mother_name?: string;
  // is_indian_citizen?: boolean;
  // is_tax_resident_of_india?: boolean;
  // is_not_politically_exposed?: boolean;
  // created_at?: string; //date
  // updated_at?: string; //date
}
export type UpdatePersonalDetailsResponse = Response;
export type UpdateESignDetailsResponse = Response;

interface UpdateBankDetailsBody {
  // mobile_number: string;
  // account_id: string;
  // account_number: string;
  // ifsc_code: string;
  // account_holder_name: string;
  // bank_name: string;
  // branch_name: string;
  status?: BankStatus; //enum
  reject_reason?: string;
}

export type UpdateBankDetailsRequest = {
  client_id: string;
} & Partial<UpdateBankDetailsBody>;

export type UpdateBankDetailsResponse = Response;

//---------enums ---------
export interface GetPersonalDetailsEnumsResponse {
  status: string;
  message: string;
  data: GetPersonalDetailsEnumsData;
}

export interface UpdateESignDetailsRequest {
  client_id: string;
  status?: KYCStatus;
  reject_reason?: string;
}

export interface GetPersonalDetailsEnumsData {
  occupations: PersonalDetailsEnums[];
  trade_experience: PersonalDetailsEnums[];
  annual_income: PersonalDetailsEnums[];
  marital_status: PersonalDetailsEnums[];
}
export interface PersonalDetailsEnums {
  type: string;
  title: string;
}

// all enums
export interface GetEnumsData {
  enums: Enums;
}

export type GetEnumsResponse = Response<GetEnumsData>;
export interface Enums {
  annual_income: Options[];
  gender: Options[];
  marital_status: Options[];
  occupation: Options[];
  status: Status[];
  trade_experience: Options[];
}

export interface Options {
  title: string;
  type: string;
}

export interface Status {
  title: string;
  type: number;
}

export interface GetContactDetailsRequest {
  client_id: string;
}
export interface GetContactDetailsResponse {
  message: string;
  status: string;
  data: Contact;
}
export interface Contact {
  contact_detail: ContactDetail;
}

export interface ContactDetail {
  client_id: string;
  mobile_number: string;
  is_mobile_verified: boolean;
  email: string;
  is_email_verified: boolean;
  id_proof_number: string;
  address: string;
  district: string;
  city: string;
  state: string;
  pincode: string;
  promocode: string;
  status: KYCStatus;
  admin_id: string;
  reject_reason: string;
  referred_by: string;
  referral_code: string;
  uploaded_image_urls: string[];
  country: string;
  created_at: Date;
  updated_at: Date;
  address_1: string;
  address_2: string;
  address_3: string;
  is_verified: boolean;
  is_kra_verified: boolean;
}

export interface GetESignDetailsRequest {
  client_id: string;
}
export interface GetESignDetailsResponse {
  message: string;
  status: string;
  data: ESignDetailData;
}

export interface ESignDetailData {
  esign_detail: ESignDetail;
}

export interface ESignDetail {
  client_id: string;
  dp_id: string;
  ucc_code: string;
  status: KYCStatus;
  created_at: Date;
  updated_at: Date;
  esigned_pdf_url: string;
  kra_pdf_url: string;
  ddpi_pdf_url: string;
  ddpi_pdf_url_download: string;
  esigned_pdf_url_download: string;
  kra_pdf_url_download: string;
  reject_reason: string;
}

export interface GetAllEkycStatusRequest {
  client_id: string;
}

export interface GetAllEkycStatusResponse {
  message: string;
  status: string;
  data: Statues;
}

export interface Statues {
  status: Status;
}

export interface Status {
  basic_detail_status: number;
  contact_detail_status: number;
  bank_detail_status: number;
  signature_detail_status: number;
  selfie_detail_status: number;
  esign_detail_status: number;
}

export const adminKeys: (keyof Ekyc)[] = [
  "verify_status",
  "last_verifier",
  "pan_number",
  "locked_by_admin_username",
  "full_name",
  "mobile_number",
  "email",
  "date_of_birth",
  // "application",
  "product_code",
  "referral_code",
  "location",
  "credit_category",
  "created_at",
  "updated_at",
];

export const telecallerKeys: (keyof Ekyc)[] = [
  "pan_number",
  "app_status",
  "full_name",
  "mobile_number",
  "email",
  // "application",
  "referral_code",
  "product_code",
  "created_at",
  "updated_at",
];

export const orderedBasicDetails: (keyof BasicDetail)[] = [
  "pan_number",
  "date_of_birth",
  "full_name",
  "father_name",
  "mother_name",
  "gender",
  "nationality",
  "status",
];

export const orderedContactDetails: (keyof ContactDetail)[] = [
  "email",
  "mobile_number",
  "id_proof_number",
  // "address",
  // "address_1",
  // "address_2",
  // "address_3",
  "country",
  "state",
  "city",
  "pincode",
  "referral_code",
  "promocode",
  "status",
];

export const orderedBankDetails: (keyof BankDetail)[] = [
  "account_number",
  "ifsc_code",
  "micr",
  "branch_name",
  "bank_name",
  "name_as_per_bank",
  "referral_code",
  "penny_drop_status",
  "status",
];

export const orderedOtherDetails: (keyof PersonalDetail)[] = [
  "education",
  "occupation",
  "annual_income",
  // "status",
];
export const orderedSegmentDetails: (keyof SegmentDetail)[] = ["upload_type", "remarks"];

export const orderedPhotoDetails: (keyof SelfieDetail)[] = [
  "live",
  "liveness_score",
  "to_be_reviewed",
  "image_url",
  "status",
];

export const orderedESignDetails: (keyof ESignDetail)[] = ["ucc_code", "dp_id", "status"];

export interface GetEKycCountRequest {
  time: string;
  referral_code?: string;
}

export interface GetEKycCountResponse {
  message: string;
  status: string;
  data: EKycCount;
}

export interface EKycCount {
  total_count: number;
  total_pending_count: number;
  total_verified_count: number;
  total_rejected_count: number;
}

export interface GetMasterReportsRequest {
  page_number: number;
  no_of_records: number;
  email?: string;
  from_date?: string;
  to_date?: string;
  kyc_status?: KYCStatus; // enum
  pan_number?: string;
  verifier?: string;
  applicant_name?: string;
  mobile_number?: string;
  date_of_birth?: string;
  created_at?: string;
}
export interface GetMasterReportsResponse {
  message: string;
  status: string;
  data: MasterResportsData;
}

export interface MasterResportsData {
  ekycs: MasterReports[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface MasterReports {
  app_stage: string;
  app_status: ApplicationStatus;
  client_id: string;
  pan_number: string;
  name_prefix: string;
  full_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  referral_code: string;
  city: string;
  state: string;
  updated_at: string;
  created_at: string;
  nominee_upload: NomineeUploadStatus;
  bank_referral_code: string;
  workplace_email: string;
  product_code: string;
  credit_category: string;
}

export interface GetAgentEkycRequest {
  page_number: number;
  no_of_records: number;
  email?: string;
  from_date?: string;
  to_date?: string;
  kyc_status?: KYCStatus; // enum
  pan_number?: string;
  verifier?: string;
  applicant_name?: string;
  mobile_number?: string;
  date_of_birth?: string;
}

export interface GetAgentEkycResponse {
  message: string;
  status: string;
  data: AgentEkycData;
}

export interface AgentEkycData {
  ekycs: Ekyc[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface AgentEkyc {
  client_id: string;
  app_stage: string;
  app_status: string;
  pan_number: string;
  name_prefix: string;
  full_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  application_type: string;
  referral_code: string;
  product_code: string;
  promo_code: string;
  group3: string;
  ucc_code: string;
  talisma_id: string;
  updated_at: string;
  created_at: string;
  credit_category: string;
  user_type: string;
}

export interface GetTalismaEkycRequest {
  mobile_number?: string;
  lead_id?: string;
  user_type?: string;
  pan_number?: string;
}
export interface GetTalismaEkycResponse {
  message: string;
  status: string;
  data: { data: AgentEkyc };
}

export interface GetTalismaAccessTokenResponse {
  message: string;
  status: string;
  data: AccessToken;
}

export interface AccessToken {
  redirect: string;
}

export interface GetUCCReportsRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  pan_number?: string;
  verifier?: string;
  applicant_name?: string;
  ucc_code?: string;
  dp_id?: string;
  referral_code?: string;
}

export interface GetUCCReportsResponse {
  message: string;
  status: string;
  data: UCCReportsData;
}

export interface UCCReportsData {
  ekycs: UCCReports[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface UCCReports {
  client_id: string;
  pan_number: string;
  admin_id: string;
  admin_username: string;
  name_prefix: string;
  full_name: string;
  dp_id: string;
  ucc_code: number;
  referral_code: string;
  esign_date: string;
  updated_at: Date;
  created_at: Date;
  verified_by: string;
  kyc_status: number;
  name_as_per_bank: string;
  group_3: string;
  derivative_proof: string;
  scheme: string;
  upload_date: string;
  esigned_pdf_url: string;
  kra_pdf_url: string;
  is_kra_verified: boolean;
  media_xml_url: string;
  ddpi_pdf_url: string;
  esigned_at: Date;
  is_sent_to_backoffice: boolean;
  sent_to_backoffice_at: Date;
  nominee_upload: NomineeUploadStatus;
  bank_referral_code: string;
  workplace_email: string;
  product_code: string;
  verifier: string;
  send_to_easy_invest_at: string;
}

export interface GetVideoReportsResponse {
  message: string;
  status: string;
  data: VideoReportsData;
}

export interface VideoReportsData {
  demo_video_info: VideoReports[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface VideoReports {
  product_code: string;
  demo_video_s3_url: string;
  demo_video_enabled_to_display: boolean;
}

export interface GETVIDEOREPORTREQUEST {
  page_number: number;
  no_of_records: number;
  product_code?: string;
  demo_video_s3_url?: string;
  demo_video_enabled_to_display?: string;
}

export interface UpdateIDProofRequest {
  client_id: string;
  id_proof_number: string;
}

export interface UpdateIDProofResponse {
  message: string;
  status: string;
}

export interface UpdateMicrRequest {
  client_id: string;
  micr: string;
}
export interface UpdateMicrResponse {
  message: string;
  status: string;
}

export interface GetFTMappingReportsRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  pan_number?: string;
  nse_status?: string;
  client_id?: string;
  rupeeseed_status?: string;
}

export interface GetFTMappingReportsResponse {
  message: string;
  status: string;
  data: MappingReportData;
}

export interface MappingReportData {
  mapping_report: MappingReport[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface MappingReport {
  client_id: string;
  pan_number: string;
  nse_response: string;
  nse_status: number;
  segment_cash: string;
  segment_future_and_option: string;
  segment_currency_derivatives: string;
  segment_commodity: string;
  rupeeseed_request: string;
  rupeeseed_response: string;
  rupeeseed_bank_request: string;
  rupeeseed_bank_response: string;
  created_at: string;
  updated_at: string;
}

export interface GetDPIdDetailsRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  pan_number?: string;
  ucc_code?: string;
  from_created_date?: string;
  to_created_date?: string;
}

export interface GetDPIdDetailsResponse {
  message: string;
  status: string;
  data: DPIDDetailData;
}

export interface DPIDDetailData {
  dp_id_detail: DPIDDetail[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface DPIDDetail {
  dp_id: string;
  client_id: string;
  date: string;
  ucc_code: string;
  pan_number: string;
  status: ApplicationStatus;
  form_number: number;
  created_at: Date;
  updated_at: Date;
}

export interface SendToBankOfficeResponse {
  message: string;
  status: string;
  data: Result;
}

export interface UploadVideoResponse {
  message: string;
  status: string;
  data: Result;
}

export interface UploadVideoRequest {
  product_code: string;
  demo_video_enabled_to_display: boolean;
  video?: any;
}

export interface SendToNSDLRequest {
  client_id: string;
  nsdl_request: string;
}

export interface Result {
  flag: string;
  flag_message: string;
}

export const orderedDPIdDetails: (keyof DPIDDetail)[] = [
  "client_id",
  "dp_id",
  "form_number",
  "pan_number",
  "ucc_code",
  "created_at",
  "updated_at",
  "status",
  "updated_at",
];

export const orderedFTMapping: (keyof MappingReport)[] = [
  "client_id",
  "nse_response",
  "nse_status",
  "rupeeseed_bank_request",
  "rupeeseed_bank_response",
  "rupeeseed_request",
  "rupeeseed_response",
  "segment_cash",
  "segment_commodity",
  "segment_currency_derivatives",
  "segment_future_and_option",
  "created_at",
  "updated_at",
];
export const orderedMasterKeys: (keyof MasterReports)[] = [
  "app_stage",
  "app_status",
  "client_id",
  "full_name",
  "pan_number",
  "mobile_number",
  "email",
  "product_code",
  "workplace_email",
  "bank_referral_code",
  "city",
  "state",
  "nominee_upload",
  "created_at",
  "referral_code",
  "credit_category",
  // "scheme",
];

export const orderedUCCKeys: (keyof UCCReports)[] = [
  "esigned_pdf_url",
  "full_name",
  "pan_number",
  "verified_by",
  "ucc_code",
  "kyc_status",
  "nominee_upload",
  "scheme",
  "group_3",
  "product_code",
  "workplace_email",
  "bank_referral_code",
  "name_as_per_bank",
  "derivative_proof",
  "verifier",
  "created_at",
  "esigned_at",
  "sent_to_backoffice_at",
  "send_to_easy_invest_at",
];

export const videoKeys: (keyof VideoReports)[] = [
  "product_code",
  "demo_video_s3_url",
  "demo_video_enabled_to_display",
];

export interface GetAgentAccessTokenRequest {
  client_id: string;
}
export interface GetAgentAccessTokenResponse {
  message: string;
  status: string;
  data: AgentAccessToken;
}

export interface AgentAccessToken {
  access_token: string;
}

export interface APIError {
  status: number;
  data: Error;
}

export interface Error {
  status: string;
  error: string;
}

export interface GetCvlkraRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  pan_number?: string;
  is_record_send_to_kra?: boolean;
}

export interface GetDematRequest {
  page_number: number;
  no_of_records: number;
  from_date?: string;
  to_date?: string;
  pan_number?: string;
  is_record_send_to_nsdl?: boolean;
}

export interface GetCvlkraResponse {
  message: string;
  status: string;
  data: CvlkraDetails;
}

export interface CvlkraDetails {
  cvlkra_details: CvlkraDetail[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface CvlkraDetail {
  client_id: string;
  pan_number: string;
  response: string;
  status: string;
  error_message: string;
  is_record_sent_to_kra: boolean;
  
  created_at: Date;
  updated_at: Date;
  request: string;
}

export interface PaymentDetail {
  client_id: string;
  pan_number: string;
  mobile_number: string;
  promo_code: string;
  account_opening_scheme_code: string;
  account_opening_scheme_name: string;
  brokerage_scheme_code: string;
  brokerage_scheme_name: string;
  payment_amount: string;
  payment_status: string;
  payment_order_id: string;
  payment_reject_reason: string;
  bank_account_number: string;
  ifsc_code: string;
  created_at: Date;
  updated_at: Date;
  status: string;
}

// export interface PaymentDetail {
//   ID: number;
//   ClientID: string;
//   Status: number;
//   PromoCode: string;
//   AccountOpeningSchemeCode: string;
//   AccountOpeningSchemeName: string;
//   BrokerageSchemeCode: string;
//   BrokerageSchemeName: string;
//   PaymentAmount: number;
//   PaymentStatus: string;
//   PaymentOrderId: string;
//   PaymentRejectReason: string;
//   BankAccountNumber: string;
//   IfscCode: string;
//   CreatedAt: Date;
//   UpdatedAt: Date;
// }

export interface GetDematResponse {
  message: string;
  status: string;
  data: DematDetails;
}

export interface DematDetails {
  nsdl_details: NsdlDetail[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface NsdlDetail {
  client_id: string;
  pan_number: string;
  request: string;
  response: string;
  send_to_nsdl: boolean;
  error_message: string;
  created_at: Date;
  updated_at: Date;
}

export const orderCvlkraKeys: (keyof CvlkraDetail)[] = [
  "client_id",
  "pan_number",
  "is_record_sent_to_kra",
  "status",
  "request",
  "response",
  "error_message",
  "updated_at",
  "created_at",
];

export const orderPaymentKeys: (keyof PaymentDetail)[] = [
  "client_id",
  "pan_number",
  "mobile_number",
  "status",
  "promo_code",
  "account_opening_scheme_code",
  "account_opening_scheme_name",
  "brokerage_scheme_code",
  "brokerage_scheme_name",
  "payment_amount",
  "payment_status",
  "payment_order_id",
  "payment_reject_reason",
  "bank_account_number",
  "ifsc_code",
  "created_at",
  "updated_at",
];

// export const orderPaymnetKeys: (keyof PaymentDetail)[] = [
//   "ID",
//   "ClientID",
//   "Status",
//   "PromoCode",
//   "AccountOpeningSchemeCode",
//   "AccountOpeningSchemeName",
//   "BrokerageSchemeCode",
//   "BrokerageSchemeName",
//   "PaymentAmount",
//   "PaymentStatus",
//   "PaymentOrderId",
//   "PaymentRejectReason",
//   "BankAccountNumber",
//   "IfscCode",
//   "CreatedAt",
//   "UpdatedAt",
// ];
export interface GetWhatsappConfigResponse {
  message: string;
  status: string;
  data: WhatsappConfig;
}

export interface WhatsappConfig {
  feature_configuration: FeatureConfiguration;
}

export interface FeatureConfiguration {
  feature: string;
  status: boolean;
}

export interface updateWhatsappConfigRequest {
  feature: string;
  status: boolean;
}

export interface updateWhatsappConfigResponse {
  message: string;
  status: string;
}

export interface updateCVLKRAConfigRequest {
  feature: string;
  password: string;
}

export interface updateCVLKRAConfigResponse {
  message: string;
  status: string;
}

export interface GetCVLKRAPasswordResponse {
  message: string;
  status: string;
  data: Config;
}

export interface Config {
  feature_configuration: CVLKRAConfig;
}

export interface CVLKRAConfig {
  feature: string;
  password: string;
}

export interface GetRejectionTemplateResponse {
  message: string;
  status: string;
  data: Template;
}

export interface Template {
  rejection_templates: RejectionTemplate[];
}

export interface RejectionTemplate {
  rejection_template_id: string;
  rejection_reason: string;
  created_at: Date;
}

export interface AddRejectionTemplateRejectionRequest {
  rejection_reason: string;
}

export interface AddRejectionTemplateRejectionResponse {
  message: string;
  status: string;
}

export interface DeleteRejectionTemplateRejectionResponse {
  message: string;
  status: string;
}

export interface DeleteUserRequest {
  mobile_number: string;
  user_type: string;
  pan_number?: string;
}

export interface DeleteUserResponse {
  message: string;
  status: string;
}

export interface GetSTXProductResponse {
  message: string;
  status: string;
  data: {
    product_details: STXProductDetail[];
  };
}

export interface STXProductDetail {
  product_code: string;
  product: string;
  bank: string;
  bank_name: string;
  ifsc_prefix: string;
  check_bank_employee: boolean;
  bank_email_domains: string[];
  logo: string;
  preallocated_dp_id: boolean;
  dp_of: string;
  esign_pdf_template: string;
  is_active: boolean;
  group3: string;
  default_brokerage: string;
  default_aoc: string;
  is_discount_brokerage: boolean;
  can_ask_demat_account_creation: boolean;
  new_demat_depository_options: string[];
  old_demat_depository_options: string[];
  nsdl_demat_prefix: string[];
  cdsl_demat_prefix: string[];
  is_kra_enabled: boolean;
  is_single_journey_enabled: boolean;
  product_url: string;
  stages: {
    stages: STXProductStage[];
  };
  user_type: string;
  demo_video_s3_url: string;
  demo_video_enabled_to_display: boolean;
  client_redirect_after_esign: string;
  created_at: string;
  updated_at: string;
}

export interface STXProductStage {
  stage: string;
  navigate_back: boolean;
  can_user_edit: boolean;
}
