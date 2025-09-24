import { NextApiRequest, NextApiResponse } from "next";
import { EmailLogs, GetEmailLogRequest, GetEmailLogResponse } from "types/cdu-requests";
import { v4 as uuidv4 } from "uuid";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<GetEmailLogResponse>>
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "method not allowed", status: "failed" });

  const { no_of_records, page_no, email } = req.query as unknown as GetEmailLogRequest;

  const totalRecords = 65;
  const totalPages = Math.ceil(totalRecords / +no_of_records);

  if (email)
    // settimeout
    setTimeout(() => {
      return res.status(200).json({
        message: "fetched succesfully",
        status: "success",
        data: {
          total_no_of_records: 1,
          no_of_pages: 1,
          cdu_requests: page_no == 0 ? getDummyData(1, 0, email) : [],
        },
      });
    }, 5000);
  // settimeout
  setTimeout(() => {
    res.status(200).json({
      message: "fetched succesfully",
      status: "success",
      data: {
        total_no_of_records: totalRecords,
        no_of_pages: totalPages,
        cdu_requests:
          page_no >= totalPages ? [] : getDummyData(+no_of_records, page_no * no_of_records),
      },
    });
  }, 5000);
}

const getDummyData = (num: number, offset?: number, email?: string) => {
  const baseRecord: EmailLogs = {
    user_code: "SM84799",
    old_mobile_number: "7038703189",
    new_mobile_number: "9766082382",
    status: 0, // enum
    requested_on: "2022-10-27T14:12:56.523078Z",
    verified_on: "2022-10-27T14:12:56.523078Z",
    rejected_on: "2022-10-27T14:12:56.523078Z",
    rejected_remarks: "some remarks",
    email: email || "testuser5@yopmail.com",
  };
  const result: EmailLogs[] = [];
  for (let i = 0; i < num; i++) {
    result.push({
      ...baseRecord,
      user_code: uuidv4(),
      email: email || `testuser${(offset || 0) + i + 1}@yopmail.com`,
    });
  }
  return result;
};
