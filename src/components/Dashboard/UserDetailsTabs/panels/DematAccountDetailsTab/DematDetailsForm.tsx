// import FullwidthInputField from "@components/common/FullwidthInputField";
// import MUIDateComponent from "@components/common/MUIDateComponent";
// import ReasonField from "@components/common/ReasonFiled";
// import Status from "@components/common/Status";
// import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
// import {
//   Button,
//   capitalize,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
// } from "@mui/material";
// import Stack from "@mui/material/Stack";
// import { Box } from "@mui/system";
// import handleError from "@utils/handleError";
// import kebabToCapitalize from "@utils/kebabToCapitalize";
// import { reorderKeys } from "@utils/reorderKeys";
// import { Form, FormikProvider, useFormik } from "formik";
// import React from "react";
// import { DropzoneProps } from "react-dropzone";
// import { toast } from "react-hot-toast";
// import { useUpdateUserDetailsDematMutation, useUpdateUserDetailsMutation } from "services/ekyc.service";
// import { Option } from "types/app";
// import { RejectionTemplate } from "types/ekyc";
// import * as Yup from "yup";
// import InputField from "../../../../common/InputField";
// import { DematAccountDetail } from "types/admin";
// import { downloadFiles } from "@utils/downloadFiles";

// interface Props {
//   onDrop: DropzoneProps["onDrop"];
//   details: DematAccountDetail;
//   client_id: string;
//   enums?: {
//     [key in keyof DematAccountDetail]: Option[];
//   };
//   rejectionTemplates: RejectionTemplate[];
// }

// const fileKeys: (keyof DematAccountDetail)[] = ["s3url"];
// const dateKeys: (keyof DematAccountDetail)[] = ["created_at", "updated_at"];
// const numberKeys: (keyof DematAccountDetail)[] = ["status"];
// const fullWidthKeys: (keyof DematAccountDetail)[] = [];
// const booleanKeys: (keyof DematAccountDetail)[] = [
//   "is_all_segments_active",
//   "cash_mutual_fund",
//   "future_options",
//   "debit",
//   "commodity_derivatives",
//   "currency",
//   "slbm",
//   "is_existing_dp_account",
//   "dp_id"
// ];

// // Define ordered fields for demat account details
// const orderedDematAccountDetails: (keyof DematAccountDetail)[] = [
//   "dpid",
//     "dp_id",
//   "demat_account_type",
//   "is_all_segments_active",
//   "cash_mutual_fund",
//   "future_options",
//   "debit",
//   "commodity_derivatives",
//   "currency",
//   "slbm",
//   "is_existing_dp_account",
//   "status",

// ];

// const DematDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
//   const [dematAccountDetails, setDematAccountDetails] = React.useState<(keyof DematAccountDetail)[]>(orderedDematAccountDetails);
//   const [currentStatus, setCurrentStatus] = React.useState<number>(details.status);

//   React.useEffect(() => {
//     if (details.status === 3) {
//       const updatedDetails = [...orderedDematAccountDetails];
//       if (!updatedDetails.includes("reject_reason" as keyof DematAccountDetail)) {
//         updatedDetails.splice(updatedDetails.length - 1, 0, "reject_reason" as keyof DematAccountDetail);
//       }
//       setDematAccountDetails(updatedDetails);
//     } else {
//       const temp = orderedDematAccountDetails.filter((f) => f !== "reject_reason" as keyof DematAccountDetail);
//       setDematAccountDetails(temp);
//     }
//   }, [details.status]);

//   // Update currentStatus when details.status changes (e.g., when switching tabs)
//   React.useEffect(() => {
//     setCurrentStatus(details.status);
//   }, [details.status]);

//   const orderedDetails = reorderKeys(details, dematAccountDetails);
//   const optionalKeys: (keyof DematAccountDetail)[] = [];
//   enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof DematAccountDetail));
  
//   const [open, setOpen] = React.useState(false);
//   const [showPdf, setShowPdf] = React.useState(false);
  
//   function handleOpen() {
//     setOpen(true);
//   }
  
//   function handleClose() {
//     setOpen(false);
//   }
//   const [updateUser, refetch] = useUpdateUserDetailsDematMutation();
//   const [reason, setReason] = React.useState("");

//   // Check if PDF should be shown
//   React.useEffect(() => {
//     if (details.s3url && details.is_existing_dp_account === true) {
//       setShowPdf(true);
//     } else {
//       setShowPdf(false);
//     }
//   }, [details.s3url, details.is_existing_dp_account]);

