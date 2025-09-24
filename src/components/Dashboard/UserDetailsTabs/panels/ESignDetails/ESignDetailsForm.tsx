// // import MUIDateComponent from "@components/common/MUIDateComponent";
// // import ReasonField from "@components/common/ReasonFiled";
// // import Status from "@components/common/Status";
// // import UpdateRejectReason from "@components/common/UpdateRejectReason";
// // import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
// // import { DownloadOutlined } from "@mui/icons-material";
// // import {
// //   Button,
// //   capitalize,
// //   CircularProgress,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   Table,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Typography,
// // } from "@mui/material";
// // import Stack from "@mui/material/Stack";
// // import { Box } from "@mui/system";
// // import { downloadFiles } from "@utils/downloadFiles";
// // import handleError from "@utils/handleError";
// // import kebabToCapitalize from "@utils/kebabToCapitalize";
// // import { reorderKeys } from "@utils/reorderKeys";
// // import { Form, FormikProvider, useFormik } from "formik";
// // import { useRouter } from "next/router";
// // import React from "react";
// // import { DropzoneProps } from "react-dropzone";
// // import { toast } from "react-hot-toast";
// // import { useGetAllEkycStatusQuery, useUpdateESignDetailsMutation } from "services/ekyc.service";
// // import { Option } from "types/app";
// // import { ESignDetail, orderedESignDetails, RejectionTemplate } from "types/ekyc";
// // import * as Yup from "yup";
// // import InputField from "../../../../common/InputField";
// // interface Props {
// //   onDrop: DropzoneProps["onDrop"];
// //   details: ESignDetail;
// //   client_id: string;
// //   enums?: {
// //     [key in keyof ESignDetail]: Option[];
// //   };
// //   rejectionTemplates: RejectionTemplate[];
// // }

// // const fileKeys: (keyof ESignDetail)[] = [];
// // const dateKeys: (keyof ESignDetail)[] = ["created_at", "updated_at"];
// // const numberKeys: (keyof ESignDetail)[] = ["status"];
// // const ESignDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
// //   const [esignDetails, setESignDetails] = React.useState<(keyof ESignDetail)[]>();
// //   React.useEffect(() => {
// //     if (details.status === 3) {
// //       orderedESignDetails.splice(orderedESignDetails.length - 1, 0, "reject_reason");
// //       setESignDetails(orderedESignDetails);
// //     } else {
// //       const temp = orderedESignDetails.filter((f) => f !== "reject_reason");
// //       setESignDetails(temp);
// //     }
// //   }, [details.status]);

// //   const router = useRouter();

// // const { product } = router.query;

// //   const orderedDetails = reorderKeys(details, esignDetails);

// //   const optionalKeys: (keyof ESignDetail)[] = [];
// //   enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof ESignDetail));

// //   const { data, isError, isLoading } = useGetAllEkycStatusQuery(
// //     { client_id: client_id as string },
// //     { skip: !client_id }
// //   );

// //   // const [updateUser] = useUpdateESignDetailsMutation();
// //   const [updateESignDetails] = useUpdateESignDetailsMutation();
// //   const [reason, setReason] = React.useState<string>("");
// //   const [open, setOpen] = React.useState(false);
// //   const [isSubmitting, setIsSubmitting] = React.useState(false);
// //   function handleOpen() {
// //     setOpen(true);
// //   }
// //   function handleClose() {
// //     setOpen(false);
// //   }
// //   const validationSchemaObj: Partial<Record<keyof ESignDetail, Yup.AnySchema>> = {};

// //   dateKeys.forEach((key) => {
// //     validationSchemaObj[key] = Yup.date();
// //   });
// //   optionalKeys.forEach((key) => {
// //     validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
// //   });

