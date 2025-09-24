import Dashboard from "@components/sub-broker/Dashboard";
import OpenAccount from "@components/sub-broker/open-account";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { capitalize } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { tabsClasses } from "@mui/material/Tabs";
import { Box } from "@mui/system";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { SubBrokerTab } from "types/subborker";
const SubBroker: NextPage = () => {
  const router = useRouter();
  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: SubBrokerTab.DASHBOARD },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stage]);
  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: SubBrokerTab) => {
    // const { step: _, ...query } = router.query;
    delete router.query.step;
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  const TabPanelCustomized = styled(TabPanel)({
    paddingRight: 0,
    paddingLeft: 0,
  });

  function renderTabPanel(currentTab: SubBrokerTab) {
    switch (currentTab) {
      case SubBrokerTab.DASHBOARD:
        return <Dashboard />;
      case SubBrokerTab.OPEN_ACCOUNT:
        return <OpenAccount />;
    }
  }

  return (
    <>
      <Box sx={{ typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              sx={{
                "&.MuiTabs-root": {
                  backgroundColor: "#FFFF",
                  borderRadius: "10px",
                  p: 0.3,
                  "& .MuiTabs-flexContainer": {
                    display: "flex",
                    // justifyContent:'space-evenly'
                    gap: 2,
                  },
                  [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { opacity: 0.3 },
                  },
                },
              }}
              onChange={handleChange}
              TabIndicatorProps={{ sx: { display: "none" } }}
              aria-label="lab API tabs example"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {Object.values(SubBrokerTab).map((tab) => (
                <Tab label={tab.split("-").map(capitalize).join(" ")} value={tab} key={tab} />
              ))}
            </TabList>
          </Box>
          {Object.values(SubBrokerTab).map((tab) => (
            <TabPanelCustomized value={tab} key={tab}>
              {renderTabPanel(value as SubBrokerTab)}
            </TabPanelCustomized>
          ))}
        </TabContext>
      </Box>
    </>
  );
};

SubBroker.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubBroker;
