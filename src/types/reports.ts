export enum ReportsTab {
  MASTER_REPORT = "master_report",
  UCC_REPORT = "ucc_report",
  CVLKRA_REPORT = "cvlkra_report",
  FT_MAPPING_REPORT = "ft_mapping_report",
  DP_ID_DETAILS = "dpid_details_report",
  DEMAT_REPORT = "demat_report",
  PAYMENT_REPORT = "payment_report",
}

export type ReportRequest = {
  reportName: ReportsTab;
  fromDate: string;
  toDate: string;
};

export type ReportResponse = {
  message: string;
  status: string;
};

export enum ApplicationStatus {
  PENDING,
  WAITING_FOR_APPROVAL,
  COMPLETED,
  REJECTED,
  START_OVER,
  NOT_REQUIRED,
  REDO,
}