// //   Object.keys(orderedDetails).forEach((key) => {
// //     if (!dateKeys.some((_key) => _key === key)) {
// //       if (!optionalKeys.some((_key) => _key === key)) {
// //         validationSchemaObj[key as keyof ESignDetail] = Yup.string().required(
// //           `${kebabToCapitalize(key)} is required`
// //         );
// //       }
// //     }
// //   });
// //   const formik = useFormik({
// //     initialValues: { ...orderedDetails, reason },
// //     validationSchema: Yup.object().shape({
// //       ...validationSchemaObj,
// //     }),
// //     onSubmit: async (values, helpers) => {
// //       helpers.setSubmitting(true);
// //       // try {
// //       //   const response = await updateUser({ ...values, client_id }).unwrap();
// //       //   toast.success(response?.message);
// //       // } catch (error) {
// //       //   toast.error((error as APIError)?.error || "Something went wrong");
// //       // } finally {
// //       //   helpers.setSubmitting(false);
// //       // }
// //     },
// //     enableReinitialize: true,
// //   });
// //   async function handleSubmit() {
// //     const { status } = formik.values;
// //     setIsSubmitting(true);
// //     try {
// //       const response = await updateESignDetails({
// //         client_id: client_id,
// //         status: +status,
// //         reject_reason: formik.values.reason,
// //       }).unwrap();
// //       toast.success(response?.message);
// //       if (formik.values.status === "2" || formik.values.status === "3") {
// //         router.push("/dashboard");
// //       }
// //     } catch (error) {
// //       handleError(error);
// //     } finally {
// //       setIsSubmitting(false);
// //       handleClose();
// //     }
// //   }

// //   React.useEffect(() => {
// //     if (formik.values.status === "2" || formik.values.status === "3") handleOpen();
// //     else handleClose();
// //   }, [formik.values.status]);

// //   React.useEffect(() => {
// //     if (!open) {
// //       formik.setFieldValue("status", formik.initialValues.status);
// //     }
// //   }, [open]);

// //   const hiddenDownloadProducts = ["MFCNK", "MFDNK", "SUBNKRA","STXNKRA"];

// //   return (
// //     <FormikProvider value={formik}>
// //       <Box component={Form}>
// //         {product?.includes("MF") || product?.includes("SUB") ? null:  <> {Object.keys(formik.values).map((key) =>
// //           optionalKeys.some((_key) => _key === key) ? (
// //             <SelectField
// //               // value={formik.values.}
// //               key={key}
// //               name={key}
// //               label={key.split("_").map(capitalize).join(" ")}
// //               options={enums?.[key as keyof ESignDetail]}
// //             />
// //           ) : dateKeys.some((_key) => _key === key) ? (
// //             <MUIDateComponent
// //               key={key}
// //               name={key}
// //               label={key.split("_").map(capitalize).join(" ")}
// //             />
// //           ) : numberKeys.some((_key) => _key === key) ? (
// //             <Status name={key} />
// //           ) : key !== "reason" &&
// //             !fileKeys.some((_key) => _key === key) &&
// //             key === "reject_reason" ? (
// //             <UpdateRejectReason
// //               key={key}
// //               name={key}
// //               text={key.split("_").map(capitalize).join(" ")}
// //               type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
// //               handleOpen={() => {
// //                 formik.setFieldValue("status", "3");
// //                 handleOpen();
// //               }}
// //             />
// //           ) : (
// //             key !== "reason" &&
// //             !fileKeys.some((_key) => _key === key) && (
// //               <InputField
// //                 key={key}
// //                 name={key}
// //                 text={key.split("_").map(capitalize).join(" ")}
// //                 type={numberKeys.some((_key) => _key === key) ? "number" : "text"}
// //               />
// //             )
// //           )
// //         )}</>}
       
// //         <Box sx={{ mt: 2 }}>
// //           <Stack sx={{ alignItems: "start", gap: 2 }}>
// //             <Typography variant="body1" color="initial">
// //               {product?.includes("MF") || product?.includes("SUB") ? "Download KRA Doc's here" :"Download AOF, KRA & DDPI Doc&apos;s here."}
           
