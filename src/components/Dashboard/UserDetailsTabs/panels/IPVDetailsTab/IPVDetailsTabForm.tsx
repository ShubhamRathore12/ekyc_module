import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import LabelContainer from "@components/common/LabelContainer";
import Status from "@components/common/Status";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DropZone } from "components/common/Upload";
import { Form, FormikProvider, useFormik } from "formik";
import { DropzoneProps } from "react-dropzone";
interface Props {
  onDrop: DropzoneProps["onDrop"];
}
const IPVDetailsTabForm = ({ onDrop }: Props) => {
  const formik = useFormik({
    initialValues: {
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
        <>
          <DynamicField>
            <LabelContainer>
              <Typography>Upload Document</Typography>
            </LabelContainer>
            <FieldContainer>
              <DropZone onDrop={onDrop} />
            </FieldContainer>
          </DynamicField>
        </>
        <>
          <Status name="status" />
        </>
        <Button
          sx={{ mt: 4 }}
          type="submit"
          variant="contained"
          size="large"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress /> : "Save and Continue"}
        </Button>
      </Box>
    </FormikProvider>
  );
};

export default IPVDetailsTabForm;
