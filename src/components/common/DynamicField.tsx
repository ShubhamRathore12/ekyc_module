import { Grid } from "@mui/material";
const DynamicField = ({ children }: any) => {
  return (
    <Grid container alignItems="center" maxWidth="550px" sx={{ pb: 2 }}>
      {children}
    </Grid>
  );
};

export default DynamicField;
