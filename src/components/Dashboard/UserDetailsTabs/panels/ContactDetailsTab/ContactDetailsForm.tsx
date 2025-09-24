import FullwidthInputField from "@components/common/FullwidthInputField";
import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import {
  Button,
  capitalize,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useUpdateUserDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { ContactDetail, orderedContactDetails, RejectionTemplate } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";
interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: ContactDetail;
  client_id: string;
  enums?: {
    [key in keyof ContactDetail]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
}

const fileKeys: (keyof ContactDetail)[] = [];
const dateKeys: (keyof ContactDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof ContactDetail)[] = ["status"];
const fullWidthKeys: (keyof ContactDetail)[] = ["address_1", "address_2", "address_3"];
const ContactDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
  const [contactDetails, setContactDetails] = React.useState<(keyof ContactDetail)[]>();

  React.useEffect(() => {
    if (details.is_kra_verified) {
      orderedContactDetails.splice(
        orderedContactDetails.length - 3,
        0,
        "address_1",
        "address_2",
        "address_3"
      );
    } else {
      orderedContactDetails.splice(orderedContactDetails.length - 3, 0, "address_1");
    }
    if (details.status === 3) {
      orderedContactDetails.splice(orderedContactDetails.length - 1, 0, "reject_reason");
      setContactDetails(orderedContactDetails);
    } else {
      const temp = orderedContactDetails.filter((f) => f !== "reject_reason");
      setContactDetails(temp);
    }
  }, [details.status]);

  const orderedDetails = reorderKeys(details, contactDetails);
  const optionalKeys: (keyof ContactDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof ContactDetail));
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  const [updateUser] = useUpdateUserDetailsMutation();
  const [reason, setReason] = React.useState("");

  const validationSchemaObj: Partial<Record<keyof ContactDetail, Yup.AnySchema>> = {};

  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof ContactDetail] = Yup.string().required(
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
      const response = await updateUser({
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
  const isVerified = details.is_verified;
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
              // value={formik.values.}
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof ContactDetail]}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.some((_key) => _key === key) ? (
            <Status name={key} disabled={isVerified} />
          ) : fullWidthKeys.some((_key) => _key === key) ? (
            <FullwidthInputField
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
            />
          ) : key !== "reason" &&
            !fileKeys.some((_key) => _key === key) &&
            key === "id_proof_number" ? (
            <InputField
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
              disabled={details?.is_kra_verified === true ? false : true}
              client_id={client_id}
            />
          ) : (
            key !== "reason" && (
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
                ? "Contact Details Rejection"
                : "Contact Details Verification"}
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

export default ContactDetailsForm;
