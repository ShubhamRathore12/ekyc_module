import InputField from "@components/common/InputField";
import FullWidthField from "@components/utilities/common/FullWidthField";
import styled from "@emotion/styled";
import useWindowDimensions from "@hooks/useWindowDimensions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import SelectField from "../BrokerageScheme/utils/SelectField";
const DeleteApplications = () => {
  const { height, width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    return setWindowWidth(width);
  }, [width]);

  const formik = useFormik({
    initialValues: {
      select_mobile_or_pan: "",
      mobile_number: "",
      remarks: "",
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
          Delete Applicants
        </Typography>
        <FormikProvider value={formik}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <SelectField name="select_mobile_or_pan" label="Select Mobile / Pan" />
              <InputField name="mobile-number" text="Mobile Number" type="text" />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FullWidthField name="remarks" label="Remarks" multiline maxRows={5} rows={5} />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button variant="contained" size="large" type="submit">
                Delete Applicant
              </Button>
            </Grid>
          </Grid>
        </FormikProvider>
      </Box>
    </Box>
  );
};

export default DeleteApplications;
