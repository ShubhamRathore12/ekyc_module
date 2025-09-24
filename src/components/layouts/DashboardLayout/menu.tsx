import ReportsIcon from "@icons/sidebar/ReportsIcon";
import UtilitiesIcon from "@icons/sidebar/UtilitiesIcon";
import VideoIcon from "@icons/sidebar/VideoIcon";

import WcEkycIcon from "@icons/sidebar/WcEkycIcon";
import LinkIcon from "@mui/icons-material/Link";
import { SVGProps } from "react";
import { LoginResponse } from "types/auth";
import DashboardIcon from "../../../icons/sidebar/DashboardIcon";

export interface MenuItem {
  id?: number;
  label: string;
  href: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const getMenu: (adminType: LoginResponse["data"]["admin_type"]) => MenuItem[] = (
  adminType
) => {
  if (adminType === "super_admin")
    return [
      { id: 1, label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
      // { id: 2, label: "WC eKYC", href: "/wc-ekyc", Icon: WCEkyc },
      // { id: 2, label: "CDU Request", href: "/cdu-request", Icon: WCEkyc },
      // { id: 3, label: "E-Nach", href: "/e-nach", Icon: ENachIcon },
      // { id: 4, label: "Tutorial", href: "/tutorials", Icon: TutorialIcon },
      // { id: 5, label: "DDPI Reports", href: "/ddpi-reports", Icon: DDPIReportsIcon },
      { id: 6, label: "Reports", href: "/reports", Icon: ReportsIcon },
      // { id: 7, label: "SubBroker", href: "/sub-broker", Icon: SubBrokerIcon },

      { id: 8, label: "Utilities", href: "/utilities", Icon: UtilitiesIcon },
      // { id: 10, label: "Backoffice", href: "/backoffice", Icon: WcEkycIcon },
      { id: 12, label: "Telecaller", href: "/telecaller", Icon: WcEkycIcon },
      { id: 13, label: "Video", href: "/video", Icon: VideoIcon },
    ];
  else if (adminType === "kra")
    return [
      { id: 1, label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
      { id: 6, label: "Reports", href: "/reports", Icon: ReportsIcon },
    ];
  else if (adminType === "telecaller")
    return [{ id: 12, label: "Telecaller", href: "/telecaller", Icon: WcEkycIcon }];
  else if (adminType === "grootsupport")
    return [
      { id: 1, label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
      { id: 6, label: "Reports", href: "/reports", Icon: ReportsIcon },
    ];
  else if (adminType === "lms_user")
    return [
      { id: 1, label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
      { id: 6, label: "Reports", href: "/reports", Icon: ReportsIcon },
    ];
  else if (adminType === "mf_user")
    return [
      { id: 10, label: "Backoffice", href: "/backoffice", Icon: WcEkycIcon },
      {
        id: 11,
        label: "Link & Reports",
        href: "/links",
        Icon: () => <LinkIcon style={{ color: "white" }} />,
      },
    ];
    else if (adminType === "sub_user")
      return [
        { id: 10, label: "Backoffice", href: "/backoffice", Icon: WcEkycIcon },
        {
          id: 11,
          label: "Link & Reports",
          href: "/links",
          Icon: () => <LinkIcon style={{ color: "white" }} />,
        },
      ];
        else if (adminType === "stx_user")
      return [
        { id: 10, label: "Backoffice", href: "/backoffice", Icon: WcEkycIcon },
        {
          id: 11,
          label: "Link & Reports",
          href: "/links",
          Icon: () => <LinkIcon style={{ color: "white" }} />,
        },
      ];
  else
    return [
      { id: 10, label: "Backoffice", href: "/backoffice", Icon: WcEkycIcon },
      {
        id: 11,
        label: "Link & Reports",
        href: "/links",
        Icon: () => <LinkIcon style={{ color: "white" }} />,
      },
    ];
};
