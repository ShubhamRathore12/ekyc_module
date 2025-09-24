import { NextApiRequest, NextApiResponse } from "next";
import { GetPersonalDetailsEnumsResponse } from "types/ekyc";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPersonalDetailsEnumsResponse>
) {
  if (req.method !== "GET")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(405).json({ message: "method not allowed", status: "failed", data: null });

  setTimeout(() => {
    return res.status(200).json({
      message: "fetched succesfully",
      status: "success",
      data: {
        occupations: [
          {
            type: "private_sector",
            title: "Private Sector",
          },
          {
            type: "public_sector",
            title: "Public Sector",
          },
          {
            type: "govt_sector",
            title: "Govt. Sector",
          },
          {
            type: "business",
            title: "Business",
          },
          {
            type: "student",
            title: "Student",
          },
          {
            type: "retired",
            title: "Retired",
          },
          {
            type: "other",
            title: "Other",
          },
        ],
        trade_experience: [
          {
            type: "less_than_1_year",
            title: "< 1 year",
          },
          {
            type: "between_1_to_5_years",
            title: "1 - 5 years",
          },
          {
            type: "between_5_to_10_years",
            title: "5 - 10 years",
          },
          {
            type: "greater_than_10_years",
            title: "> 10 years",
          },
        ],
        annual_income: [
          {
            type: "less_than_1_lakh",
            title: "0 - 1 Lakh",
          },
          {
            type: "between_1_to_5_lakh",
            title: "1 - 5 Lakhs",
          },
          {
            type: "between_5_to_10_lakh",
            title: "5 - 10 Lakhs",
          },
          {
            type: "greater_than_10_lakh",
            title: "> 10 Lakhs",
          },
        ],
        marital_status: [
          {
            type: "single",
            title: "Single",
          },
          {
            type: "married",
            title: "Married",
          },
        ],
      },
    });
  }, 1000);
}
