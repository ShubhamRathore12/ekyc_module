import InputField from "@components/common/InputField";
import MUIDateComponent from "@components/common/MUIDateComponent";
import Status from "@components/common/Status";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useUpdateSegmentImageMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { orderedSegmentDetails, SegmentDetail } from "types/ekyc";
import * as Yup from "yup";

interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: SegmentDetail;
  enums?: {
    [key in keyof SegmentDetail]: Option[];
  };
  client_id: string;
}

const fileKeys: (keyof SegmentDetail)[] = ["uploaded_image_urls"];
const dateKeys: (keyof SegmentDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof SegmentDetail)[] = ["status"];
const DerivateDetailsTabForm = (props: Props) => {
  const { onDrop, details, enums } = props;

  const [segmentDetails, setSegmentDetails] = React.useState<(keyof SegmentDetail)[]>();

  const [remarks, setRemarks] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (details.status === 3) {
      orderedSegmentDetails.splice(orderedSegmentDetails.length - 1, 0, "reject_reason");
      setSegmentDetails(orderedSegmentDetails);
    } else {
      const temp = orderedSegmentDetails.filter((f) => f !== "reject_reason");
      setSegmentDetails(temp);
    }
  }, [details.status]);

  const optionalKeys: (keyof SegmentDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof SegmentDetail));
  const orderedDetails = reorderKeys(details, segmentDetails);

  const validationSchemaObj: Partial<Record<keyof SegmentDetail, Yup.AnySchema>> = {};

  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  const formik = useFormik({
    initialValues: {
      // aoc_scheme: "",
      ...orderedDetails,
      // reason,
    },
    validationSchema: Yup.object().shape({
      ...validationSchemaObj,
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
    },
    enableReinitialize: true,
  });

  const [updateSegmentImage] = useUpdateSegmentImageMutation();

  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        {Object.keys(formik.values).map((key) =>
          optionalKeys.length > 0 && optionalKeys.some((_key) => _key === key) ? (
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
        {details?.uploaded_image_urls.length > 0 && (
          <Button
            variant="contained"
            color="error"
            sx={{
              "&:hover": {
                bgcolor: "error.main",
              },
            }}
            onClick={handleOpen}
          >
            Delete Document
          </Button>
        )}
        {/* <Status name="status" /> */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Derivate Document</DialogTitle>
          <DialogContent>
            <Stack gap={2}>
              <Typography variant="body1">Are you sure want to delete the document?</Typography>
              <TextField
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                label="Please enter remarks"
                rows={5}
                multiline
              />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              px: 2,
              pb: 2,
            }}
          >
            <Button variant="contained" onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!remarks}
              onClick={async () => {
                setIsDeleting(true);
                try {
                  const response = await updateSegmentImage({
                    action: "delete",
                    client_id: details?.client_id,
                    image: details.uploaded_image_urls[0],
                    remarks: remarks,
                  }).unwrap();
                  toast.success(response?.message);
                  handleClose();
                } catch (error) {
                  handleError(error);
                } finally {
                  setIsDeleting(false);
                }
              }}
              color="error"
              sx={{
                "&:hover": {
                  bgcolor: "error.main",
                },
              }}
            >
              {isDeleting ? <CircularProgress /> : " Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormikProvider>
  );
};

export default DerivateDetailsTabForm;
