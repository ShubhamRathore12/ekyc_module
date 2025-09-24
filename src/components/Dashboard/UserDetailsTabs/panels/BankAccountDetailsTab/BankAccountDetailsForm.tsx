import EditableField from "@components/common/EditableField";
import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import UpdateRejectReason from "@components/common/UpdateRejectReason";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import {
  Box,
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
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdateBankDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { BankDetail, orderedBankDetails, RejectionTemplate } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";
const AOC_Scheme_options = [
  {
    value: "all segments",
    lable: "All Segments",
  },
  {
    value: "promotional scheme - free account",
    lable: "Promotional Segment Only",
  },
  {
    value: "equity segment only",
    lable: "Equity Segment only",
  },
  {
    value: "aoc free brokerage plan with 1000/- benefit 1500/-",
    lable: "AOC FREE BROKERAGE PLAN WITH 1000/- BENEFIT 1500/-",
  },
  {
    value: "aoc free with brok plan 5000/- benefit 7500/-",
    lable: "AOC FREE WITH BROK PLAN 5000/- BENEFIT 7500/-",
  },
  {
    value: "vasp plan 500/- benefit 750/-",
    label: "VASP PLAN 500/- BENEFIT 750/-",
  },
];
interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: BankDetail;
  client_id: string;
  enums: {
    [key in keyof BankDetail]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
  refetch?:()=> void;
}

const fileKeys: (keyof BankDetail)[] = ["uploaded_image_urls"];
const updateKeys: (keyof BankDetail)[] = ["micr"];
const dateKeys: (keyof BankDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof BankDetail)[] = ["status"];

const BankAccountDetailsForm = ({
  details,
  onDrop,
  client_id,
  enums,
  rejectionTemplates,
  refetch
}: Props) => {
  const [bankDetails, setBankDetails] = React.useState<(keyof BankDetail)[]>();
  React.useEffect(() => {
    if (details.status === 3) {
      orderedBankDetails.splice(orderedBankDetails.length - 1, 0, "reject_reason");
      setBankDetails(orderedBankDetails);
    } else {
      const temp = orderedBankDetails.filter((f) => f !== "reject_reason");
      setBankDetails(temp);
    }
  }, [details.status]);

  const orderedDetails = reorderKeys(details, bankDetails);

  const optionalKeys: (keyof BankDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof BankDetail));
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  const [updateBankDetails] = useUpdateBankDetailsMutation();
  const [reason, setReason] = React.useState<string>("");

  const validationSchemaObj: Partial<Record<keyof BankDetail, Yup.AnySchema>> = {};

  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof BankDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });

  // Add specific validation for MICR field
  validationSchemaObj.micr = Yup.string()
    .required("MICR is required and cannot be blank")
    .matches(/^[a-zA-Z0-9]{9}$/, "MICR must be exactly 9 alphanumeric characters");

  const formik = useFormik({
    initialValues: {
      // aoc_scheme: "",
      ...orderedDetails,
      // micr:"123321",
      reason,
    },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
    },
    enableReinitialize: true,
  });
  async function handleSubmit() {
    const { status, reason, micr } = formik.values;
    
    // Check if MICR is blank before submission
    if (!micr || micr.trim() === "") {
      toast.error("MICR is required and cannot be blank. Please fill in the MICR field before proceeding.");
      return;
    }
    
    formik.setSubmitting(true);
    try {
      const response = await updateBankDetails({
        client_id,
        status: +status,
        reject_reason: reason,
      }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      handleError(error);
    } finally {
      formik.setSubmitting(false);
    }
    handleClose();
  }
  React.useEffect(() => {
    if (formik.values.status === "3") setOpen(true);
    else setOpen(false);
  }, [formik.initialValues.status, formik.values.status]);

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
        {/* <DynamicField>
          <LabelContainer>
            <Typography noWrap>AOC Scheme</Typography>
          </LabelContainer>
          <FieldContainer>
            <TextField
              select
              sx={{
                width: "100%",
                pb: 2,
                "& .MuiInputBase-input": {
                  bgcolor: "hsla(0, 0%, 98%, 1)",
                },
              }}
              name="aoc_scheme"
              value={formik.values.aoc_scheme}
              onChange={(e) => {
                formik.setFieldValue("aoc_scheme", e.target.value);
              }}
            >
              <MenuItem key=" " disabled>
                Plese select
              </MenuItem>
              {AOC_Scheme_options.map((option) => {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </TextField>
          </FieldContainer>
        </DynamicField> */}
        {Object.keys(formik.values).map((key) =>
          optionalKeys.some((_key) => _key === key) ? (
            <SelectField
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof BankDetail]}
            />
          ) : key !== "reason" && key === "micr" ? (
            <EditableField
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
              disabled={false}
              client_id={client_id}
              required={true}
              refetch={refetch}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.some((_key) => _key === key) ? (
            <Status name={key} />
          ) : key !== "reason" &&
            !fileKeys.some((_key) => _key === key) &&
            key === "reject_reason" ? (
            <UpdateRejectReason
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
              handleOpen={() => {
                formik.setFieldValue("status", "3");
                handleOpen();
              }}
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
        {/* <Typography
          variant="subtitle2"
          sx={{
            color: "primary.main",
          }}
        >
          In Case of Document Upload
        </Typography>
        <TypeOfDocument name="type_of_document" />

        <DropZone onDrop={onDrop} /> */}
        {/* <Button
          sx={{ mt: 4 }}
          type="submit"
          variant="contained"
          size="large"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress /> : "Save and Continue"}
        </Button> */}
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
                ? "Bank Account Details Rejection"
                : "Bank Account Details Verification"}
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

export default BankAccountDetailsForm;