//   const validationSchemaObj: Partial<Record<keyof DematAccountDetail, Yup.AnySchema>> = {};

//   dateKeys.forEach((key) => {
//     validationSchemaObj[key] = Yup.date();
//   });
  
//   booleanKeys.forEach((key) => {
//     validationSchemaObj[key] = Yup.boolean();
//   });
  
//   optionalKeys.forEach((key) => {
//     validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
//   });

//   Object.keys(orderedDetails).forEach((key) => {
//     if (!dateKeys.some((_key) => _key === key) && !booleanKeys.some((_key) => _key === key)) {
//       if (!optionalKeys.some((_key) => _key === key)) {
//         validationSchemaObj[key as keyof DematAccountDetail] = Yup.string().required(
//           `${kebabToCapitalize(key)} is required`
//         );
//       }
//     }
//   });

//   // Helper function to format boolean values for display
//   const formatBooleanValue = (value: any) => {
//     if (value === null || value === undefined) return "N/A";
//     return String(value);
//   };
  
//   const formik = useFormik({
//     initialValues: { 
//       ...orderedDetails, 
//       reason,
//       // Ensure boolean values are properly formatted
//       ...Object.keys(orderedDetails).reduce((acc, key) => {
//         if (booleanKeys.includes(key as keyof DematAccountDetail)) {
//           acc[key] = formatBooleanValue(orderedDetails[key as keyof typeof orderedDetails]);
//         } else {
//           acc[key] = orderedDetails[key as keyof typeof orderedDetails];
//         }
//         return acc;
//       }, {} as any)
//     },
//     validationSchema: Yup.object().shape({
//       ...validationSchemaObj,
//     }),
//     onSubmit: async (values, helpers) => {
//       helpers.setSubmitting(true);
//     },
//     enableReinitialize: true,
//   });
  
//   async function handleSubmit() {
//     const { status, reason } = formik.values;
//     try {
//       const response = await updateUser({
//         client_id,
//         status: +status,
//         reject_reason: reason,
//       }).unwrap();
      
//       toast.success(response?.message || "Demat account status updated successfully");
      
//       // Update the current status after successful submission
//       setCurrentStatus(+status);
   
//     } catch (error) {
//       handleError(error);
//     }
//     handleClose();
//   }
  
  
//   // Modified: Allow status changes even after rejection/approval
//   // Only disable if currently processing (you can add loading state if needed)
//   const isStatusDisabled = false; // Allow changes always
  
//   React.useEffect(() => {
//     if (formik.values.status === "3") setOpen(true);
//     else setOpen(false);
//   }, [formik.values.status]);

//   React.useEffect(() => {
//     if (formik.values.status === "2" && formik.values.status !== String(currentStatus)) {
//       handleSubmit();
//     }
//   }, [formik.values.status, currentStatus]);

//   // Modified: Don't reset status when dialog closes
//   React.useEffect(() => {
//     if (!open && formik.values.status === "3" && !formik.values.reason) {
//       // Only reset if rejection was not completed (no reason provided)
//       formik.setFieldValue("status", String(currentStatus));
//     }
//   }, [open, currentStatus]);

//   return (
//     <FormikProvider value={formik}>
//       <Box component={Form}>
//         {Object.keys(formik.values).map((key) => {
//           // Skip S3Url in the form display
//           if (key === "s3url") return null;
          
//           return optionalKeys.some((_key) => _key === key) ? (
//             <SelectField
//               key={key}
//               name={key}
//               label={key.split("_").map(capitalize).join(" ")}
//               options={enums?.[key as keyof DematAccountDetail]}
//             />
//           ) : dateKeys.some((_key) => _key === key) ? (
//             <MUIDateComponent
//               key={key}
//               name={key}
//               label={key.split("_").map(capitalize).join(" ")}
//             />
//           ) : numberKeys.some((_key) => _key === key) ? (
//             <Status 
//               name={key} 
//               disabled={isStatusDisabled}
//             />
//           ) : fullWidthKeys.some((_key) => _key === key) ? (
//             <FullwidthInputField
//               key={key}
//               name={key}
//               text={key.split("_").map(capitalize).join(" ")}
//               type="text"
//             />
//           ) : booleanKeys.some((_key) => _key === key) ? (
//             <InputField
//               key={key}
//               name={key}
//               text={key.split("_").map(capitalize).join(" ")}
//               type="text"
//               disabled={true}
//               // Ensure the value is properly displayed
//               // value={formatBooleanValue(formik.values[key])}
//             />
//           ) : key !== "reason" && !fileKeys.some((_key) => _key === key) ? (
//             <InputField
//               key={key}
//               name={key}
//               text={key.split("_").map(capitalize).join(" ")}
//               type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
//             />
//           ) : null
//         })}
        
