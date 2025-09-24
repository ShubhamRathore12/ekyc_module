import MUIDateComponent from "@components/common/MUIDateComponent";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import {
  Box,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import * as Yup from "yup";

// import { education, occupation } from "components/common/lib";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import UpdateRejectReason from "@components/common/UpdateRejectReason";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import handleError from "@utils/handleError";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import { toast } from "react-hot-toast";
import {
  useUpdatePersonalDetailsMutation,
  useUpdateSignatureDetailsMutation,
} from "services/ekyc.service";
import { Option } from "types/app";
import {
  orderedOtherDetails,
  PersonalDetail,
  RejectionTemplate,
  SignatureDetail,
} from "types/ekyc";
import { default as InputField } from "../../../../common/InputField";
interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: PersonalDetail;
  signatureDetails: SignatureDetail | undefined;
  client_id: string;
  optionsEnums: {
    [key in keyof PersonalDetail]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
}

const fileKeys: (keyof PersonalDetail)[] = [];
const dateKeys: (keyof PersonalDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof PersonalDetail)[] = ["status"];
const OtherDetailsForm = ({
  onDrop,
  details,
  client_id,
  optionsEnums,
  signatureDetails,
  rejectionTemplates,
}: Props) => {
  // const { data: enums } = useGetPersonalDetailsEnums();
  const orderedDetails = reorderKeys(details, orderedOtherDetails);

  const optionalKeys: (keyof PersonalDetail)[] = ["occupation", "marital_status"];
  optionsEnums &&
    Object.keys(optionsEnums).map((key) => optionalKeys.push(key as keyof PersonalDetail));

  const [updatePersonalDetails] = useUpdatePersonalDetailsMutation();
  const [updateSignatureDetails] = useUpdateSignatureDetailsMutation();
  const validationSchemaObj: Partial<Record<keyof PersonalDetail, Yup.AnySchema>> = {};
  const [otherReason, setOtherReason] = React.useState<string>("");
  const [signatureReason, setSignatureReason] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [sigOpen, setSigOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function handleSigOpen() {
    setSigOpen(true);
  }
  function handleSigClose() {
    setSigOpen(false);
  }
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof PersonalDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });
  const formik = useFormik({
    initialValues: {
      signatureStatus: signatureDetails?.status,
      ...orderedDetails,
      otherReason,
      signatureReason: signatureDetails?.reject_reason,
    },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
    },
    enableReinitialize: true,
  });
  async function handlePersonalDetailsUpdation() {
    const { status, otherReason } = formik.values;
    try {
      const response = await updatePersonalDetails({
        status: +status,
        client_id,
        reject_reason: otherReason,
      }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      handleError(error);
    }
    handleClose();
  }
  async function handleSignatureDetailsUpdation() {
    const { signatureStatus, signatureReason } = formik.values;
    try {
      const response = await updateSignatureDetails({
        status: +signatureStatus,
        client_id,
        reject_reason: signatureReason,
      }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      handleError(error);
    }
    handleSigClose();
  }
  React.useEffect(() => {
    if (formik.values.status === "3") setOpen(true);
    else setOpen(false);
  }, [formik.initialValues.status, formik.values.status]);

  React.useEffect(() => {
    if (formik.values.status === "2") {
      handlePersonalDetailsUpdation();
    }
  }, [formik.initialValues.status, formik.touched.status, formik.values.status]);

  React.useEffect(() => {
    if (formik.values.signatureStatus === "3") setSigOpen(true);
    else setSigOpen(false);
  }, [formik.initialValues.signatureStatus, formik.values.signatureStatus]);

  React.useEffect(() => {
    if (formik.values.signatureStatus === "2") {
      handleSignatureDetailsUpdation();
    }
  }, [formik.initialValues.signatureStatus, formik.values.signatureStatus]);

  React.useEffect(() => {
    if (formik.initialValues.signatureStatus !== formik.values.signatureStatus) {
      formik.setFieldValue("status", formik.initialValues.status);
    }
  }, [formik.initialValues.signatureStatus]);

  React.useEffect(() => {
    if (formik.initialValues.status !== formik.values.status) {
      formik.setFieldValue("status", formik.initialValues.signatureStatus);
    }
  }, [formik.initialValues.status]);

  React.useEffect(() => {
    if (!sigOpen) {
      formik.setFieldValue("signatureStatus", formik.initialValues.signatureStatus);
    }
  }, [sigOpen]);

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
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={optionsEnums?.[key as keyof PersonalDetail]}
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
            key !== "signatureStatus" &&
            key !== "otherReason" &&
            key !== "signatureReason" &&
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
        {/* <DropZone onDrop={onDrop} /> */}

        {signatureDetails && (
          <Stack sx={{ mt: 4, ml: -2 }} gap={2}>
            <Typography variant="h6">Signature Details</Typography>
            <Box sx={{ pl: 2 }}>
              {signatureDetails.status === 3 && (
                <UpdateRejectReason
                  name="signatureReason"
                  text="Reject Reason"
                  type="text"
                  handleOpen={() => {
                    formik.setFieldValue("signatureStatus", "3");
                  }}
                />
              )}
              <Status name="signatureStatus" />
            </Box>
          </Stack>
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
                ? "Other Details Rejection"
                : "Other Details Verification"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack alignItems="start" sx={{ width: "100%" }}>
              {formik.values.status === "3" ? (
                <ReasonField
                  rejectionTemplates={rejectionTemplates}
                  name="otherReason"
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
            <Button
              onClick={() => {
                handleClose();
              }}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handlePersonalDetailsUpdation();
              }}
              color="primary"
              variant="contained"
              disabled={formik.values.status === "3" ? !formik.values.otherReason : false}
            >
              {formik.isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={sigOpen}
          onClose={handleSigClose}
          PaperProps={{
            sx: {
              width: "min(100%, 450px)",
            },
          }}
        >
          <DialogTitle>
            <Typography variant="subtitle1">
              {formik.values.status === "3" || formik.values.signatureStatus === "3"
                ? "Signature Details Rejection"
                : "Signature Details Verification"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack alignItems="start" sx={{ width: "100%" }}>
              {formik.values.signatureStatus === "3" ? (
                <ReasonField
                  rejectionTemplates={rejectionTemplates}
                  name="signatureReason"
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
            <Button
              onClick={() => {
                handleSigClose();
              }}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSignatureDetailsUpdation();
              }}
              color="primary"
              variant="contained"
              disabled={
                formik.values.signatureStatus === "3" ? !formik.values.signatureReason : false
              }
            >
              {formik.isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormikProvider>
  );
};

export default OtherDetailsForm;
