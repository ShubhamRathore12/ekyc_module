import AuthGuard from "@components/auth/AuthGuard";
import BackOfficeUccReport from "@components/links/Tabs/BackOfficeUccReport";
import PromoCode from "@components/links/Tabs/PromoCode";
import MasterReports from "@components/reports/Tabs/MasterReports";
import { useAuth } from "@hooks/useAuth";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styled from "@mui/material/styles/styled";
import Tab from "@mui/material/Tab";
import capitalize from "@mui/material/utils/capitalize";
import { Box } from "@mui/system";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { LinksTab } from "types/links";

const Reports: NextPage = () => {
  const router = useRouter();
  const auth = useAuth();

  // const linksTab = Object.values(LinksTab).filter((key) => {
  //   if (
  //     (auth.login?.data?.admin_type === "grootsupport" ||
  //       auth.login?.data?.admin_type === "lms_user") &&
  //     key !== LinksTab.PromoCode
  //     // &&
  //     // key !== LinksTab.SendLink
  //   ) {
  //     return false;
  //   }
  //   if (auth.login?.data?.admin_type === "mf_user" && key === LinksTab.PromoCode) {
  //     return false;
  //   }

  //   return true;
  // });
  const linksTab = Object.values(LinksTab).filter((key) => {
    const adminType = auth.login?.data?.admin_type;

    if ((adminType === "grootsupport" || adminType === "lms_user") && key === LinksTab.PromoCode) {
      return false;
    }

    if (adminType === "mf_user" || adminType === 'sub_user' || adminType === 'stx_user') {
     
      return key !== LinksTab.PromoCode;
    } else {
   
      return key !== LinksTab.MASTER_REPORT;
    }

    return true;
  });

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: LinksTab.PromoCode },
      });
    }
  }, [router.query.stage]);
  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: LinksTab) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  const TabPanelCustomized = styled(TabPanel)({
    paddingRight: 0,
    paddingLeft: 0,
  });

  function renderTabPanel(currentTab: LinksTab) {
    switch (currentTab) {
      case LinksTab.PromoCode:
        return <PromoCode />;
      case LinksTab.UCC_REPORT:
        return <BackOfficeUccReport />;
        case LinksTab.MASTER_REPORT:
        return <MasterReports />;
    }
  }

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      const adminType = auth.login?.data?.admin_type;
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          stage:
            adminType === "mf_user" || adminType === 'sub_user' ||adminType === 'stx_user' ? LinksTab.UCC_REPORT : LinksTab.PromoCode,
        },
      });
    }
  }, [router.query.stage, router.isReady, auth.login?.data?.admin_type]);
  

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const numTabs = linksTab.length;
      const currentIndex = linksTab.indexOf(value as any);
      if (event.key === "ArrowLeft") {
        const newIndex = (currentIndex - 1 + numTabs) % numTabs;
        const newTab = linksTab[newIndex];
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, stage: newTab },
        });
      } else if (event.key === "ArrowRight") {
        const newIndex = (currentIndex + 1) % numTabs;
        const newTab = linksTab[newIndex];
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
    // <AuthGuard>
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
            {linksTab.map((tab) => (
              <Tab label={tab.split("_").map(capitalize).join(" ")} value={tab} key={tab} />
            ))}
          </TabList>
        </Box>
        {linksTab.map((tab) => (
          <TabPanelCustomized value={tab} key={tab}>
            {renderTabPanel(value as LinksTab)}
          </TabPanelCustomized>
        ))}
      </TabContext>
    </Box>
    // </AuthGuard>
  );
};

Reports.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default Reports;