//         {/* {showPdf && (
//           <Box sx={{ mt: 2 }}>
//             <Button 
//               variant="contained" 
//               color="primary" 
//               onClick={() => downloadFiles([details.S3Url])}
//             >
//               Download Demat Account Document
//             </Button>
//           </Box>
//         )} */}
        
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           PaperProps={{
//             sx: {
//               width: "min(100%, 450px)",
//             },
//           }}
//         >
//           <DialogTitle>
//             <Typography variant="subtitle1">
//               {formik.values.status === "3"
//                 ? "Demat Account Rejection"
//                 : "Demat Account Verification"}
//             </Typography>
//           </DialogTitle>
//           <DialogContent>
//             <Stack alignItems="start" sx={{ width: "100%" }}>
//               {formik.values.status === "3" ? (
//                 <ReasonField
//                   rejectionTemplates={rejectionTemplates}
//                   name="reason"
//                   text="Reject reason"
//                   type="text"
//                   disabled={false}
             
//                 />
//               ) : (
//                 <Stack>
//                   <Typography>Are you sure you want to update the status?</Typography>
//                 </Stack>
//               )}
//             </Stack>
//           </DialogContent>
//           <DialogActions sx={{ px: 3, pb: 2 }}>
//             <Button onClick={handleClose} color="primary" variant="outlined">
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               color="primary"
//               variant="contained"
//               disabled={formik.values.status === "3" ? !formik.values.reason : false}
//             >
//               {formik.isSubmitting ? <CircularProgress /> : "Submit"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </FormikProvider>
//   );
// };

// export default DematDetailsForm;


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
import { useUpdateUserDetailsDematMutation, useUpdateUserDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { RejectionTemplate } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";
import { DematAccountDetail } from "types/admin";
import { downloadFiles } from "@utils/downloadFiles";

interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: DematAccountDetail & { is_dp_account_verified?: boolean }; // Add the new field
  client_id: string;
  enums?: {
    [key in keyof DematAccountDetail]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
}

const fileKeys: (keyof DematAccountDetail)[] = ["s3url"];
const dateKeys: (keyof DematAccountDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof DematAccountDetail)[] = ["status"];
const fullWidthKeys: (keyof DematAccountDetail)[] = [];
const booleanKeys: (keyof DematAccountDetail)[] = [
  "is_all_segments_active",
  "cash_mutual_fund",
  "future_options",
  "debit",
  "commodity_derivatives",
  "currency",
  "slbm",
  "is_existing_dp_account",
  "dp_id"
];

// Define ordered fields for demat account details
const orderedDematAccountDetails: (keyof DematAccountDetail)[] = [
  "dpid",
    "dp_id",
  "demat_account_type",
  "is_all_segments_active",
  "cash_mutual_fund",
  "future_options",
  "debit",
  "commodity_derivatives",
  "currency",
  "slbm",
  "is_existing_dp_account",
  "status"  // Make sure status is included
];

const DematDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
  const [dematAccountDetails, setDematAccountDetails] = React.useState<(keyof DematAccountDetail)[]>(orderedDematAccountDetails);
  const [currentStatus, setCurrentStatus] = React.useState<number>(details.status);

  React.useEffect(() => {
    if (details.status === 3) {
      const updatedDetails = [...orderedDematAccountDetails];
      if (!updatedDetails.includes("reject_reason" as keyof DematAccountDetail)) {
        updatedDetails.splice(updatedDetails.length - 1, 0, "reject_reason" as keyof DematAccountDetail);
      }
      setDematAccountDetails(updatedDetails);
    } else {
      const temp = orderedDematAccountDetails.filter((f) => f !== "reject_reason" as keyof DematAccountDetail);
      setDematAccountDetails(temp);
    }
  }, [details.status]);

  // Update currentStatus when details.status changes (e.g., when switching tabs)
  React.useEffect(() => {
    setCurrentStatus(details.status);
  }, [details.status]);

  const orderedDetails = reorderKeys(details, dematAccountDetails);
  const optionalKeys: (keyof DematAccountDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof DematAccountDetail));
  
  const [open, setOpen] = React.useState(false);
  const [showPdf, setShowPdf] = React.useState(false);
  
  function handleOpen() {
    setOpen(true);
  }
  
  function handleClose() {
    setOpen(false);
  }
  
  const [updateUser, refetch] = useUpdateUserDetailsDematMutation();
  const [reason, setReason] = React.useState("");

  // Check if PDF should be shown
  React.useEffect(() => {
    if (details.s3url && details.is_existing_dp_account === true) {
      setShowPdf(true);
    } else {
      setShowPdf(false);
    }
  }, [details.s3url, details.is_existing_dp_account]);

  const validationSchemaObj: Partial<Record<keyof DematAccountDetail, Yup.AnySchema>> = {};

  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  
  booleanKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.boolean();
  });
  
  optionalKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
  });

  Object.keys(orderedDetails).forEach((key) => {
    if (!dateKeys.some((_key) => _key === key) && !booleanKeys.some((_key) => _key === key)) {
      if (!optionalKeys.some((_key) => _key === key)) {
        validationSchemaObj[key as keyof DematAccountDetail] = Yup.string().required(
          `${kebabToCapitalize(key)} is required`
        );
      }
    }
  });

  // Helper function to format boolean values for display
  const formatBooleanValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    return String(value);
  };
  
   const formik = useFormik({
    initialValues: { 
      ...orderedDetails, 
      reason,
      // Ensure boolean values are properly formatted
      ...Object.keys(orderedDetails).reduce((acc, key) => {
        if (booleanKeys.includes(key as keyof DematAccountDetail)) {
          acc[key] = formatBooleanValue(orderedDetails[key as keyof typeof orderedDetails]);
        } else {
          acc[key] = orderedDetails[key as keyof typeof orderedDetails];
        }
        return acc;
      }, {} as any)
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
    const { status, reason } = formik.values;
    try {
      const response = await updateUser({
        client_id,
        status: +status,
        reject_reason: reason,
      }).unwrap();
      
      toast.success(response?.message || "Demat account status updated successfully");
      
      // Update the current status after successful submission
      setCurrentStatus(+status);
      
      // Call refetch to update the data
      // await refetch();
   
    } catch (error) {
      handleError(error);
    }
    handleClose();
  }
  
  
  // Modified: Disable status changes if is_dp_account_verified is true OR if currently processing
  const isStatusDisabled = details.is_dp_account_verified === true;
  
  // Helper function to determine if a specific boolean field should be disabled
  const isBooleanFieldDisabled = (fieldName: string) => {
    return details.is_dp_account_verified === true;
  };
  
  React.useEffect(() => {
    if (formik.values.status === "3") setOpen(true);
    else setOpen(false);
  }, [formik.values.status]);

  React.useEffect(() => {
    if (formik.values.status === "2" && formik.values.status !== String(currentStatus)) {
      handleSubmit();
    }
  }, [formik.values.status, currentStatus]);

  // Modified: Don't reset status when dialog closes
  React.useEffect(() => {
    if (!open && formik.values.status === "3" && !formik.values.reason) {
      // Only reset if rejection was not completed (no reason provided)
      formik.setFieldValue("status", String(currentStatus));
    }
  }, [open, currentStatus]);

   return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        {Object.keys(formik.values).map((key) => {
          // Skip S3Url in the form display
          if (key === "s3url") return null;
          
          return optionalKeys.some((_key) => _key === key) ? (
            <SelectField
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof DematAccountDetail]}
            />
          ) : dateKeys.some((_key) => _key === key) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.some((_key) => _key === key) ? (
            <Status 
              name={key} 
              disabled={isStatusDisabled}
            />
          ) : fullWidthKeys.some((_key) => _key === key) ? (
            <FullwidthInputField
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
            />
          ) : booleanKeys.some((_key) => _key === key) ? (
            <InputField
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
              disabled={true}
              // Ensure the value is properly displayed
              // value={formatBooleanValue(formik.values[key])}
            />
          ) : key !== "reason" && !fileKeys.some((_key) => _key === key) ? (
            <InputField
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
            />
          ) : null
        })}
        
        {/* {showPdf && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => downloadFiles([details.S3Url])}
            >
              Download Demat Account Document
            </Button>
          </Box>
        )} */}
        
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
                ? "Demat Account Rejection"
                : "Demat Account Verification"}
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
                  <Typography>Are you sure you want to update the status?</Typography>
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


export default DematDetailsForm;