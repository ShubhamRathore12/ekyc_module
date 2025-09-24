import InputField from "@components/common/InputField";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Button, Grid, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
import Image from "next/image";
import SendLinkFromLayout from "../../utils/layouts/FromLayout";
import UploadIcon from "./assets/Upload.svg";
const SendLink = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      group: "",
      aoc_scheme: "",
      margin_amout: "",
      job: "",
      job_min: "",
      delv: "",
      delv_min: "",
      derivative_slabs_future: "",
      derivative_slabs_option: "",
      derivative_slabs_option_min: "",
      derivative_slabs_option_max: "",
      currency_slabs_future: "",
      currency_slabs_option: "",
      currency_slabs_option_min: "",
      currency_slabs_option_max: "",
      commodity_slabs_future: "",
      commodity_slabs_option: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });

  const BoxLayout = styled(Box)({
    backgroundColor: "#FFFF",
    marginBottom: 5,
  });
  return (
    <Box>
      <FormikProvider value={formik}>
        <Box sx={{ bgcolor: "#FFFF", pt: 2, pl: 2 }}>
          <Typography variant="h5">Send Link</Typography>
        </Box>
        <BoxLayout>
          <SendLinkFromLayout>
            <InputField name="name" type="text" text="Name*" />
            <InputField name="mobile" type="text" text="Mobile*" />
            <InputField name="email" type="email" text="EMail*" />
            <InputField name="margin_amount" type="text" text="Margin Amount*" />
            <SelectField name="group" label="Group *" />
            <SelectField name="aoc_scheme" label="Aoc Scheme*" />
          </SendLinkFromLayout>
        </BoxLayout>
        <BoxLayout>
          <SendLinkFromLayout title="Equity Slabs">
            <InputField name="job" type="text" text="Job % *" />
            <InputField name="job_min" type="text" text="Job Min % *" />
            <InputField name="delv" type="text" text="Delv % *" />
            <InputField name="delv_min" type="text" text="Delv Min *" />
          </SendLinkFromLayout>
        </BoxLayout>
        <BoxLayout>
          <SendLinkFromLayout title="Derivative Slabs">
            <InputField name="derivative_future" type="text" text="Future % *" />
            <InputField name="derivative_option" type="text" text="Option % *" />
            <InputField name="derivative_option_min" type="text" text="Option Min *" />
            <InputField name="derivative_option_max" type="text" text="Option Max *" />
          </SendLinkFromLayout>
        </BoxLayout>
        <BoxLayout>
          <SendLinkFromLayout title="Currency Slabs">
            <InputField name="currency_slabs_future" text="Future % *" type="text" />
            <InputField name="currency_slabs_option" text="Option % *" type="text" />
            <InputField name="currency_slabs_option_min" text="Option Min *" type="text" />
            <InputField name="currency_slabs_option_max" text="Option Max *" type="text" />
          </SendLinkFromLayout>
        </BoxLayout>
        <BoxLayout>
          <SendLinkFromLayout title="Commodity Slabs">
            <InputField name="commodity_slabs_future" text="Future % *" type="text" />
            <InputField name="commodity_slabs_option" text="Option % *" type="text" />
          </SendLinkFromLayout>
          <Grid item xs={4} sx={{ p: 2 }}>
            <Button
              // sx={{ width: 200 }}
              startIcon={<Image src={UploadIcon} alt="upload" />}
              variant="contained"
            >
              Send Link
            </Button>
          </Grid>
        </BoxLayout>
      </FormikProvider>
    </Box>
  );
};

export default SendLink;
