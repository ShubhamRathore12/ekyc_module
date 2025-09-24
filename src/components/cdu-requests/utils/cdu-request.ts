import CDUBank from "@components/cdu-requests/assets/CDUBank";
import CDUEmail from "@components/cdu-requests/assets/CDUEmail";
import CDUMobile from "@components/cdu-requests/assets/CDUMobile";
import CDUSegment from "@components/cdu-requests/assets/CDUSegment";
import { SVGProps } from "react";
export enum CDURequestsTab {
  MOBILE = "Mobile",
  EMAIL = "Email",
  BANK = "Bank",
  SEGMENT = "Segment",
}

export interface CDURequestsMenu {
  id?: number;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const CDUMenu: CDURequestsMenu[] = [
  { id: 1, label: "Mobile", Icon: CDUMobile },
  { id: 2, label: "Email", Icon: CDUEmail },
  { id: 3, label: "Bank", Icon: CDUBank },
  { id: 4, label: "Segment", Icon: CDUSegment },
];
