// import { Box, Button, Grid, TextField, Typography } from "@mui/material";
// import handleError from "@utils/handleError";
// import { useField, useFormikContext } from "formik";
// import React from "react";
// import { toast } from "react-hot-toast";
// import { useUpdateMicrMutation } from "services/ekyc.service";

// interface IProps {
//   name: string;
//   text: string;
//   type: string;
//   placeholder?: string;
//   width?: string;
//   height?: string;
//   full_width?: boolean;
//   labelWidth?: string | number;
//   disabled?: boolean;
//   client_id?: string;
//   value?: string;
//   isEditing?: boolean;
//   onEditClick?: () => void;
//   onSave?: (value: string) => void;
//   onCancel?: () => void;
//   alwaysEditable?: boolean;
//   required?: boolean;
//   refetch?:() =>void;
// }

// const EditableField = ({
//   name,
//   text,
//   type,
//   placeholder = "",
//   width = "100%",
//   height,
//   labelWidth = 160,
//   full_width = false,
//   disabled = true,
//   client_id,
//   value,
//   isEditing: externalIsEditing,
//   onEditClick,
//   onSave,
//   onCancel,
//   alwaysEditable = false,
//   required = false,
//   refetch
// }: IProps) => {
//   const [field, meta, helpers] = useField(name);
//   const formik = useFormikContext();

//   const [updateMicr] = useUpdateMicrMutation();
//   const [internalIsEditing, setInternalIsEditing] = React.useState(false);
//   const [initialValue] = React.useState(field.value);
//   const [error, setError] = React.useState<string | null>(null);
//   const [tempValue, setTempValue] = React.useState(field.value);

//   // Use external editing state if provided, otherwise use internal state
//   const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

//   const handleEdit = () => {
//     if (onEditClick) {
//       onEditClick();
//     } else {
//       setInternalIsEditing(true);
//     }
//     setTempValue(field.value);
//     setError(null);
//   };

//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     } else {
//       setInternalIsEditing(false);
//     }
//     setTempValue(field.value);
//     setError(null);
//   };

//   const isMICRInitiallyEmpty = initialValue === "" || !initialValue;

//   const isValidMICR = (value: string) => {
//     if (!value || value.trim() === "") {
//       return false;
//     }
//     const micrRegex = /^[a-zA-Z0-9]{9}$/;
//     return micrRegex.test(value);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);

//     if (isEditing) {
//       setTempValue(newValue);
//     } else {
//       helpers.setValue(newValue);
//     }

//     // Clear any existing error when user starts typing
//     if (newValue.length > 0) {
//       setError(null);
//     }

//     if (newValue.length === 0) {
//       if (required) {
//         setError("MICR is required and cannot be blank");
//       } else {
//         setError(null);
//       }
//     } else if (newValue.length !== 9) {
//       setError(`MICR must be exactly 9 characters. Current length: ${newValue.length}`);
//     } else if (!isValidMICR(newValue)) {
//       setError("MICR must contain only alphanumeric characters.");
//     } else {
//       setError(null);
//     }
//   };

//   const handleUpdate = async () => {
//     const valueToValidate = isEditing ? tempValue : field.value;

//     // Check if MICR is blank when required
//     if (required && (!valueToValidate || valueToValidate.trim() === "")) {
//       toast.error("MICR is required and cannot be blank. Please enter a valid MICR code.");
//       setError("MICR is required and cannot be blank");
//       return;
//     }

//     if (!isValidMICR(valueToValidate)) {
//       if (!valueToValidate || valueToValidate.trim() === "") {
//         toast.error("MICR is required and cannot be blank. Please enter a valid MICR code.");
//         setError("MICR is required and cannot be blank");
//       } else {
//         toast.error("MICR must be exactly 9 alphanumeric characters.");
//       }
//       return;
//     }

