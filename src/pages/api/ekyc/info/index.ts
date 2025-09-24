import { NextApiRequest, NextApiResponse } from "next";
import { GetEkycResponse, InfoKYC, InfoKYCResponse } from "types/ekyc";

export default function handler(req: NextApiRequest, res: NextApiResponse<InfoKYCResponse>) {
  if (req.method === "GET")
    // return res.status(405).json({ message: "method not allowed", status: "failed", data: [] });
    setTimeout(() => {
      return res.status(200).json({
        message: "fetched succesfully",
        status: "success",
        data: {
          total_applicants: 292674,
          pending_applicants: 203530,
          verified_applicants: 86696,
          rejected_applicants: 2448,
        },
      });
    }, 500);
}
