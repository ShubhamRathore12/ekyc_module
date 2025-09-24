import { Box } from "@mui/material";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";

const ENach: NextPage = () => {
  return <Box sx={{ gap: 4, p: 3 }}>E-NACH</Box>;
};

ENach.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ENach;
