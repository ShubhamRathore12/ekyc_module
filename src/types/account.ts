interface Response {
  message: string;
  success: "success" | "failed";
}

export type AccountOpeningResponse = Response;

export interface AccountOpeningRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  charges: number;
  active: boolean;
  group_code: string;
  bo_scheme_code: string;
  // is_for_promo_code_only:boolean,
  // product_code:string,
  created_at?: string;
  updated_at?: string;
}

export type SchemeListResponse = {
  message: string;
  success: "success" | "failed";
  data: SchemeListData;
};
export interface SchemeListData {
  schemes: Scheme[];
}

export interface Scheme {
  id?: string;
  scheme_code: string;
  scheme_name: string;
}

export interface SchemeListRequest {
  scheme_code?: string;
  scheme_name?: string;
}

export type SchemeDetailsResponse = {
  scheme_code: "";
  scheme_name: "";
  scheme_desc: "";
  charges: "";
  active: any;
  group_code: "";
  bo_scheme_code: "";
  created_at: "";
  updated_at: "";
  is_for_promo_code_only: any;
  message: string;
  status: string;
  data: SScheme;
};

export interface SScheme {
  charges: string;
  bo_scheme_code: string;
  group_code: string;
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  active: boolean;
  // charges:                        number;
  chargeable_for_account_opening: number;
  margin_amount: number;
  discount: number;
  jobbing_perc: number;
  jobbing_max: number;
  delivery_min: number;
  delivery_max: number;
  derivative_perc: number;
  derivative_max: number;
  derivative_opt_perc: number;
  derivative_opt_min: number;
  derivative_opt_max: number;
  curr_perc: number;
  curr_min: number;
  curr_opt_perc: number;
  curr_opt_min: number;
  curr_opt_max: number;
  commodity_perc: number;
  commodity_min: number;
  commodity_opt_perc: number;
  commodity_opt_min: number;
  commodity_opt_max: number;
  product_code: string;
  is_for_promo_code_only: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SchemeDetailsRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  charges: number;
  active: boolean;
  group_code: string;
  bo_scheme_code: string;
  is_for_promo_code_only: boolean;
  product_code: string;
  created_at?: string;
  updated_at?: string;
}

export type UpdateSchemeResponse = Response;

export interface UpdateSchemeRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  charges: number;
  active: boolean;
  group_code: string;
  bo_scheme_code: string;
  is_for_promo_code_only: boolean;
  product_code: string;
}

export type AccountBrokerageResponse = Response;

export interface AccountBrokerageRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  active: boolean;
  // charges: number,
  //   chargeable_for_account_opening:number,
  margin_amount: number;
  //   discount: number,
  jobbing_perc: number;
  jobbing_max: number;
  delivery_min: number;
  delivery_max: number;
  derivative_perc: number;
  derivative_max: number;
  derivative_opt_perc: number;
  derivative_opt_min: number;
  derivative_opt_max: number;
  curr_perc: number;
  curr_min: number;
  curr_opt_perc: number;
  curr_opt_min: number;
  curr_opt_max: number;
  commodity_perc: number;
  commodity_min: number;
  commodity_opt_perc: number;
  commodity_opt_min: number;
  commodity_opt_max: number;
  //   product_code: string,
  //   is_for_promo_code_only: boolean
}

export type BrokerageSchemeListResponse = {
  message: string;
  success: "success" | "failed";
  data: SchemeListData;
};

export interface BrokerageSchemeListRequest {
  scheme_code?: string;
  scheme_name?: string;
}

export type BrokSchemeDetailsResponse = {
  message: string;
  status: string;
  data: { schemes: BScheme[] };
};

export interface BScheme {
  charges: string;
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  active: boolean;
  // charges:                        number;
  chargeable_for_account_opening: number;
  margin_amount: number;
  discount: number;
  jobbing_perc: number;
  jobbing_max: number;
  delivery_min: number;
  delivery_max: number;
  derivative_perc: number;
  derivative_max: number;
  derivative_opt_perc: number;
  derivative_opt_min: number;
  derivative_opt_max: number;
  curr_perc: number;
  curr_min: number;
  curr_opt_perc: number;
  curr_opt_min: number;
  curr_opt_max: number;
  commodity_perc: number;
  commodity_min: number;
  commodity_opt_perc: number;
  commodity_opt_min: number;
  commodity_opt_max: number;
  product_code: string;
  is_for_promo_code_only: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BrokSchemeDetailsRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  active: boolean;
  charges: number;
  chargeable_for_account_opening: number;
  margin_amount: number;
  discount: number;
  jobbing_perc: number;
  jobbing_max: number;
  delivery_min: number;
  delivery_max: number;
  derivative_perc: number;
  derivative_max: number;
  derivative_opt_perc: number;
  derivative_opt_min: number;
  derivative_opt_max: number;
  curr_perc: number;
  curr_min: number;
  curr_opt_perc: number;
  curr_opt_min: number;
  curr_opt_max: number;
  commodity_perc: number;
  commodity_min: number;
  commodity_opt_perc: number;
  commodity_opt_min: number;
  commodity_opt_max: number;
  product_code: number;
  is_for_promo_code_only: number;
}

