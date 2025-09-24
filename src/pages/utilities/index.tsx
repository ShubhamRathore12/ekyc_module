import AuthGuard from "@components/auth/AuthGuard";
import AddUsers from "@components/utilities/Tabs/AddUsers";
import AocSchemeCharge from "@components/utilities/Tabs/AocSchemeCharge";
import BrokerageScheme from "@components/utilities/Tabs/BrokerageScheme";
import PromoCodes from "@components/utilities/Tabs/PromoCodes";
import SystemConfig from "@components/utilities/Tabs/SystemConfig";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styled from "@mui/material/styles/styled";
import Tab from "@mui/material/Tab";
import tabsClasses from "@mui/material/Tabs/tabsClasses";
import capitalize from "@mui/material/utils/capitalize";
import { Box } from "@mui/system";
import handleError from "@utils/handleError";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { UtilitiesTab } from "types/utilities";

const initialTab = UtilitiesTab.ADD_USERS;

const Utilities: NextPage = () => {
  const router = useRouter();
  const [idxValue, setIdxValue] = React.useState(0);

  React.useEffect(() => {
    if (!router.query.stage && router.isReady) {
      setIdxValue(Object.values(UtilitiesTab).indexOf(initialTab));
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: initialTab },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stage]);

  const value = router.query.stage as string;

  const handleChange = (event: React.SyntheticEvent, newValue: UtilitiesTab) => {
    setIdxValue(Object.values(UtilitiesTab).indexOf(newValue));
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, stage: newValue },
    });
  };

  const TabPanelCustomized = styled(TabPanel)({
    paddingRight: 0,
    paddingLeft: 0,
  });

  function renderTabPanel(currentTab: UtilitiesTab) {
    switch (currentTab) {
      // case UtilitiesTab.CHANGE_KRA_PASSWORD:
      //   return <ChangeKRAPassword />;
      case UtilitiesTab.AOC_SCHEME_CHARGE:
        return <AocSchemeCharge />;
      case UtilitiesTab.BROKERAGE_SCHEME:
        return <BrokerageScheme/>;
      case UtilitiesTab.PROMO_CODES:
        return <PromoCodes />;
      // case UtilitiesTab.ADD_PRODUCT:
      //   return <AddProduct />;
      case UtilitiesTab.ADD_USERS:
        return <AddUsers />;
      case UtilitiesTab.SYSTEM_CONFIG:
        return <SystemConfig />;
      // case UtilitiesTab.BANK_MASTER:
      //   return <BankMaster />;
      // case UtilitiesTab.DELETE_APPLICATIONS:
      //   return <DeleteApplications />;
      // case UtilitiesTab.GROUP_MASTER:
      //   return <GroupMaster />;
      // case UtilitiesTab.ALLOW_SMC_APPLICANTS:
      //   return <AllowSMCApplicants />;
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Get the number of tabs
    const numTabs = document.querySelectorAll(".MuiTab-root").length;

    // Check which key is pressed
    switch (event.key) {
      case "ArrowLeft":
        // If left arrow is pressed, go to the previous tab or wrap around
        setIdxValue((idxValue - 1 + numTabs) % numTabs);
        break;
      case "ArrowRight":
        // If right arrow is pressed, go to the next tab or wrap around
        setIdxValue((idxValue + 1) % numTabs);
        break;
      default:
        // Do nothing for other keys
        break;
    }
  };

  React.useEffect(() => {
    // Add the listener when the component mounts
    try {
      document.addEventListener("keydown", handleKeyDown);
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, stage: Object.values(UtilitiesTab)[idxValue] },
      });

      // Remove the listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } catch (error) {
      handleError(error);
    }
  }, [idxValue]);

  if (!router.query.stage) return null;

  return (
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
          // scrollButtons
          allowScrollButtonsMobile
        >
          {Object.values(UtilitiesTab).map((tab) => (
            <Tab label={tab.split("_").map(capitalize).join(" ")} value={tab} key={tab} />
          ))}
        </TabList>
      </Box>
      {Object.values(UtilitiesTab).map((tab) => (
        <TabPanelCustomized value={tab} key={tab}>
          {renderTabPanel(value as UtilitiesTab)}
        </TabPanelCustomized>
      ))}
    </TabContext>
  );
};

Utilities.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default Utilities;