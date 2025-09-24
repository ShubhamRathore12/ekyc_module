import InputField from "@components/common/InputField";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

export default function ChangeKRAPassword() {
  const formik = useFormik({
    initialValues: {
      kra_password: "",
      kra_passcode: "",
      kra_user: "",
      kra_passkey: "",
    },
    validationSchema: Yup.object().shape({
      // pan_number: Yup.string()
      //   .required("PAN is required")
      //   .min(12, "PAN must be 12 digits")
      //   .max(12, "PAN must be 12 digits"),
      kra_password: Yup.string().required("KRA password is required"),
      kra_passcode: Yup.date().required("KRA Passcode is required"),
      kra_user: Yup.string().required("KRA user is required"),
      kra_passkey: Yup.string().required("KRA Passkey is required"),
    }),
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Box sx={{ p: 2, mt: 1, bgcolor: "white" }}>
        <Box>
          <Typography variant="h5" component="h5" sx={{ mb: 5 }}>
            Change KRA Password
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <InputField
            name="kra_password"
            type="text"
            text="KRA Password"
            placeholder="Enter your Password"
          />
          <InputField
            type="text"
            name="kra_passcode"
            text="KRA PosCode"
            placeholder="Enter your PosCode"
          />
          <InputField type="text" name="kra_user" text="KRA User" placeholder="Enter your User" />
          <InputField
            type="text"
            name="kra_passkey"
            text="KRA PassKey"
            placeholder="Enter your Passkey"
          />
        </Box>
        <Button size="large" type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </FormikProvider>
  );
}
