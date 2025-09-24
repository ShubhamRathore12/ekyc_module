import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import LabelContainer from "@components/common/LabelContainer";
import Status from "@components/common/Status";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { DropZone } from "components/common/Upload";
import { Form, FormikProvider, useFormik } from "formik";
import { DropzoneProps } from "react-dropzone";
import FromElements from "../../../../common/InputField";
interface Props {
  onDrop: DropzoneProps["onDrop"];
}
const DPDeatailsForm = ({ onDrop }: Props) => {
  const formik = useFormik({
    initialValues: {
      want_dp_account: "",
      dp_account_type: "",
      cdls_id: "",
      dp_id: "",
      bo_id: "",
      depository: "SMC GLOBAL SECURITES LTD.",
      dp_name: "",
      poa: "N",
      statement_frequency: "QUATERLY",
      upload_dp_id: "",
      status: "",
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
      <Box component={Form}>
        <DynamicField>
          <LabelContainer>
            <Typography noWrap>Want Dp Account</Typography>
          </LabelContainer>
          <FieldContainer>
            <TextField
              select
              sx={{
                width: "100%",
                mb: 2,
                "& .MuiInputBase-input": {
                  bgcolor: "hsla(0, 0%, 98%, 1)",
                },
              }}
              name="want_dp_account"
              value={formik.values.want_dp_account}
              onChange={(e) => {
                formik.setFieldValue("want_dp_account", e.target.value);
              }}
            >
              <MenuItem>Yes</MenuItem>
              <MenuItem>No</MenuItem>
            </TextField>
          </FieldContainer>
        </DynamicField>
        <DynamicField>
          <LabelContainer>
            <Typography noWrap>Dp Account Type</Typography>
          </LabelContainer>
          <FieldContainer>
            <TextField
              select
              sx={{
                width: "100%",
                mb: 2,
                "& .MuiInputBase-input": {
                  bgcolor: "hsla(0, 0%, 98%, 1)",
                },
              }}
              name="dp_account_type"
              value={formik.values.dp_account_type}
              onChange={(e) => {
                formik.setFieldValue("dp_account_type", e.target.value);
              }}
            >
              <MenuItem>CDSL</MenuItem>
              <MenuItem>CDSL</MenuItem>
              <MenuItem>CDSL</MenuItem>
              <MenuItem>CDSL</MenuItem>
            </TextField>
          </FieldContainer>
        </DynamicField>

        <FromElements name="cdls_id" text="CDLS Id" type="text" />

        <FromElements name="dp_id" text="Dp Id" type="text" />

        <FromElements name="bo_id" text="BoId" type="text" />

        <FromElements name="depository" text="Dipository" type="text" />

        <FromElements name="dp_name" text="Dp Name" type="text" />

        <FromElements name="poa" text="POA" type="text" />

        <FromElements name="statement_frequency" text="Statement Frequency" type="text" />

        <DynamicField>
          <LabelContainer>
            <Typography noWrap>Dp Account Type</Typography>
          </LabelContainer>
          <FieldContainer>
            <TextField
              select
              sx={{
                width: "100%",
                mb: 1,
                "& .MuiInputBase-input": {
                  bgcolor: "hsla(0, 0%, 98%, 1)",
                },
              }}
              name="gender"
              value={formik.values.upload_dp_id}
              onChange={(e) => {
                formik.setFieldValue("upload_dp_id", e.target.value);
              }}
            >
              <MenuItem>Latest Income Tax Return</MenuItem>
              <MenuItem>Latest Income Tax Return</MenuItem>
              <MenuItem>Latest Income Tax Return</MenuItem>
              <MenuItem>Latest Income Tax Return</MenuItem>
            </TextField>
          </FieldContainer>
        </DynamicField>

        <Status name="status" />

        <DropZone onDrop={onDrop} />

        {/* <Button
          sx={{ mt: 4 }}
          type="submit"
          variant="contained"
          size="large"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress /> : "Save and Continue"}
        </Button> */}
      </Box>
    </FormikProvider>
  );
};

export default DPDeatailsForm;