//     try {
//       if (onSave) {
//         // Use external save handler
//         await onSave(valueToValidate);
//       } else {
//         // Use internal update logic
//         if (client_id && valueToValidate) {
//           const res = await updateMicr({
//             client_id: client_id,
//             micr: valueToValidate,
//           }).unwrap();
//           toast.success(res?.message);
//           refetch && refetch()
//           helpers.setValue(valueToValidate);
//           setInternalIsEditing(false);
//           setError(null);
//         }
//       }
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   // Show edit button if field is always editable or if it's initially empty
//   const showEditButton = !disabled && (alwaysEditable || isMICRInitiallyEmpty || isEditing);

//   // Show error for blank MICR when required and not editing
//   const showBlankError = required && isMICRInitiallyEmpty && !isEditing;

//   return (
//     <Grid
//       justifyContent="flex-start"
//       container
//       alignItems="center"
//       sx={{
//         gap: { xs: 1, md: 0 },
//         pb: 2,
//       }}
//       maxWidth="550px"
//     >
//       <Box sx={{ minWidth: labelWidth }}>
//         <Typography
//           variant="subtitle2"
//           sx={{
//             width: "160px",
//             color: showBlankError ? "error.main" : "inherit",
//           }}
//         >
//           {text}
//           {required && <span style={{ color: "red" }}> *</span>}
//         </Typography>
//       </Box>
//       <Grid item xs={12} md={!disabled ? 4 : 8} gap={0}>
//         <TextField
//           disabled={!isEditing}
//           fullWidth
//           value={isEditing ? tempValue : field.value}
//           onChange={handleChange}
//           type={type}
//           placeholder={placeholder}
//           error={!!error || showBlankError}
//           helperText={error || (showBlankError ? "MICR is required and cannot be blank" : "")}
//           sx={{
//             borderRadius: 1,
//             width: width,
//             "& .MuiInputBase-input": {
//               bgcolor: "hsla(0, 0%, 98%, 1)",
//               height: "40px",
//               fontSize: "14px",
//               p: 0,
//               pl: 1,
//               cursor: alwaysEditable && !isEditing ? "pointer" : "text",
//             },
//             "& .MuiFormHelperText-root": {
//               color: showBlankError ? "error.main" : "inherit",
//             },
//           }}
//           onClick={alwaysEditable && !isEditing ? handleEdit : undefined}
//         />
//       </Grid>
//       {showEditButton && (
//         <Grid item xs={12} md={4} gap={0} sx={{ pl: { xs: "unset", md: 2 } }}>
//           {isEditing ? (
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <Button
//                 variant="contained"
//                 size="small"
//                 disabled={!tempValue || !isValidMICR(tempValue)}
//                 onClick={handleUpdate}
//                 sx={{ minWidth: "auto", px: 1 }}
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleCancel}
//                 sx={{ minWidth: "auto", px: 1 }}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           ) : (
//             <Button
//               fullWidth
//               variant="outlined"
//               size="small"
//               onClick={handleEdit}
//               sx={{mt:"-2.8rem"}}
//             >
//               {showBlankError &&  "Edit MICR"}
//             </Button>
//           )}
//         </Grid>
//       )}
//     </Grid>
//   );
// };

// export default EditableField;


import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import handleError from "@utils/handleError";
import { useField, useFormikContext } from "formik";
import React from "react";
import { toast } from "react-hot-toast";
import { useUpdateMicrMutation } from "services/ekyc.service";

interface IProps {
  name: string;
  text: string;
  type: string;
  placeholder?: string;
  width?: string;
  height?: string;
  full_width?: boolean;
  labelWidth?: string | number;
  disabled?: boolean;
  client_id?: string;
  value?: string;
  isEditing?: boolean;
  onEditClick?: () => void;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  alwaysEditable?: boolean;
  required?: boolean;
  refetch?: () => void;
}