export type UpdateBrokSchemeResponse = Response;

export interface UpdateBrokSchemeRequest {
  scheme_code: string;
  scheme_name: string;
  scheme_desc: string;
  active: boolean;
  // charges: number,
  // chargeable_for_account_opening:number,
  margin_amount: number;
  // discount: number,
  jobbing_perc: number;
  jobbing_max: number;
  delivery_min: number;
  delivery_max: number;
  derivative_perc: number;
  derivative_max: number;
  derivative_opt_perc: number;
  derivative_opt_min: number;
  derivative_opt_max: number;
  derivative_opt_stx_perc: number;
  derivative_opt_stx_min: number;
  derivative_opt_stx_max: number;
  curr_perc: number;
  curr_min: number;
  curr_opt_perc: number;
  curr_opt_min: number;
  curr_opt_max: number;
  commodity_perc: number;
  commodity_min: number;
  commodity_opt_perc: number;
  commodity_opt_min: number;
  commodity_opt_max: number;
  // product_code: string,
  // is_for_promo_code_only: boolean
}

export type GroupListResponse = {
  message: string;
  status: string;
  data: GList[];
};

export interface GList {
  group: string;
  groupType: string;
  location: string;
}

export interface GroupListRequest {
  groupCode: string;
  groupType: string;
  location: string;
}

export type ProductCodeResponse = {
  message: string;
  status: string;
  data: ProductCode[];
};

export type ProductCode = {
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
  is_single_journey_enabled: boolean;
  product_url: string;
  created_at: string;
  updated_at: string;
};

export type PromoCodeLinkResponse = {
  message: string;
  status: "success" | "failed";
  data: {
    link: string;
  };
};

export interface PromoCodeLinkRequest {
  name?: string;
  mobile_number?: string;
  email?: string;
  group?: {
    group?: string;
    branch?: string;
    location?: string;
  };
  promo_code?: string;
  product_code?: string;
}

export type PromoCodeListResponse = {
  message: string;
  status: string;
  data: string[];
};

export interface PromoCodeListRequest {
  promo_code: string;
  group: string;
  branch: string;
  location: string;
  product_code: string;
}

export type GeneratePromoCodeResponse = Response;

export interface GeneratePromoCodeRequest {
  promo_code: string;
  desc: string;
  from_date: string;
  to_date: string;
  active: boolean;
  promo_code_limit: number;
  promo_code_remaining: number;
  remarks: string;
  scheme_mapping: GenerateSchemeMapping[];
  group3_mapping: string;
  type_mapping: string[];
}

export interface GenerateSchemeMapping {
  account_opening_scheme_code: string;
  account_opening_scheme_name?: string;
  brokerage_scheme_codes: BrokerageSchemeCode[];
}

export interface BrokerageSchemeCode {
  scheme_code: string;
  scheme_name: string;
}

export interface AvailablePromoCodesResponse {
  message: string;
  status: string;
  data: AvailablePromoCodesRequest;
}
export interface AvailablePromoCodesRequest {
  promo_codes?: AvailablePromoCode[];
  active?: boolean;
}

export interface AvailablePromoCode {
  promo_code: string;
  desc: string;
}

export interface PromoCodeDetailResponse {
  message: string;
  status: string;
  data: PromoCode;
}

export interface PromoCode {
  promo_codes: PromoCodeDetail[];
}

export interface PromoCodeDetail {
  promo_code: string;
  desc: string;
  from_date: string;
  to_date: string;
  active: boolean;
  promo_code_limit: number;
  promo_code_remaining: number;
  remarks: string;
  scheme_mapping: SchemeMapping[];
  group3_mapping: string;
  type_mapping: string[];
  created_at: Date;
  updated_at: Date;
  product_code: string;
}

export interface SchemeMapping {
  id: string;
  account_opening_scheme_code: string;
  account_opening_scheme_name: string;
  brokerage_scheme_codes: PromoSchemeCode[];
}

export interface PromoSchemeCode {
  id?: string;
  scheme_code: string;
  scheme_name: string;
}

// ````````````````````````ASSIST USER DATA````````````

export interface AssistUserDataAPIRequest {
  page_number: number;
  no_of_records: number;
  referral_code?: string;
}

export interface AssistUserDataResponse {
  message: string;
  status: string;
  data: AssistUserData;
}

