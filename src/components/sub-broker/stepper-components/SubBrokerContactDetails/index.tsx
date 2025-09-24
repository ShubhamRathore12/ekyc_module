import InputField from "@components/common/InputField";
import TypeOfDocument from "@components/common/TypeOfDocument";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import { Box } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

const SubBrokerContactDetails = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      mobile: "",
      address1: "",
      address2: "",
      address3: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      referral_code: "",
      document_type: "",
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
    <>
      <TabFromLayout formHeading="Contact Details" formSubheading="" subtext="" saveButton={true}>
        <Box>
          <FormikProvider value={formik}>
            <InputField name="email" text="Email" type="text" />
            <InputField name="mobile" text="Mobile" type="text" />
            <InputField name="address1" text="Address1" type="text" />
            <InputField name="address2" text="Address2" type="text" />
            <InputField name="address3" text="Address3" type="text" />
            <InputField name="pincode" text="Pincode" type="text" />
            <InputField name="country" text="Country" type="text" />
            <InputField name="state" text="State" type="text" />
            <InputField name="city" text="City" type="text" />
            <InputField name="referral_code" text="Referral Code" type="text" />
            <TypeOfDocument name="document_type" />
          </FormikProvider>
        </Box>
      </TabFromLayout>
    </>
  );
};

export default SubBrokerContactDetails;
