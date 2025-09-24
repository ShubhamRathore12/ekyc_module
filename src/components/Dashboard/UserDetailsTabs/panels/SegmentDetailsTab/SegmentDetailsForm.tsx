import MUIDateComponent from "@components/common/MUIDateComponent";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, Button, capitalize, CircularProgress } from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { DropZone } from "components/common/Upload";
import { Form, FormikProvider, useFormik } from "formik";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdateSegmentDetailsMutation } from "services/ekyc.service";
import { APIError } from "types/api";
import { Option } from "types/app";
import { SegmentDetail } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";

interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: SegmentDetail;
  enums?: {
    [key in keyof SegmentDetail]: Option[];
  };
  client_id: string;
}

const fileKeys: (keyof SegmentDetail)[] = [];
const dateKeys: (keyof SegmentDetail)[] = ["created_at", "updated_at"];
const optionalKeys: (keyof SegmentDetail)[] = ["status"];
const numberKeys: (keyof SegmentDetail)[] = [];
const SegmentDetailsForm = ({ details, onDrop, enums, client_id }: Props) => {
  const validationSchemaObj: Partial<Record<keyof SegmentDetail, Yup.AnySchema>> = {};
  const [updateSegmentDetails] = useUpdateSegmentDetailsMutation();
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(details).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof SegmentDetail] = Yup.string().required(
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
        const response = await updateSegmentDetails({ ...values, client_id }).unwrap();
        toast.success(response?.message);
      } catch (error) {
        toast.error((error as APIError)?.error || "Something went wrong");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        <DropZone onDrop={onDrop} />

        {Object.keys(formik.values).map((key) =>
          optionalKeys.some((_key) => _key === key) ? (
            <SelectField
              // value={formik.values.gender}
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof SegmentDetail]}
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

export default SegmentDetailsForm;
