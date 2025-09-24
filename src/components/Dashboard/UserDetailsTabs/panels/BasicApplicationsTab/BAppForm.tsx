import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import TextInputField from "@components/common/TextInputField";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, Button, capitalize, CircularProgress, Typography } from "@mui/material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { useUpdatePanDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { BasicDetail, orderedBasicDetails, RejectionTemplate } from "types/ekyc";
import * as Yup from "yup";

const options = [
  {
    value: "male",
    label: "MALE",
  },
  {
    value: "female",
    label: "FEMALE",
  },
  {
    value: "other",
    label: "OTHER",
  },
];

interface Props {
  details: BasicDetail;
  onDrop: DropzoneProps["onDrop"];
  enums: {
    [key in keyof BasicDetail]: Option[];
  };
  client_id: string;
  rejectionTemplates?: RejectionTemplate[];
}

const fileKeys: (keyof BasicDetail)[] = ["uploaded_image_urls"];
const dateKeys: (keyof BasicDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof BasicDetail)[] = ["status"];

const BAppForm = ({ details, enums, onDrop, client_id, rejectionTemplates }: Props) => {
  const [basicDetails, setBasicDetails] = React.useState<(keyof BasicDetail)[]>();
  React.useEffect(() => {
    if (details.status === 3) {
      orderedBasicDetails.splice(orderedBasicDetails.length - 1, 0, "reject_reason");
      setBasicDetails(orderedBasicDetails);
    } else {
      const temp = orderedBasicDetails.filter((f) => f !== "reject_reason");
      setBasicDetails(temp);
    }
  }, [details.status]);

  const orderedDetails = reorderKeys(details, basicDetails);
  const [reason, setReason] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  const optionalKeys: (keyof BasicDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof BasicDetail));
  const validationSchemaObj: Partial<Record<keyof BasicDetail, Yup.AnySchema>> = {};
  const [updatePanDetails] = useUpdatePanDetailsMutation();
  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof BasicDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });

  const formik = useFormik({
    initialValues: {
      ...orderedDetails,
      reason,
    },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
      pan_number: Yup.string()
        .required("PAN is required")
        .min(10, "PAN must be 10 digits")
        .max(10, "PAN must be 10 digits"),
      is_verified: Yup.bool().typeError("This must be true or false"),
      mother_name: Yup.string().matches(
        /^[a-zA-Z\s]+$/,
        "Mother name should only contain alphabetic characters"
      ),
      father_name: Yup.string().matches(
        /^[a-zA-Z\s]+$/,
        "Father name should only contain alphabetic characters"
      ),
    }) as Yup.SchemaOf<Partial<BasicDetail>>,
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        const response = await updatePanDetails({
          client_id,
          father_name: values.father_name,
          mother_name: values.mother_name,
          status: +values.status,
        }).unwrap();
        toast.success(response?.message);
      } catch (error) {
        handleError(error);
      } finally {
        helpers.setSubmitting(true);
      }
    },
    enableReinitialize: true,
  });
  async function handleSubmit() {
    const { status, reason } = formik.values;
    try {
      const response = await updatePanDetails({
        client_id: client_id,
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

  if (formik)
    return (
      <FormikProvider value={formik}>
        <Box component={Form}>
          {Object.keys(formik.values).map((key) =>
            optionalKeys.some((_key) => _key === key) ? (
              <SelectField
                key={key}
                name={key}
                label={kebabToCapitalize(key)}
                options={enums?.[key as keyof BasicDetail]}
              />
            ) : dateKeys.some((_key) => _key === key) ? (
              <MUIDateComponent key={key} name={key} label={kebabToCapitalize(key)} />
            ) : numberKeys.some((_key) => _key === key) ? (
              // <Grid container alignItems="center" sx={{ pb: 1 }}>
              //   <Box sx={{ minWidth: 160 }}>
              //     <Typography noWrap variant="subtitle2">
              //       Status
              //     </Typography>
              //   </Box>
              //   <Grid item md={8}>
              //     <RadioGroup row {...formik.getFieldProps("status")}>
              //       <FormControlLabel value="0" control={<Radio />} label="Pending" />
              //       <FormControlLabel value="1" control={<Radio />} label="Awaiting" />
              //       <FormControlLabel value="2" control={<Radio />} label="Completed" />
              //       <FormControlLabel value="3" control={<Radio />} label="Rejected" />
              //     </RadioGroup>
              //   </Grid>
              // </Grid>
              <Status name={key} disabled={true} />
            ) : (
              key !== "reason" &&
              !fileKeys.some((_key) => _key === key) && (
                <TextInputField
                  key={key}
                  name={key}
                  text={key.split("_").map(capitalize).join(" ")}
                  type="text"
                  disabled={!(key === "father_name" || key === "mother_name")}
                />
              )
            )
          )}
          <Button
            disabled={formik.isSubmitting || !formik.isValid}
            variant="contained"
            type="submit"
            sx={{ my: 2 }}
          >
            {formik.isSubmitting ? <CircularProgress size={20} /> : "Update"}
          </Button>
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
                  ? "Basic Application Details Rejection"
                  : "Basic Application Details Verification"}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Stack alignItems="start" sx={{ width: "100%" }}>
                {formik.values.status === "3" ? (
                  <ReasonField
                    name="reason"
                    text="Reject reason"
                    type="text"
                    disabled={false}
                    rejectionTemplates={rejectionTemplates}
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
  else return <></>;
};

export default BAppForm;

// const [yupValidation, setYupValidation] = useState<Record<string, string>[]>([]);
// const yupValidation: {
//   key: string;
//   value: RequiredStringSchema<string | undefined, AnyObject>;
// }[] = [];
// const validationKeys: (keyof PanDetail)[] = ["pan_number"];
// Object.keys(details).map(
//   (key) =>
//     !validationKeys.some((_key) => _key === key) &&
//     yupValidation.push({
//       key: key,
//       value: Yup.string().required(`${key.split("_").map(capitalize).join(" ")} is required`),
//     })
// );

// take all enums from API
// const enums: Partial<Record<keyof PanDetail, Option[]>> = {
//   gender: [
//     { label: "Male", key: "male" },
//     { label: "Female", key: "female" },
//     { label: "Other", key: "other" },
//   ],
//   // this is a workaround, take the options from API
//   status: Object.keys(KYCStatus)
//     .filter((v) => !Number.isNaN(+v))
//     .map((key) => ({
//       label: KYCStatus[key as any],
//       key,
//     })),
// };
