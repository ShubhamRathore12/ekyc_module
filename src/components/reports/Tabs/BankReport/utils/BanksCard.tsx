import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { banks } from "./Banks";
import Image from "next/image";
const BanksCard = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFF",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{mt: 2, mb: 2}}>Popular Banks</Typography>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap"
        }}
      >
        {banks.map((bank, i) => {
          return <Image key={i} src={bank} alt={bank} />;
        })}
      </Box>
    </Box>
  );
};

export default BanksCard;
