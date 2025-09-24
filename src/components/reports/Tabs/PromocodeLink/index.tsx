import InputField from "@components/common/InputField";
import FromLayout from "@components/reports/utils/layouts/FromLayout";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
const PrmocodeLink = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      group: "",
      promocode: "",
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
        <FromLayout>
          <InputField name="name" type="text" text="Name *" />
          <InputField name="mobile" type="text" text="Mobile *" />
          <InputField name="email" type="email" text="Email *" />
          <SelectField name="group" label="Group*" />
          <SelectField name="promocode" label="Promocode*" />
        </FromLayout>
        <Button variant="contained" size="large" sx={{ width: { xs: "100%", md: "200px" } }}>
          Send Link
        </Button>
      </Box>
    </FormikProvider>
  );
};

export default PrmocodeLink;
