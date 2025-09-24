import { Grid } from "@mui/material";

const FieldContainer = ({ children }: any) => {
  return (
    <>
      <Grid item xs={12} md={8} gap={0} flexDirection="row" alignItems="center">
        {children}
      </Grid>
    </>
  );
};

export default FieldContainer;
