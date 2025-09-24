import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Chip, Stack, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import * as React from "react";
// import BasicApplicationsTab from "./BasicApplicationsTab/BasicApplications";
import AuthGuard from "@components/auth/AuthGuard";
import { capitalize, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useGetRejectionTemplateQuery, useGetAllEkycStatusQuery } from "services/ekyc.service";
import { DashboardTab } from "types/dashboard";
import BankAccountDetailsTab from "./panels/BankAccountDetailsTab";
import BasicApplications from "./panels/BasicApplicationsTab";
import ContactDetails from "./panels/ContactDetailsTab";
import DerivativeDetailsTab from "./panels/DerivativeDetailsTab";
import ESignDetailsTab from "./panels/ESignDetails";
import OtherDetailsTab from "./panels/OtherDetailsTab";
import PhotoTab from "./panels/PhotoTab";
import NomineeDetailsTab from "./panels/NomineeDetailsTab";
import SchemeDetailsTab from "./panels/SchemeDetailsTab";
import DematAccountDetailsTab from "./panels/DematAccountDetailsTab";
import { useSelector } from "react-redux";
import Verified from "@icons/Verified";

const initialTab: DashboardTab = DashboardTab.BASIC_DETAILS;
const lastTab: DashboardTab = DashboardTab.BANK_ACCOUNT_DETAILS;
// eslint-disable-next-line react-hooks/rules-of-hooks