const EditableField = ({
  name,
  text,
  type,
  placeholder = "",
  width = "100%",
  height,
  labelWidth = 160,
  full_width = false,
  disabled = true,
  client_id,
  value,
  isEditing: externalIsEditing,
  onEditClick,
  onSave,
  onCancel,
  alwaysEditable = false,
  required = false,
  refetch,
}: IProps) => {
  const [field, meta, helpers] = useField(name);
  const formik = useFormikContext();

  const [updateMicr] = useUpdateMicrMutation();
  const [internalIsEditing, setInternalIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tempValue, setTempValue] = React.useState(field.value);

  // Use external editing state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  // Reset on field.value change (e.g., after refetch)
  React.useEffect(() => {
    setTempValue(field.value);
    setError(null);
    setInternalIsEditing(false);
  }, [field.value]);

  const isValidMICR = (value: string) => /^[a-zA-Z0-9]{9}$/.test(value || "");

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      setInternalIsEditing(true);
    }
    setTempValue(field.value);
    setError(null);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalIsEditing(false);
    }
    setTempValue(field.value);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);
    if (isEditing) {
      setTempValue(newValue);
    } else {
      helpers.setValue(newValue);
    }

    // Dynamic validation
    if (!newValue.trim() && required) {
      setError("MICR is required and cannot be blank");
    } else if (newValue.length !== 9) {
      setError(`MICR must be exactly 9 characters. Current length: ${newValue.length}`);
    } else if (!isValidMICR(newValue)) {
      setError("MICR must contain only alphanumeric characters.");
    } else {
      setError(null);
    }
  };

  const handleUpdate = async () => {
    const valueToValidate = isEditing ? tempValue : field.value;

    if (!valueToValidate || !valueToValidate.trim()) {
      toast.error("MICR is required and cannot be blank.");
      setError("MICR is required and cannot be blank");
      return;
    }

    if (!isValidMICR(valueToValidate)) {
      toast.error("MICR must be exactly 9 alphanumeric characters.");
      return;
    }

    try {
      if (onSave) {
        await onSave(valueToValidate);
      } else if (client_id && valueToValidate) {
        const res = await updateMicr({ client_id, micr: valueToValidate }).unwrap();
        toast.success(res?.message);
        refetch && refetch();
        helpers.setValue(valueToValidate);
        setInternalIsEditing(false);
        setError(null);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Reactive check for blank MICR (used instead of static initialValue)
  const isBlankMicr = required && !field.value?.trim();
  const showEditButton = !disabled && (alwaysEditable || isEditing || isBlankMicr);
  const showBlankError = isBlankMicr && !isEditing;

  return (
    <Grid
      justifyContent="flex-start"
      container
      alignItems="center"
      sx={{
        gap: { xs: 1, md: 0 },
        pb: 2,
      }}
      maxWidth="550px"
    >
      <Box sx={{ minWidth: labelWidth }}>
        <Typography
          variant="subtitle2"
          sx={{
            width: "160px",
            color: showBlankError ? "error.main" : "inherit",
          }}
        >
          {text}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
      </Box>
      <Grid item xs={12} md={!disabled ? 4 : 8} gap={0}>
        <TextField
          disabled={!isEditing}
          fullWidth
          value={isEditing ? tempValue : field.value}
          onChange={handleChange}
          type={type}
          placeholder={placeholder}
          error={!!error || showBlankError}
          helperText={error || (showBlankError ? "MICR is required and cannot be blank" : "")}
          sx={{
            borderRadius: 1,
            width: width,
            "& .MuiInputBase-input": {
              bgcolor: "hsla(0, 0%, 98%, 1)",
              height: "40px",
              fontSize: "14px",
              p: 0,
              pl: 1,
              cursor: alwaysEditable && !isEditing ? "pointer" : "text",
            },
            "& .MuiFormHelperText-root": {
              color: showBlankError ? "error.main" : "inherit",
            },
          }}
          onClick={alwaysEditable && !isEditing ? handleEdit : undefined}
        />
      </Grid>
      {showEditButton && (
        <Grid item xs={12} md={4} gap={0} sx={{ pl: { xs: "unset", md: 2 } }}>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                disabled={!tempValue || !isValidMICR(tempValue)}
                onClick={handleUpdate}
                sx={{ minWidth: "auto", px: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancel}
                sx={{ minWidth: "auto", px: 1 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleEdit}
              sx={{ mt: "-2.8rem" }}
            >
              {showBlankError ? "Edit MICR" : "Edit"}
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};




export default EditableField;