// //             </Typography>
// //             {!hiddenDownloadProducts ? null    :    <Button
// //               startIcon={<DownloadOutlined />}
// //               variant="contained"
// //               onClick={async () => {
// //                 await downloadFiles([
// //                   details.esigned_pdf_url_download,
// //                   details.kra_pdf_url_download,
// //                   details.ddpi_pdf_url_download,
// //                 ]);
// //               }}
// //               sx={{ width: "150px" }}
// //               disabled={
// //                 !details.esigned_pdf_url_download &&
// //                 !details.kra_pdf_url_download &&
// //                 !details.ddpi_pdf_url_download
// //               }
// //             >
// //               Download
// //             </Button>}
        
// //           </Stack>
// //         </Box>
// //         {/* <DropZone onDrop={onDrop} /> */}
// //         {/* <Button
// //           sx={{ mt: 4 }}
// //           type="submit"
// //           variant="contained"
// //           size="large"
// //           disabled={!formik.isValid || formik.isSubmitting}
// //         >
// //           {formik.isSubmitting ? <CircularProgress /> : "Save and Continue"}
// //         </Button> */}

// //         <Dialog
// //           open={open}
// //           onClose={handleClose}
// //           PaperProps={{
// //             sx: {
// //               width: "min(100%, 450px)",
// //             },
// //           }}
// //         >
// //           <DialogTitle>
// //             <Typography variant="subtitle1">
// //               {formik.values.status === "3"
// //                 ? "ESign Details Rejection"
// //                 : "ESign Details Verification"}
// //             </Typography>
// //           </DialogTitle>
// //           <DialogContent>
// //             <Stack alignItems="start" sx={{ width: "100%" }}>
// //               {formik.values.status === "3" ? (
// //                 <ReasonField
// //                   rejectionTemplates={rejectionTemplates}
// //                   name="reason"
// //                   text="Reject reason"
// //                   type="text"
// //                   disabled={false}
// //                 />
// //               ) : (
// //                 <Stack alignItems="start" gap={2}>
// //                   {data?.data?.status && (
// //                     <TableContainer sx={{ flex: 1 }}>
// //                       <Table
// //                         sx={{
// //                           border: "1px solid",
// //                           borderColor: "divider",
// //                           minWidth: "400px",
// //                           "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
// //                             bgcolor: "divider",
// //                           },
// //                         }}
// //                       >
// //                         <TableHead>
// //                           <TableRow>
// //                             <TableCell>KYC Details</TableCell>
// //                             <TableCell align="right">Status</TableCell>
// //                           </TableRow>
// //                         </TableHead>
// //                         {Object.entries(data?.data?.status as any).map(([key, value]) => (
// //                           <TableRow key={key}>
// //                             <TableCell align="left">{kebabToCapitalize(key)}</TableCell>
// //                             <TableCell align="right">
// //                               <Typography
// //                                 color={
// //                                   value === 0 || value === 1
// //                                     ? "warning.main"
// //                                     : value === 2
// //                                     ? "success.main"
// //                                     : "error.main"
// //                                 }
// //                               >
// //                                 {value === 0 || value === 1
// //                                   ? "Pending"
// //                                   : value === 2
// //                                   ? "Verified"
// //                                   : "Rejected"}
// //                               </Typography>
// //                             </TableCell>
// //                           </TableRow>
// //                         ))}
// //                       </Table>
// //                     </TableContainer>
// //                   )}
// //                   <Typography>Are you sure want update the status?</Typography>
// //                 </Stack>
// //               )}
// //             </Stack>
// //           </DialogContent>
// //           <DialogActions sx={{ px: 3, pb: 2 }}>
// //             <Button onClick={handleClose} color="primary" variant="outlined">
// //               Cancel
// //             </Button>
// //             <Button
// //               onClick={handleSubmit}
// //               color="primary"
// //               variant="contained"
// //               disabled={
// //                 isSubmitting || formik.values.status === "3" ? !formik.values.reason : false
// //               }
// //             >
// //               {isSubmitting ? <CircularProgress /> : "Submit"}
// //             </Button>
// //           </DialogActions>
// //         </Dialog>
// //       </Box>
// //     </FormikProvider>
// //   );
// // };

