import AuthGuard from "@components/auth/AuthGuard";
import CVLKRAReports from "@components/reports/Tabs/CVLKRA";
import DPIdDetails from "@components/reports/Tabs/DPIdDetails";
import FTMappingReport from "@components/reports/Tabs/FTMapppingReport";
import MasterReports from "@components/reports/Tabs/MasterReports";
import DEMATReports from "@components/reports/Tabs/DematReport";
import UCCReport from "@components/reports/Tabs/UCCReport";
import { useAuth } from "@hooks/useAuth";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { capitalize } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ReportsTab } from "types/reports";
import PaymentReport from "@components/reports/Tabs/PaymentReport";

const Reports: NextPage = () => {
  const router = useRouter();
  const auth = useAuth();

  const reportsTabs = Object.values(ReportsTab).filter((key) => {
    if (
      // auth.login?.data?.admin_type === "grootsupport" ||
      auth.login?.data?.admin_type === "lms_user" &&
      key !== ReportsTab.MASTER_REPORT &&
      key !== ReportsTab.UCC_REPORT && 
      key !== ReportsTab.PAYMENT_REPORT
    ) {
      return false;
    } else if (
      auth.login?.data?.admin_type === "grootsupport" &&
      key !== ReportsTab.MASTER_REPORT &&
      key !== ReportsTab.UCC_REPORT &&
      key !== ReportsTab.DEMAT_REPORT && 
      key !== ReportsTab.PAYMENT_REPORT
    ) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: ReportsTab.MASTER_REPORT },
      });
    }
  }, [router.query.stage]);
  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: ReportsTab) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  const TabPanelCustomized = styled(TabPanel)({
    paddingRight: 0,
    paddingLeft: 0,
  });

  function renderTabPanel(currentTab: ReportsTab) {
    switch (currentTab) {
      case ReportsTab.MASTER_REPORT:
        return <MasterReports />;
      case ReportsTab.UCC_REPORT:
        return <UCCReport />;
      case ReportsTab.CVLKRA_REPORT:
        return <CVLKRAReports />;
      case ReportsTab.FT_MAPPING_REPORT:
        return <FTMappingReport />;
      case ReportsTab.DP_ID_DETAILS:
        return <DPIdDetails />;
      case ReportsTab.DEMAT_REPORT:
        return <DEMATReports />;
      case ReportsTab.PAYMENT_REPORT:
        return <PaymentReport />;
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const numTabs = reportsTabs.length;
      const currentIndex = reportsTabs.indexOf(value as any);
      if (event.key === "ArrowLeft") {
        const newIndex = (currentIndex - 1 + numTabs) % numTabs;
        const newTab = reportsTabs[newIndex];
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, stage: newTab },
        });
      } else if (event.key === "ArrowRight") {
        const newIndex = (currentIndex + 1) % numTabs;
        const newTab = reportsTabs[newIndex];
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
  }, [router, value]);

  if (!router.query.stage) return null;

  return (
    <AuthGuard>
      <Box>
        <TabContext value={value}>
          <Box
            sx={{
              borderRadius: 2,
              borderBottom: 1,
              borderColor: "divider",
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
              // scrollButtons
              allowScrollButtonsMobile
            >
              {reportsTabs.map((tab) => (
                <Tab label={tab.split("_").map(capitalize).join(" ")} value={tab} key={tab} />
              ))}
            </TabList>
          </Box>
          {reportsTabs.map((tab) => (
            <TabPanelCustomized value={tab} key={tab}>
              {renderTabPanel(value as ReportsTab)}
            </TabPanelCustomized>
          ))}
        </TabContext>
      </Box>
    </AuthGuard>
  );
};

Reports.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Reports;
