import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import InputField from "@components/common/InputField";
import LabelContainer from "@components/common/LabelContainer";
import MUIDateComponent from "@components/common/MUIDateComponent";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, Button, capitalize, CircularProgress, Typography } from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { Form, FormikProvider, useFormik } from "formik";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdateSignatureDetailsMutation } from "services/ekyc.service";
import { APIError } from "types/api";
import { Option } from "types/app";
import { SignatureDetail } from "types/ekyc";
import * as Yup from "yup";
import { DropZone } from "../../../../common/Upload";

interface Props {
  details: SignatureDetail;
  onDrop: DropzoneProps["onDrop"];
  enums?: {
    [key in keyof SignatureDetail]: Option[];
  };
  client_id: string;
}
const fileKeys: (keyof SignatureDetail)[] = ["uploaded_image_urls"];
const dateKeys: (keyof SignatureDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof SignatureDetail)[] = [];
const SignatureTabForm = ({ onDrop, details, enums, client_id }: Props) => {
  const optionalKeys: (keyof SignatureDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof SignatureDetail));
  const validationSchemaObj: Partial<Record<keyof SignatureDetail, Yup.AnySchema>> = {};
  const [updateSignatureDetails] = useUpdateSignatureDetailsMutation();
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(details).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof SignatureDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });

  const formik = useFormik({
    initialValues: { ...details },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        const response = await updateSignatureDetails({ ...values, client_id }).unwrap();
        toast.success(response?.message);
      } catch (error) {
        toast.error((error as APIError)?.error || "Something went wrong");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  //
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
        {Object.keys(formik.values).map((key) =>
          optionalKeys.some((_key) => _key === key) ? (
            <SelectField
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof SignatureDetail]}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : (
            !fileKeys.some((_key) => _key === key) && (
              <InputField
                key={key}
                name={key}
                text={key.split("_").map(capitalize).join(" ")}
                type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
              />
            )
          )
        )}
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

export default SignatureTabForm;