// // export default ESignDetailsForm;
// import MUIDateComponent from "@components/common/MUIDateComponent";
// import ReasonField from "@components/common/ReasonFiled";
// import Status from "@components/common/Status";
// import UpdateRejectReason from "@components/common/UpdateRejectReason";
// import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
// import { DownloadOutlined } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   capitalize,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Stack,
//   Table,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { downloadFiles } from "@utils/downloadFiles";
// import handleError from "@utils/handleError";
// import kebabToCapitalize from "@utils/kebabToCapitalize";
// import { reorderKeys } from "@utils/reorderKeys";
// import { Form, FormikProvider, useFormik } from "formik";
// import { useRouter } from "next/router";
// import React from "react";
// import { DropzoneProps } from "react-dropzone";
// import { toast } from "react-hot-toast";
// import { useGetAllEkycStatusQuery, useUpdateESignDetailsMutation } from "services/ekyc.service";
// import { Option } from "types/app";
// import { ESignDetail, orderedESignDetails, RejectionTemplate } from "types/ekyc";
// import * as Yup from "yup";
// import InputField from "../../../../common/InputField";

// interface Props {
//   onDrop: DropzoneProps["onDrop"];
//   details: ESignDetail;
//   client_id: string;
//   enums?: {
//     [key in keyof ESignDetail]: Option[];
//   };
//   rejectionTemplates: RejectionTemplate[];
// }

// const fileKeys: (keyof ESignDetail)[] = [];
// const dateKeys: (keyof ESignDetail)[] = ["created_at", "updated_at"];
// const numberKeys: (keyof ESignDetail)[] = ["status"];

// const ESignDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
//   const [esignDetails, setESignDetails] = React.useState<(keyof ESignDetail)[]>();
//   const router = useRouter();
//   const { product } = router.query;

// const hiddenDownloadProducts = ["MFKRA", "SUBKRA", "STXKRA", "MFDK"];
//   const shouldHideSomeFields = product?.toString().includes("MF") || product?.toString().includes("SUB");
//   const hiddenFields: (keyof ESignDetail)[] = shouldHideSomeFields
//     ? ["ucc_code", "ddpi_pdf_url_download","dp_id"] // Add more keys if needed
//     : [];

//   React.useEffect(() => {
//     if (details.status === 3) {
//       orderedESignDetails.splice(orderedESignDetails.length - 1, 0, "reject_reason");
//       setESignDetails(orderedESignDetails);
//     } else {
//       const temp = orderedESignDetails.filter((f) => f !== "reject_reason");
//       setESignDetails(temp);
//     }
//   }, [details.status]);

//   const orderedDetails = reorderKeys(details, esignDetails);

//   const optionalKeys: (keyof ESignDetail)[] = [];
//   enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof ESignDetail));

//   const { data } = useGetAllEkycStatusQuery({ client_id }, { skip: !client_id });
//   const [updateESignDetails] = useUpdateESignDetailsMutation();

