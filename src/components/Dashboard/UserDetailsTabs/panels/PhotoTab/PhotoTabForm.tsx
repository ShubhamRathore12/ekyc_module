import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import {
  Box,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdateSelfieDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { orderedPhotoDetails, RejectionTemplate, SelfieDetail } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";
interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: SelfieDetail;
  enums: {
    [key in keyof SelfieDetail]: Option[];
  };
  client_id: string;
  rejectionTemplates: RejectionTemplate[];
}

const fileKeys: (keyof SelfieDetail)[] = [];
const dateKeys: (keyof SelfieDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof SelfieDetail)[] = ["status"];
const PhotoTabForm = ({ details, onDrop, enums, client_id, rejectionTemplates }: Props) => {
  const [photoDetails, setPhotoDetails] = React.useState<(keyof SelfieDetail)[]>();
  React.useEffect(() => {
    if (details.status === 3) {
      orderedPhotoDetails.splice(orderedPhotoDetails.length - 1, 0, "reject_reason");
      setPhotoDetails(orderedPhotoDetails);
    } else {
      const temp = orderedPhotoDetails.filter((f) => f !== "reject_reason");
      setPhotoDetails(temp);
    }
  }, [details.status]);

  const orderedDetails = reorderKeys(details, photoDetails);
  const [reason, setReason] = React.useState<string>("");
  const optionalKeys: (keyof SelfieDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof SelfieDetail));
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  const validationSchemaObj: Partial<Record<keyof SelfieDetail, Yup.AnySchema>> = {};
  const [updateSelfieDetails] = useUpdateSelfieDetailsMutation();
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof SelfieDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });

  const formik = useFormik({
    initialValues: { ...orderedDetails, reason },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
    },
    enableReinitialize: true,
  });
  async function handleSubmit() {
    const { status, reason } = formik.values;
    try {
      const response = await updateSelfieDetails({
        client_id,
        status: +status,
        reject_reason: reason,
      }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      handleError(error);
    }
    handleClose();
  }
  React.useEffect(() => {
    if (formik.values.status === "3") setOpen(true);
    else setOpen(false);
  }, [formik.initialValues.status, formik.touched.status, formik.values.status]);

  React.useEffect(() => {
    if (formik.values.status === "2") {
      handleSubmit();
    }
  }, [formik.initialValues.status, formik.touched.status, formik.values.status]);

  React.useEffect(() => {
    if (!open) {
      formik.setFieldValue("status", formik.initialValues.status);
    }
  }, [open]);

  return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        {Object.keys(formik.values).map((key) =>
          optionalKeys.some((_key) => _key === key) ? (
            <SelectField
              // value={formik.values.gender}
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof SelfieDetail]}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.some((_key) => _key === key) ? (
            <Status name={key} />
          ) : (
            key !== "reason" &&
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
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "min(100%, 450px)",
            },
          }}
        >
          <DialogTitle>
            <Typography variant="subtitle1">
              {formik.values.status === "3"
                ? "Selfie Details Rejection"
                : "Selfie Details Verification"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack alignItems="start" sx={{ width: "100%" }}>
              {formik.values.status === "3" ? (
                <ReasonField
                  rejectionTemplates={rejectionTemplates}
                  name="reason"
                  text="Reject reason"
                  type="text"
                  disabled={false}
                />
              ) : (
                <Stack>
                  <Typography>Are you sure want update the status?</Typography>
                </Stack>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={formik.values.status === "3" ? !formik.values.reason : false}
            >
              {formik.isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormikProvider>
  );
};

export default PhotoTabForm;
