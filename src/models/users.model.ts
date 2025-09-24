export interface Users {
  id: string;
  show: string;
  device: string;
  verifyStatus: string;
  pan: string;
  aadhaar: string; // Add this field
  verifier: string;
  applicantname: string;
  mobile: string;
  email: string;
  dob: string;
  kraverified: string;
  location: string;
  promocode: string;
  referalcode: string;
}

export interface userFileters {
  show?: string;
  device?: string;
  verifyStatus?: string;
  pan?: string;
  aadhaar?: string; // Add this field
  verifier?: string;
  applicantname?: string;
  mobile?: string;
  email?: string;
  dob?: string;
  kraverified?: string;
  location?: string;
  promocode?: string;
  referalcode?: string;
}
