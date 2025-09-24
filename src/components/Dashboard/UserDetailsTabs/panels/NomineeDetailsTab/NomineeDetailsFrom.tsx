import FullwidthInputField from "@components/common/FullwidthInputField";
import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  capitalize,
} from "@mui/material";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdateNomineeDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { RejectionTemplate } from "types/ekyc";
import { Nominee, orderedNomineeDetails } from "types/nominee";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";

interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: Nominee;
  disabled: boolean;
  enums?: {
    [key in keyof Nominee]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
  client_id: string;
}

const fileKeys: (keyof Nominee)[] = [];
const dateKeys: (keyof Nominee)[] = ["created_at", "updated_at"];
const numberKeys: (keyof Nominee)[] = ["status"];
const fullWidthKeys: (keyof Nominee)[] = ["address_line_1", "address_line_2", "address_line_3"];

const NomineeDetailsFrom = ({
  onDrop,
  disabled,
  rejectionTemplates,
  enums,
  details,
  client_id,
}: Props) => {
  // const [isClicked, setIsClicked] = useState(false);
  // const [countNominee, setCountNominee] = useState(0);

  const [nomineeDetails, setNomineeDetails] = React.useState<(keyof Nominee)[]>();

  React.useEffect(() => {
    if (details.status === 3) {
      orderedNomineeDetails.splice(orderedNomineeDetails.length - 1, 0, "reject_reason");
      setNomineeDetails(orderedNomineeDetails);
    } else {
      const temp = orderedNomineeDetails.filter((f) => f !== "reject_reason");
      setNomineeDetails(temp);
    }
  }, [details.status]);

  const [open, setOpen] = React.useState(false);

  const [reason, setReason] = React.useState<string>("");

  const orderedDetails = reorderKeys(details, nomineeDetails);
  const optionalKeys: (keyof Nominee)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof Nominee));

  const validationSchemaObj: Partial<Record<keyof Nominee, Yup.AnySchema>> = {};
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  // optionalKeys.forEach((key) => {
  //   validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  // });

  const [updateNominee] = useUpdateNomineeDetailsMutation();

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof Nominee] = Yup.string().required(
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

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    const { status, reason } = formik.values;
    try {
      const response = await updateNominee({
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
              options={enums?.[key as keyof Nominee]}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.some((_key) => _key === key) ? (
            <Status name={key} disabled={disabled} />
          ) : fullWidthKeys.some((_key) => _key === key) ? (
            <FullwidthInputField
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
            />
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
      </Box>
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
              ? "Nominee Details Rejection"
              : "Nominee Details Verification"}
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
    </FormikProvider>
  );
};

export default NomineeDetailsFrom;
