import useWindowDimensions from "@hooks/useWindowDimensions";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "store";
import { DashboardHeader } from "./DashboardHeader";
import DashboardSideBar from "./DashboardSidebar";
import DrawerComp from "./Drawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { children } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { height, width } = useWindowDimensions();
  const { headerHeight, sidebarWidth, expandedSidebarWidth } = useSelector((state) => state.app);

  useEffect(() => {
    return setWindowWidth(width);
  }, [width]);

  function clickHandler() {
    setIsExpanded(!isExpanded);
  }

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {windowWidth > 650 ? (
        <Box>
          <DashboardSideBar isExpanded={isExpanded} clickHandler={clickHandler} />
        </Box>
      ) : (
        <Box>
          <DrawerComp isExpanded={isExpanded} clickHanler={clickHandler} />
        </Box>
      )}
      <Box
        sx={{
          width:
            windowWidth < 650
              ? "100%"
              : {
                  sm: isExpanded
                    ? `calc(100% - ${expandedSidebarWidth}px)`
                    : `calc(100% - ${sidebarWidth}px)`,
                  // sm: isExpanded ? `calc(100% - 196px)` : `calc(100vw - 97px)`,
                },
        }}
      >
        <DashboardHeader isExpanded={isExpanded} clickHandler={clickHandler} />
        <Box height={`calc(100% - ${headerHeight}px)`} sx={{ m: { xs: 1, xl: 2 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
