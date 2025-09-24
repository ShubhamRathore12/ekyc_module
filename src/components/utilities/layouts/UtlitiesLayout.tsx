import { styled } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const UtlitiesTabContainer = styled(Box)({
  width: "100%",
  backgroundColor: "#FFFF",
  borderRadius: 2,
  height: "auto",
});

const UtlitiesLayout = ({ children }: any) => {
  return <UtlitiesTabContainer>{children}</UtlitiesTabContainer>;
};

export default UtlitiesLayout;
