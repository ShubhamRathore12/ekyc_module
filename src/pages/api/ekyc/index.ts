import { NextApiRequest, NextApiResponse } from "next";
import { Ekyc, GetEkycRequest, GetEkycResponse } from "types/ekyc";
import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse<GetEkycResponse>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed", status: "failed", data: null });
  }

  const { no_of_records, page_number, email } = req.query as unknown as GetEkycRequest;

  // Validate page_number and no_of_records are numeric
  const page = isNaN(+page_number) ? 0 : +page_number;
  const recordsPerPage = isNaN(+no_of_records) ? 10 : +no_of_records;

  const totalRecords = 65;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // If email is provided, simulate the response
  if (email) {
    setTimeout(() => {
      return res.status(200).json({
        message: "Fetched successfully",
        status: "success",
        data: {
          total_no_of_records: 1,
          no_of_pages: 1,
          ekycs: page === 0 ? getDummyData(1, 0, email) : [],
        },
      });
    }, 5000);
  } else {
    setTimeout(() => {
      res.status(200).json({
        message: "Fetched successfully",
        status: "success",
        data: {
          total_no_of_records: totalRecords,
          no_of_pages: totalPages,
          ekycs: page >= totalPages ? [] : getDummyData(recordsPerPage, page * recordsPerPage),
        },
      });
    }, 5000);
  }
}

const getDummyData = (num: number, offset: any = 0, email?: string) => {
  const baseRecord: Ekyc = {
    location: "",
    client_id: "ed2a012d-327d-4570-921d-4fe995c95022",
    kyc_status: 0,
    pan_number: "ABCDE0000E",
    admin_id: "",
    admin_username: "",
    name_prefix: "mr",
    full_name: "name5",
    mobile_number: "1234567894",
    email: email || "testuser5@yopmail.com",
    date_of_birth: "11-01-2001",
    last_verifier: "",
    application_type: "",
    product_code: "",
    referral_code: "",
    scheme: "",
    aoc_plan_type: "",
    locked_by_admin_id: "",
    locked_by_admin_username: "",
    updated_at: "2022-10-27T14:12:56.523078Z",
    created_at: "2022-10-27T14:03:21.862887Z",
    kyc_reject_reason: "",
    verify_stage: "",
    verify_status: 0,
    app_status: 0,
    app_stage: "pan_verification",
    kra_pdf_url: "",
    media_xml_url: "",
    credit_category: ""
  };

  const result: Ekyc[] = [];
  for (let i = 0; i < num; i++) {
    result.push({
      ...baseRecord,
      client_id: uuidv4(),
      email: email || `testuser${offset + i + 1}@yopmail.com`,
    });
  }

  return result;
};
