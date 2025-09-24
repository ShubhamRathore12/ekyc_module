export enum KYCStatus {
  Pending = 0,
  Awaiting = 1,
  Completed = 2,
  Rejected = 3,
}

export interface GetCDURequests {
  page_no: number;
  no_of_records: number;
  email?: string;
  user_code?: string;
  status?: KYCStatus; // enum
  mobile_number?: string;
}

export interface GetCDUResponse {
  message: string;
  status: string;
  data: GetCDURequestsData;
}
export interface GetCDURequestsData {
  cdu_requests: CDURequests[];
  no_of_pages: number;
  total_no_of_records: number;
}
export interface CDURequests {
  email: string;
  user_code: string;
  old_mobile_number: string;
  new_mobile_number: string;
  status: KYCStatus; // enum
  requested_on: string;
  verified_on: string;
  rejected_on: string;
  rejected_remarks: string;
}

// email - log
export interface GetEmailLogRequest {
  page_no: number;
  no_of_records: number;
  email?: string;
  user_code?: string;
  status?: KYCStatus; // enum
  mobile_number?: string;
}

export interface GetEmailLogResponse {
  message: string;
  status: string;
  data: GetEmailLogsData;
}
export interface GetEmailLogsData {
  cdu_requests: EmailLogs[];
  no_of_pages: number;
  total_no_of_records: number;
}
export interface EmailLogs {
  email: string;
  user_code: string;
  old_mobile_number: string;
  new_mobile_number: string;
  status: KYCStatus; // enum
  requested_on: string;
  verified_on: string;
  rejected_on: string;
  rejected_remarks: string;
}

// mobile log
export interface GetMobileLogRequest {
  page_no: number;
  no_of_records: number;
  email?: string;
  user_code?: string;
  status?: KYCStatus; // enum
  mobile_number?: string;
}

export interface GetMobileLogResponse {
  message: string;
  status: string;
  data: GetMobileLogsData;
}
export interface GetMobileLogsData {
  cdu_requests: MobileLogs[];
  no_of_pages: number;
  total_no_of_records: number;
}
export interface MobileLogs {
  email: string;
  user_code: string;
  old_mobile_number: string;
  new_mobile_number: string;
  status: KYCStatus; // enum
  requested_on: string;
  verified_on: string;
  rejected_on: string;
  rejected_remarks: string;
}