//   const [reason, setReason] = React.useState<string>("");
//   const [open, setOpen] = React.useState(false);
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   function handleOpen() {
//     setOpen(true);
//   }

//   function handleClose() {
//     setOpen(false);
//   }

//   const validationSchemaObj: Partial<Record<keyof ESignDetail, Yup.AnySchema>> = {};

//   dateKeys.forEach((key) => {
//     validationSchemaObj[key] = Yup.date();
//   });
//   optionalKeys.forEach((key) => {
//     if (!hiddenFields.includes(key)) {
//       validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
//     }
//   });

//   Object.keys(orderedDetails).forEach((key) => {
//     const k = key as keyof ESignDetail;
//     if (!dateKeys.includes(k) && !optionalKeys.includes(k) && !hiddenFields.includes(k)) {
//       validationSchemaObj[k] = Yup.string().required(`${kebabToCapitalize(k)} is required`);
//     }
//   });

//   const formik = useFormik({
//     initialValues: { ...orderedDetails, reason },
//     validationSchema: Yup.object().shape(validationSchemaObj),
//     onSubmit: async () => {},
//     enableReinitialize: true,
//   });

//   async function handleSubmit() {
//     const { status } = formik.values;
//     setIsSubmitting(true);
//     try {
//       const response = await updateESignDetails({
//         client_id,
//         status: +status,
//         reject_reason: formik.values.reason,
//       }).unwrap();
//       toast.success(response?.message);
//       if (status === "2" || status === "3") {
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setIsSubmitting(false);
//       handleClose();
//     }
//   }

//   React.useEffect(() => {
//     if (formik.values.status === "2" || formik.values.status === "3") handleOpen();
//     else handleClose();
//   }, [formik.values.status]);

//   React.useEffect(() => {
//     if (!open) {
//       formik.setFieldValue("status", formik.initialValues.status);
//     }
//   }, [open]);

//   return (
//     <FormikProvider value={formik}>
//       <Box component={Form}>
//         {Object.keys(formik.values).map((key) =>
//           hiddenFields.includes(key as keyof ESignDetail) ? null : optionalKeys.includes(key as keyof ESignDetail) ? (
//             <SelectField
//               key={key}
//               name={key}
//               label={key.split("_").map(capitalize).join(" ")}
//               options={enums?.[key as keyof ESignDetail]}
//             />
//           ) : dateKeys.includes(key as keyof ESignDetail) ? (
//             <MUIDateComponent
//               key={key}
//               name={key}
//               label={key.split("_").map(capitalize).join(" ")}
//             />
//           ) : numberKeys.includes(key as keyof ESignDetail) ? (
//             <Status key={key} name={key} />
//           ) : key !== "reason" &&
//             !fileKeys.includes(key as keyof ESignDetail) &&
//             key === "reject_reason" ? (
//             <UpdateRejectReason
//               key={key}
//               name={key}
//               text={key.split("_").map(capitalize).join(" ")}
//               type="text"
//               handleOpen={() => {
//                 formik.setFieldValue("status", "3");
//                 handleOpen();
//               }}
//             />
//           ) : (
//             key !== "reason" &&
//             !fileKeys.includes(key as keyof ESignDetail) && (
//               <InputField
//                 key={key}
//                 name={key}
//                 text={key.split("_").map(capitalize).join(" ")}
//                 type="text"
//               />
//             )
//           )
//         )}

//         <Box sx={{ mt: 2 }}>
//           <Stack sx={{ alignItems: "start", gap: 2 }}>
//             <Typography variant="body1" color="initial">
//               {shouldHideSomeFields
//                 ? "Download KRA Doc's here"
//                 : "Download AOF, KRA & DDPI Doc's here."}
//             </Typography>

//        {!hiddenDownloadProducts.includes((product as string)?.toUpperCase()) && (
//   <Button
//     startIcon={<DownloadOutlined />}
//     variant="contained"
//     onClick={async () => {
//       await downloadFiles([
//         details.esigned_pdf_url_download,
//         details.kra_pdf_url_download,
//         details.ddpi_pdf_url_download,
//       ]);
//     }}
//     sx={{ width: "150px" }}
//     disabled={
//       !details.esigned_pdf_url_download &&
//       !details.kra_pdf_url_download &&
//       !details.ddpi_pdf_url_download
//     }
//   >
//     Download
//   </Button>
// )}

//           </Stack>
//         </Box>

//         <Dialog
//           open={open}
//           onClose={handleClose}
//           PaperProps={{ sx: { width: "min(100%, 450px)" } }}
//         >
//           <DialogTitle>
//             <Typography variant="subtitle1">
//               {formik.values.status === "3"
//                 ? "ESign Details Rejection"
//                 : "ESign Details Verification"}
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
//                 <Stack alignItems="start" gap={2}>
//                   {data?.data?.status && (
//                     <TableContainer sx={{ flex: 1 }}>
//                       <Table
//                         sx={{
//                           border: "1px solid",
//                           borderColor: "divider",
//                           minWidth: "400px",
//                           "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
//                             bgcolor: "divider",
//                           },
//                         }}
//                       >
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>KYC Details</TableCell>
//                             <TableCell align="right">Status</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         {Object.entries(data?.data?.status).map(([key, value]) => (
//                           <TableRow key={key}>
//                             <TableCell align="left">{kebabToCapitalize(key)}</TableCell>
//                             <TableCell align="right">
//                               <Typography
//                                 color={
//                                   value === 0 || value === 1
//                                     ? "warning.main"
//                                     : value === 2
//                                     ? "success.main"
//                                     : "error.main"
//                                 }
//                               >
//                                 {value === 0 || value === 1
//                                   ? "Pending"
//                                   : value === 2
//                                   ? "Verified"
//                                   : "Rejected"}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </Table>
//                     </TableContainer>
//                   )}
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
//               disabled={
//                 isSubmitting || (formik.values.status === "3" && !formik.values.reason)
//               }
//             >
//               {isSubmitting ? <CircularProgress /> : "Submit"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </FormikProvider>
//   );
// };

// export default ESignDetailsForm;
import MUIDateComponent from "@components/common/MUIDateComponent";
import ReasonField from "@components/common/ReasonFiled";
import Status from "@components/common/Status";
import UpdateRejectReason from "@components/common/UpdateRejectReason";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { DownloadOutlined } from "@mui/icons-material";
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
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { downloadFiles } from "@utils/downloadFiles";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderKeys } from "@utils/reorderKeys";
import { Form, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { DropzoneProps } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useGetAllEkycStatusQuery, useUpdateESignDetailsMutation } from "services/ekyc.service";
import { Option } from "types/app";
import { ESignDetail, orderedESignDetails, RejectionTemplate } from "types/ekyc";
import * as Yup from "yup";
import InputField from "../../../../common/InputField";

