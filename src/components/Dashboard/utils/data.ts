import { SelectChangeEvent } from "@mui/material";
import PendingApllicantAsset from "@public/assets/dashboard/PendingApplicantsAssets.png";
import RejectedApplicantsAsset from "@public/assets/dashboard/RejectedApplicantsAsset.png";
import TotalApplicantsAsset from "@public/assets/dashboard/TotalApplicantsAsset.png";
import VerifiedApplicantsAsset from "@public/assets/dashboard/VerifiedApplicantsAsset.png";

export interface CardData {
  title: string;
  numberOfApplicants: number | undefined;
  duration: string;
  bgColor: string;
  iconColor: string;
  illustration: any;
  loading?: boolean;
  success?: boolean;
  period?: string;
  handleChange?: (event: SelectChangeEvent) => void;
}

export const cards = [
  {
    title: "TOTAL APPLICANTS",
    numberOfApplicants: 292674,
    duration: "",
    bgColor: "hsla(215, 98%, 56%, 0.38)",
    iconColor: "hsla(215, 74%, 64%, 1)",
    illustration: TotalApplicantsAsset,
  },
  {
    title: "PENDING APPLICANTS",
    numberOfApplicants: 203530,
    duration: "",
    bgColor: "hsla(45, 100%, 74%, 1)",
    iconColor: "hsla(45, 33%, 45%, 1)",
    illustration: PendingApllicantAsset,
  },
  {
    title: "VERIFIED APPLICANTS",
    numberOfApplicants: 86696,
    duration: "",
    bgColor: "hsla(160, 68%, 65%, 1)",
    iconColor: "hsla(160, 100%, 34%, 1)",
    illustration: VerifiedApplicantsAsset,
  },
  {
    title: "REJECTED APPLICANTS",
    numberOfApplicants: 2448,
    duration: "",
    bgColor: "hsla(350, 100%, 81%, 1)",
    iconColor: "hsla(354, 99%, 68%, 1)",
    illustration: RejectedApplicantsAsset,
  },
];