export default function LabTabs() {
  const router = useRouter();

  const name = router.query.name;
  const pan = router.query.pan;
  const theme = useTheme();
  const StyledChip = styled(Chip)({
    // backgroundColor: `${theme.palette.primary.main}16`,
    color: theme.palette.text.primary,
    borderRadius: "4px",
    fontWeight: 600,
  });

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: DashboardTab.BASIC_DETAILS },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stage]);

  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: DashboardTab) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  const TabPanelCustomized = styled(TabPanel)({
    padding: 0,
    minHeight: "550px",
    overflow: "auto",
    marginTop: 20,
  });

  const { data } = useGetRejectionTemplateQuery();

  const productCode = (router.query.product as string)?.toUpperCase();
  const hiddenTabsForGrnpb = [
    DashboardTab.SCHEME_DETAILS,
    DashboardTab.DEMAT_ACCOUNT_DETAILS,
    DashboardTab.DERIVATIVE,
  ];

  // Additional tabs to hide specifically for SUBKRA
  const hiddenTabsForSubkra = [
    ...hiddenTabsForGrnpb,
    DashboardTab.BANK_ACCOUNT_DETAILS,
    DashboardTab.NOMINEE_DETAILS,
  ];

   const hiddenTabsForDemat = [
    DashboardTab.DERIVATIVE,
  ];

  const visibleTabs = Object.values(DashboardTab).filter((tab) => {
   if (
      productCode === "DEMAT_UPMOVE" ||
      productCode === "DEMAT"
    ) {
      return !hiddenTabsForDemat.includes(tab);
    } else  if (
      productCode === "SUBNKRA" ||
      productCode === "SUBKRA" ||
      productCode === "STXNKRA" ||
      productCode === "STXKRA"
    ) {
      return !hiddenTabsForSubkra.includes(tab);
    } else if (
      productCode === "GRPNB" ||
      productCode === "MFCNK" ||
      productCode === "MFCK" ||
      productCode === "SUBNKRA" ||
      productCode === "SUBKRA" ||
      productCode === "STXNKRA" ||
      productCode === "STXKRA"
    ) {
      return !hiddenTabsForGrnpb.includes(tab);
    }
    return true;
  });

  // Fetch per-tab verification status
  const client_id = router.query.userid as string;
  const { data: statusData } = useGetAllEkycStatusQuery({ client_id }, { skip: !client_id });
  const tabStatuses: any = statusData?.data?.status || {};

  const tabStatusKeyMap: Record<string, string> = {
    [DashboardTab.BASIC_DETAILS]: "basic_detail_status",
    [DashboardTab.CONTACT_DETAILS]: "contact_detail_status",
    [DashboardTab.BANK_ACCOUNT_DETAILS]: "bank_detail_status",
    [DashboardTab.OTHER_DETAILS]: "signature_detail_status",
    [DashboardTab.PHOTO]: "selfie_detail_status",
    [DashboardTab.E_SIGN_DETAILS]: "esign_detail_status",
    [DashboardTab.NOMINEE_DETAILS]: "nominee_detail_status",
    [DashboardTab.SCHEME_DETAILS]: "scheme_detail_status",
    [DashboardTab.DERIVATIVE]: "derivative_detail_status",
    [DashboardTab.DEMAT_ACCOUNT_DETAILS]: "demat_detail_status",
  };

  console.log(data);
  

  function renderTabPanel(currentTab: DashboardTab) {
    switch (currentTab) {
      case DashboardTab.BASIC_DETAILS:
        return <BasicApplications rejectionTemplates={data?.data?.rejection_templates || []} />;
      case DashboardTab.CONTACT_DETAILS:
        return <ContactDetails rejectionTemplates={data?.data?.rejection_templates || []} />;
      case DashboardTab.BANK_ACCOUNT_DETAILS:
        return <BankAccountDetailsTab rejectionTemplates={data?.data?.rejection_templates || []} />;
      // ````````````````````````````````````````````````

      case DashboardTab.SCHEME_DETAILS:
        return <SchemeDetailsTab rejectionTemplates={data?.data?.rejection_templates || []} />;
      case DashboardTab.DEMAT_ACCOUNT_DETAILS:
        return (
          <DematAccountDetailsTab rejectionTemplates={data?.data?.rejection_templates || []} />
        );

      // ````````````````````````````````````````````````
      case DashboardTab.OTHER_DETAILS:
        return <OtherDetailsTab rejectionTemplates={data?.data?.rejection_templates || []} />;
      case DashboardTab.DERIVATIVE:
        return <DerivativeDetailsTab />;
      // case DashboardTab.DP_DETAILS:
      //   return <DPDetailsTab />;
      case DashboardTab.NOMINEE_DETAILS:
        return <NomineeDetailsTab rejectionTemplates={data?.data?.rejection_templates || []} />;
      case DashboardTab.PHOTO:
        return <PhotoTab rejectionTemplates={data?.data?.rejection_templates || []} />;
      // case DashboardTab.SIGNATURE:
      //   return <SignatureTab />;
      // case DashboardTab.IPV_DETAILS:
      //   return <IPVDetailsTab />;
      case DashboardTab.E_SIGN_DETAILS:
        return (
          <ESignDetailsTab
            rejectionTemplates={data?.data?.rejection_templates || []}
            pan={pan as string}
          />
        );
      // case DashboardTab.SEGMENT_DETAILS:
      //   return <SegmentDetails />;
      default:
        // show 404 or error component
        return <></>;
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const numTabs = visibleTabs.length;
      const currentIndex = visibleTabs.indexOf(value as any);
      if (event.key === "ArrowLeft") {
        const newIndex = (currentIndex - 1 + numTabs) % numTabs;
        const newTab = visibleTabs[newIndex];
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, stage: newTab },
        });
      } else if (event.key === "ArrowRight") {
        const newIndex = (currentIndex + 1) % numTabs;
        const newTab = visibleTabs[newIndex];
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, stage: newTab },
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, value, visibleTabs]);

  if (!router.query.stage || !router.query.userid) return null;

  return (
    <AuthGuard>
      <Box sx={{ typography: "body1", m: 2 }}>
        <TabContext value={value}>
          <Stack
            direction="row"
            sx={{
              bgcolor: "#FFFF",
              borderRadius: "8px",
              position: "sticky",
              top: 65,
              zIndex: 3,
            }}
          >
            <TabList
              onChange={handleChange}
              TabIndicatorProps={{ sx: { display: "none" } }}
              aria-label="lab API tabs example"
              variant="scrollable"
              allowScrollButtonsMobile
            >
              {visibleTabs.map((tab) => {
                const statusKey = tabStatusKeyMap[tab];
                const statusForTab = tabStatuses[statusKey];
                return (
                  <Tab
                    key={tab}
                    value={tab}
                    label={
                      <Box display="flex" flexDirection="column" alignItems="center">
                        {statusForTab === 2 && (
                          <Verified
                            style={{ width: 20, height: 20, color: "#4caf50", marginBottom: 2 }}
                          />
                        )}
                        {tab.split("-").map(capitalize).join(" ")}
                      </Box>
                    }
                  />
                );
              })}
            </TabList>

            {(name || pan) && (
              <Stack
                direction="row"
                alignItems="center"
                gap={2}
                sx={{
                  p: 1,
                  ml: "auto",
                  backgroundColor: `${theme.palette.primary.main}16`,
                  borderRadius: "8px",
                }}
              >
                <Typography variant="subtitle2" color="initial" noWrap>
                  {name}
                </Typography>
                <Typography variant="subtitle2" color="initial" noWrap>
                  {pan}
                </Typography>
              </Stack>
            )}
          </Stack>
          {visibleTabs.map((tab) => (
            <TabPanelCustomized value={tab} key={tab}>
              {renderTabPanel(value as DashboardTab)}
            </TabPanelCustomized>
          ))}
        </TabContext>
      </Box>
    </AuthGuard>
  );
}
