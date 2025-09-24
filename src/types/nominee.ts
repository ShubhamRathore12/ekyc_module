export interface GetNomineeDetailsResponse {
  message: string;
  status: string;
  data: NomineeData;
}

export interface NomineeData {
  nominee_detail: NomineeDetail;
}

export interface NomineeDetail {
  client_id: string;
  nominees: Nominees;
  status: number;
  reject_reason: string;
  remarks: string;
  updated_at: Date;
  created_at: Date;
}

export interface Nominees {
  nominees: Nominee[];
}

export interface Nominee {
  nominee_name?: string;
  relation?: string;
  dob?: string;
  is_minor?: boolean;
  mobile?: string;
  id_proof_type?: string;
  id_proof_number?: string;
  is_address_same?: boolean;
  share_percentage?: number;
  is_id_proof_uploaded?: boolean;
  id_proof_document_urls?: string[];
  guardian_name?: string;
  guardian_pan_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  city?: string;
  pin_code?: string;
  state?: string;
  country?: string;
  status?: number;
  reject_reason?: string;
  remarks?: string;
  updated_at?: Date;
  created_at?: Date;
}

export const orderedNomineeDetails: (keyof Nominee)[] = [
  "nominee_name",
  "relation",
  "dob",
  "is_minor",
  "mobile",
  "id_proof_type",
  "id_proof_number",
  "is_address_same",
  "share_percentage",
  "is_id_proof_uploaded",
  "guardian_name",
  "guardian_pan_number",
  "address_line_1",
  "address_line_2",
  "address_line_3",
  "city",
  "pin_code",
  "state",
  "country",
  "status",
];

export interface UpdateNomineeDetailsRequest {
  client_id: string;
  status: number;
  reject_reason: string;
}

export interface UpdateNomineeDetailsResponse {
  message: string;
  status: string;
  error: string;
}
