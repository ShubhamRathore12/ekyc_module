import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
interface IProps {
  title?: string;
  children: React.ReactNode;
}
const FromLayout = ({ title, children }: IProps) => {
  return (
    <>
      <Box
        sx={{
          dsiplay: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ color: "primary.main" }} variant="h5">
          {title}
        </Typography>
      </Box>
      <Grid container sx={{ pt: 2 }} direction="row" alignItems="center" wrap="wrap">
        {children}
      </Grid>
    </>
  );
};

export default FromLayout;