interface Props {
  onDrop: DropzoneProps["onDrop"];
  details: ESignDetail;
  client_id: string;
  enums?: {
    [key in keyof ESignDetail]: Option[];
  };
  rejectionTemplates: RejectionTemplate[];
}

const fileKeys: (keyof ESignDetail)[] = [];
const dateKeys: (keyof ESignDetail)[] = ["created_at", "updated_at"];
const numberKeys: (keyof ESignDetail)[] = ["status"];

const ESignDetailsForm = ({ details, onDrop, client_id, enums, rejectionTemplates }: Props) => {
  const [esignDetails, setESignDetails] = React.useState<(keyof ESignDetail)[]>();
  const router = useRouter();
  const { product } = router.query;

const hiddenDownloadProducts = ["MFKRA", "SUBKRA", "STXKRA", "MFDK","STXKRA"];
  const shouldHideSomeFields = product?.toString().includes("MF") || product?.toString().includes("SUB") || product?.toString().includes("STX");
  const hiddenFields: (keyof ESignDetail)[] = shouldHideSomeFields
    ? ["ucc_code", "ddpi_pdf_url_download","dp_id"] 
    : [];

  React.useEffect(() => {
    if (details.status === 3) {
      orderedESignDetails.splice(orderedESignDetails.length - 1, 0, "reject_reason");
      setESignDetails(orderedESignDetails);
    } else {
      const temp = orderedESignDetails.filter((f) => f !== "reject_reason");
      setESignDetails(temp);
    }
  }, [details.status]);

  const orderedDetails = reorderKeys(details, esignDetails);

  const optionalKeys: (keyof ESignDetail)[] = [];
  enums && Object.keys(enums).map((key) => optionalKeys.push(key as keyof ESignDetail));

  const { data } = useGetAllEkycStatusQuery({ client_id }, { skip: !client_id });
  const [updateESignDetails] = useUpdateESignDetailsMutation();

  const [reason, setReason] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const validationSchemaObj: Partial<Record<keyof ESignDetail, Yup.AnySchema>> = {};

  dateKeys.forEach((key) => {
    validationSchemaObj[key] = Yup.date();
  });
  optionalKeys.forEach((key) => {
    if (!hiddenFields.includes(key)) {
      validationSchemaObj[key] = Yup.string().required(`${kebabToCapitalize(key)} is required`);
    }
  });

  Object.keys(orderedDetails).forEach((key) => {
    const k = key as keyof ESignDetail;
    if (!dateKeys.includes(k) && !optionalKeys.includes(k) && !hiddenFields.includes(k)) {
      validationSchemaObj[k] = Yup.string().required(`${kebabToCapitalize(k)} is required`);
    }
  });

  const formik = useFormik({
    initialValues: { ...orderedDetails, reason },
    validationSchema: Yup.object().shape(validationSchemaObj),
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  async function handleSubmit() {
    const { status } = formik.values;
    setIsSubmitting(true);
    try {
      const response = await updateESignDetails({
        client_id,
        status: +status,
        reject_reason: formik.values.reason,
      }).unwrap();
      toast.success(response?.message);
      if (status === "2" || status === "3") {
        router.push("/dashboard");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  }

  React.useEffect(() => {
    if (formik.values.status === "2" || formik.values.status === "3") handleOpen();
    else handleClose();
  }, [formik.values.status]);

  React.useEffect(() => {
    if (!open) {
      formik.setFieldValue("status", formik.initialValues.status);
    }
  }, [open]);

  return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        {Object.keys(formik.values).map((key) =>
          hiddenFields.includes(key as keyof ESignDetail) ? null : optionalKeys.includes(key as keyof ESignDetail) ? (
            <SelectField
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
              options={enums?.[key as keyof ESignDetail]}
            />
          ) : dateKeys.includes(key as keyof ESignDetail) ? (
            <MUIDateComponent
              key={key}
              name={key}
              label={key.split("_").map(capitalize).join(" ")}
            />
          ) : numberKeys.includes(key as keyof ESignDetail) ? (
            <Status key={key} name={key} />
          ) : key !== "reason" &&
            !fileKeys.includes(key as keyof ESignDetail) &&
            key === "reject_reason" ? (
            <UpdateRejectReason
              key={key}
              name={key}
              text={key.split("_").map(capitalize).join(" ")}
              type="text"
              handleOpen={() => {
                formik.setFieldValue("status", "3");
                handleOpen();
              }}
            />
          ) : (
            key !== "reason" &&
            !fileKeys.includes(key as keyof ESignDetail) && (
              <InputField
                key={key}
                name={key}
                text={key.split("_").map(capitalize).join(" ")}
                type="text"
              />
            )
          )
        )}

        {/* <Box sx={{ mt: 2 }}>
          <Stack sx={{ alignItems: "start", gap: 2 }}>
            <Typography variant="body1" color="initial">
              {shouldHideSomeFields
                ? "Download KRA Doc's here"
                : "Download AOF, KRA & DDPI Doc's here."}
            </Typography>

       {!hiddenDownloadProducts.includes((product as string)?.toUpperCase()) && (
  <Button
    startIcon={<DownloadOutlined />}
    variant="contained"
    onClick={async () => {
      await downloadFiles([
        details.esigned_pdf_url_download,
        details.kra_pdf_url_download,
        details.ddpi_pdf_url_download,
      ]);
    }}
    sx={{ width: "150px" }}
    disabled={
      !details.esigned_pdf_url_download &&
      !details.kra_pdf_url_download &&
      !details.ddpi_pdf_url_download
    }
  >
    Download
  </Button>
)}

          </Stack>
        </Box> */}
{/* <Box sx={{ mt: 2 }}>
  <Stack sx={{ alignItems: "start", gap: 2 }}>
    <Typography variant="body1" color="initial">
      {shouldHideSomeFields
        ? "Download KRA Doc's here"
        : "Download AOF, KRA & DDPI Doc's here."}
    </Typography>

    {(() => {
      const productCode = (product as string)?.toUpperCase();

      const productName = (router.query?.name as string)?.replace(/\s+/g, "_") || "User";


      const shouldShowOnlyEsignedDownload =
        productCode?.includes("SUBNKRA") || productCode?.includes("MFNKRA") ||  productCode?.includes("MFCNK") || productCode?.includes("STXNKRA") ;

      const shouldShowNormalDownload =
        !hiddenDownloadProducts.includes(productCode) && !shouldShowOnlyEsignedDownload;

      if (shouldShowOnlyEsignedDownload) {
        return (
          <Button
            startIcon={<DownloadOutlined />}
            variant="contained"
            onClick={async () => {
              await downloadFiles(
                [`${details.esigned_pdf_url}`],
            
              );
            }}
            sx={{ width: "150px" }}
            disabled={!details.esigned_pdf_url}
          >
            Download
          </Button>
        );
      }

      if (shouldShowNormalDownload) {
        return (
          <Button
            startIcon={<DownloadOutlined />}
            variant="contained"
            onClick={async () => {
              await downloadFiles(
                [
                  details.esigned_pdf_url_download,
                  details.kra_pdf_url_download,
                  details.ddpi_pdf_url_download,
                ],
              
              );
            }}
            sx={{ width: "150px" }}
            disabled={
              !details.esigned_pdf_url_download &&
              !details.kra_pdf_url_download &&
              !details.ddpi_pdf_url_download
            }
          >
            Download
          </Button>
        );
      }

      return null;
    })()}
  </Stack>
</Box> */}

<Box sx={{ mt: 2 }}>
  <Stack sx={{ alignItems: "start", gap: 2 }}>
    <Typography variant="body1" color="initial">
      {shouldHideSomeFields
        ? "Download KRA Doc's here"
        : "Download AOF, KRA & DDPI Doc's here."}
    </Typography>

    {(() => {
      const productCode = (product as string)?.toUpperCase();
      const productName = (router.query?.name as string)?.replace(/\s+/g, "_") || "User";

      const shouldShowOnlyEsignedDownload =
        productCode?.includes("SUBNKRA") || 
        productCode?.includes("MFNKRA") ||  
        productCode?.includes("MFCNK") || 
        productCode?.includes("STXNKRA");

      const shouldShowNormalDownload =
        !hiddenDownloadProducts.includes(productCode) && !shouldShowOnlyEsignedDownload;

      if (shouldShowOnlyEsignedDownload) {
        return (
          <Button
            startIcon={<DownloadOutlined />}
            variant="contained"
            onClick={async () => {
              if (details.esigned_pdf_url) {
                await downloadFiles([details.esigned_pdf_url]);
              } else {
                toast.error("E-signed PDF not available for download");
              }
            }}
            sx={{ width: "150px" }}
            disabled={!details.esigned_pdf_url}
          >
            Download
          </Button>
        );
      }

      if (shouldShowNormalDownload) {
        // Create array of file objects with names and URLs
      

        return (
         <Button
              startIcon={<DownloadOutlined />}
              variant="contained"
              onClick={async () => {
                await downloadFiles([
                  details.esigned_pdf_url_download,
                  details.kra_pdf_url_download,
                  details.ddpi_pdf_url_download,
                ]);
              }}
              sx={{ width: "150px" }}
              disabled={
                !details.esigned_pdf_url_download &&
                !details.kra_pdf_url_download &&
                !details.ddpi_pdf_url_download
              }
            >
              Download
            </Button>
        );
      }

      return null;
    })()}
  </Stack>
</Box>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { width: "min(100%, 450px)" } }}
        >
          <DialogTitle>
            <Typography variant="subtitle1">
              {formik.values.status === "3"
                ? "ESign Details Rejection"
                : "ESign Details Verification"}
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
                <Stack alignItems="start" gap={2}>
                  {data?.data?.status && (
                    <TableContainer sx={{ flex: 1 }}>
                      <Table
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          minWidth: "400px",
                          "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
                            bgcolor: "divider",
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>KYC Details</TableCell>
                            <TableCell align="right">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        {Object.entries(data?.data?.status).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell align="left">{kebabToCapitalize(key)}</TableCell>
                            <TableCell align="right">
                              <Typography
                                color={
                                  value === 0 || value === 1
                                    ? "warning.main"
                                    : value === 2
                                    ? "success.main"
                                    : "error.main"
                                }
                              >
                                {value === 0 || value === 1
                                  ? "Pending"
                                  : value === 2
                                  ? "Verified"
                                  : "Rejected"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </Table>
                    </TableContainer>
                  )}
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
              disabled={
                isSubmitting || (formik.values.status === "3" && !formik.values.reason)
              }
            >
              {isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormikProvider>
  );
};

export default ESignDetailsForm;
