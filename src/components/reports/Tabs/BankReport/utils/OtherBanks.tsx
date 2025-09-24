import React from "react";
import { Box } from "@mui/system";
import { Typography, styled } from "@mui/material";
import OtherBankIcon from "./banks svgs/otherBank.svg";
import { otherBanks } from "./Banks";
import Image from "next/image";
const OtherBanksBox = styled(Box)({
  width: "100%",
  borderBottom: "1px solid hsla(0, 0%, 26%, 1)",
  display: "flex",
  marginTop: 2,
  paddingBottom: 5,
  gap: 20,
});
const OtherBanks = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFF",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        All other banks
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height:'200px',
          overflow:'scroll'
        }}
      >
        {otherBanks.map((bank, i) => {
          return (
            <OtherBanksBox key={i}>
              <Image src={OtherBankIcon} alt="other bank icon" />
              <Typography>{bank}</Typography>
            </OtherBanksBox>
          );
        })}
      </Box>
    </Box>
  );
};

export default OtherBanks;
