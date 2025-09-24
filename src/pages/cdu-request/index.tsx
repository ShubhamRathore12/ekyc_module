import CDUBank from "@components/cdu-requests/tabs/CDUBankTab";
import CDUEmailTab from "@components/cdu-requests/tabs/CDUEmailTab";
import CDUMobileTab from "@components/cdu-requests/tabs/CDUMobileTab";
import CDUSegment from "@components/cdu-requests/tabs/CDUSegmentTab";
import { CDUMenu, CDURequestsTab } from "@components/cdu-requests/utils/cdu-request";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Typography } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Tab from "@mui/material/Tab";
import tabsClasses from "@mui/material/Tabs/tabsClasses";
import { useMediaQuery } from "hooks/useMediaQuery";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const TabPanelCustomized = styled(TabPanel)({
  paddingRight: 0,
  paddingLeft: 0,
});

const CDURequest: NextPage = () => {
  const router = useRouter();
  const mdUp = useMediaQuery("md");

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: CDURequestsTab.MOBILE },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stage]);
  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: CDURequestsTab) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  function renderTabPanel(currentTab: CDURequestsTab) {
    switch (currentTab) {
      case CDURequestsTab.EMAIL:
        return <CDUEmailTab />;
      case CDURequestsTab.BANK:
        return <CDUBank />;
      case CDURequestsTab.MOBILE:
        return <CDUMobileTab />;
      case CDURequestsTab.SEGMENT:
        return <CDUSegment />;
    }
  }

  return (
    <>
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
                "& .MuiButtonBase-root": {
                  flexDirection: "row",
                  gap: 2,
                  fontSize: 15,
                  alignItems: "center",
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
            {/* {Object.values(CDURequestsTab).map((tab) => (
              <Tab
                label={tab.split("_").map(capitalize).join(" ")}
                value={tab}
                key={tab}
                icon={<Image src={`${tab.toLowerCase()}`} alt={"icon"} height={30} width={30} />}
              />
            ))} */}
            {CDUMenu.map((tab) => {
              return (
                <Tab
                  key={tab.id}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        // gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: tab.label === value ? "#FFFF" : "hsla(0, 0%, 44%, 1)" }}
                      >
                        {tab.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: tab.label === value ? "#FFFF" : "hsla(0, 0%, 44%, 1)" }}
                      >
                        (New Request(s) - 11)
                      </Typography>
                    </Box>
                  }
                  value={tab.label}
                  icon={
                    mdUp ? (
                      tab.label === value ? (
                        <tab.Icon fill="#FFFF" />
                      ) : (
                        <tab.Icon fill="hsla(0, 0%, 44%, 1)" />
                      )
                    ) : (
                      ""
                    )
                  }
                />
              );
            })}
          </TabList>
        </Box>
        {Object.values(CDURequestsTab).map((tab) => (
          <TabPanelCustomized value={tab} key={tab}>
            {renderTabPanel(value as CDURequestsTab)}
          </TabPanelCustomized>
        ))}
      </TabContext>
    </>
  );
};

CDURequest.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CDURequest;
