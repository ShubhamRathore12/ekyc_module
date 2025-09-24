import InputField from "@components/common/InputField";
import styled from "@emotion/styled";
import useWindowDimensions from "@hooks/useWindowDimensions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import SelectField from "../BrokerageScheme/utils/SelectField";
const AllowSMCApplicants = () => {
  const { height, width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    return setWindowWidth(width);
  }, [width]);

  const formik = useFormik({
    initialValues: {
      pan: "",
      allow: "",
      create_date: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  const FullWidthBox = styled(Box)({
    display: "flex",
    alignItems: windowWidth < 940 ? "flex-start" : "center",
    // flexWrap: windowWidth<940 ? "wrap" : 'nowrap',
    flexDirection: windowWidth < 940 ? "column" : "row",
  });
  const CustomeTextField = styled(TextField)({
    "& .MuiInputBase-input": {
      backgroundColor: "hsla(0, 0%, 98%, 1)",
    },
  });
  return (
    <Box sx={{ p: 4, mt: 1, bgcolor: "white" }}>
      <Box>
        <Typography fontWeight={500} variant="h5" component="h5" sx={{ mb: 4 }}>
          Allow SMC Applicants
        </Typography>
        <FormikProvider value={formik}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <SelectField name="pan" label="Pan" />
              <InputField name="allow" text="Allow" type="text" />
              <InputField name="allow" text="CreateDate" type="text" />
            </Grid>
          </Grid>
          <Button variant="contained" size="large" type="submit">
            Submit
          </Button>
        </FormikProvider>
      </Box>
    </Box>
  );
};

export default AllowSMCApplicants;
