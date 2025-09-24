import InputField from "@components/common/InputField";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
const GenerateLink = () => {
  const formik = useFormik({
    initialValues: {
      group: "",
      link: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Box
        sx={{
          bgcolor: "#FFFF",
          p: 2,
        }}
      >
        <Typography variant="h5">PromoCode Link</Typography>
        <Grid container flexDirection="column" sx={{ mt: 2 }}>
          <SelectField name="group" label="Group*" />
          <InputField name="link" text="Link*" type="text" />
          <Grid item xs={4}>
            <Button variant="contained" sx={{ width: "200px", height: "40px", mt: 5 }}>
              Generate Link{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormikProvider>
  );
};

export default GenerateLink;