export interface AssistUserData {
  data: AssistUserDatum[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface AssistUserDatum {
  id: string;
  client_id: string;
  pan_number: string;
  app_stage: string;
  app_status: number;
  name_prefix: string;
  full_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  referral_code: string;
  product_code: string;
  nominee_upload: string;
  scheme: string;
  workplace_email: string;
  bank_referral_code: string;
  city: string;
  state: string;
  group_code: string;
  updated_at: Date;
  created_at: Date;
  credit_category: string;
}

export interface AssistUserDataRequest {
  page_number: number;
  no_of_records: number;
  id?: string;
  client_id?: string;
  pan_number?: string;
  app_stage?: string;
  app_status?: number;
  name_prefix?: string;
  full_name?: string;
  mobile_number?: string;
  email?: string;
  date_of_birth?: string;
  referral_code?: string;
  product_code?: string;
  nominee_upload?: string;
  scheme?: string;
  workplace_email?: string;
  bank_referral_code?: string;
  city?: string;
  state?: string;
  group_code?: string;
  updated_at?: Date;
  created_at?: Date;
}

export const orderedAssistKeys: (keyof AssistEntity)[] = [
  // "id",
  // "client_id",
  "app_stage",
  "app_status",
  "full_name",
  "mobile_number",
  "email",
  "date_of_birth",
  "city",
  "state",
  "pan_number",
  // "name_prefix",
  "referral_code",
  "group_code",
  "product_code",
  "nominee_upload",
  "credit_category",
  // "scheme",
  // "workplace_email",
  // "bank_referral_code",
  "updated_at",
  "created_at",
];

export interface AssistEntity {
  id: string;
  client_id: string;
  pan_number: string;
  app_stage: string;
  app_status: number;
  name_prefix: string;
  full_name: string;
  mobile_number: string;
  email: string;
  date_of_birth: string;
  referral_code: string;
  product_code: string;
  nominee_upload: string;
  scheme: string;
  workplace_email: string;
  bank_referral_code: string;
  city: string;
  state: string;
  group_code: string;
  updated_at: Date;
  created_at: Date;
  credit_category: string;
}

// ````````````````````````BACKOFFICE UCC REPORT ```````````````

export interface GetBackOfficeUccReportRequest {
  page_number: number;
  no_of_records: number;
  from_date?: Date | null | string; 
  to_date?: Date | null | string;
  referral_code?: string;
}

export interface GetBackOfficeUccReportResponse {
  message: string;
  status: string;
  data: UccReportData;
}

export interface UccReportData {
  ekycs: UccReport[];
  no_of_pages: number;
  total_no_of_records: number;
}

export interface UccReport {
  client_id: string;
  pan_number: string;
  verified_by: string;
  kyc_status: number;
  name_prefix: string;
  full_name: string;
  name_as_per_bank: string;
  group_3: string;
  derivative_proof: string;
  nominee_upload: string;
  product_code: string;
  scheme: string;
  dp_id: string;
  ucc_code: string;
  referral_code: string;
  upload_date: Date;
  esigned_pdf_url: string;
  kra_pdf_url: string;
  ddpi_pdf_url: string;
  is_kra_verified: boolean;
  is_sent_to_backoffice: boolean;
  sent_to_backoffice_at: Date;
  media_xml_url: string;
  workplace_email: string;
  bank_referral_code: string;
  updated_at: Date;
  created_at: Date;
  esigned_at: Date;
}

export const orderedUccKeys: (keyof UccEntity)[] = [
  "full_name",
  "pan_number",
  "verified_by",
  "ucc_code",
  "kyc_status",
  "nominee_upload",
  //   "scheme",
  "group_3",
  "product_code",
  "workplace_email",
  //   "bank_referral_code",
  "name_as_per_bank",
  "derivative_proof",
  "esigned_at",
  "sent_to_backoffice_at",
  "send_to_easy_invest_at",
];

export interface UccEntity {
  client_id: string;
  pan_number: string;
  verified_by: string;
  kyc_status: number;
  name_prefix: string;
  full_name: string;
  name_as_per_bank: string;
  group_3: string;
  derivative_proof: string;
  nominee_upload: string;
  product_code: string;
  scheme: string;
  dp_id: string;
  ucc_code: string;
  referral_code: string;
  upload_date: Date;
  esigned_pdf_url: string;
  kra_pdf_url: string;
  ddpi_pdf_url: string;
  is_kra_verified: boolean;
  is_sent_to_backoffice: boolean;
  sent_to_backoffice_at: Date;
  media_xml_url: string;
  workplace_email: string;
  bank_referral_code: string;
  updated_at: Date;
  created_at: Date;
  esigned_at: Date;
  send_to_easy_invest_at: Date;
}
