import { Box, Grid, TextField, Typography } from "@mui/material";
import { sanitizeInput, fieldSanitizers } from "@utils/inputSanitizer";
import { FIELD_CONSTRAINTS } from "@utils/inputValidation";
import { useField, useFormikContext } from "formik";
import { useUpdateIDProofMutation } from "services/ekyc.service";
import React from "react";
import { toast } from "react-hot-toast";
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
  maxLength?: number;
  sanitizer?: keyof typeof fieldSanitizers;
  allowPaste?: boolean;
}

const InputField = ({
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
  maxLength,
  sanitizer = "text",
  allowPaste = true,
}: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();
  const [securityError, setSecurityError] = React.useState<string>("");

  const error = Boolean(meta.touched && (!!meta.error || !!securityError));
  const helperText = (meta.touched && (meta.error || securityError)) || " ";

  const [updateIDProof] = useUpdateIDProofMutation();

  // Determine appropriate maxLength based on field type or explicit prop
  const getMaxLength = (): number => {
    if (maxLength) return maxLength;
    
    // Infer from field name or type
    if (name.includes('email')) return FIELD_CONSTRAINTS.email.max;
    if (name.includes('phone') || name.includes('mobile')) return FIELD_CONSTRAINTS.mobileNumber.max;
    if (name.includes('pan')) return FIELD_CONSTRAINTS.panNumber.max;
    if (name.includes('name')) return FIELD_CONSTRAINTS.name.max;
    if (name.includes('address')) return FIELD_CONSTRAINTS.address.max;
    if (name.includes('pincode')) return FIELD_CONSTRAINTS.pincode.max;
    if (name.includes('ifsc')) return FIELD_CONSTRAINTS.ifscCode.max;
    if (name.includes('micr')) return FIELD_CONSTRAINTS.micrCode.max;
    if (name.includes('username')) return FIELD_CONSTRAINTS.username.max;
    
    // Default based on type
    if (type === 'email') return FIELD_CONSTRAINTS.email.max;
    if (type === 'tel') return FIELD_CONSTRAINTS.mobileNumber.max;
    
    return FIELD_CONSTRAINTS.mediumText.max; // Default
  };

  const actualMaxLength = getMaxLength();

  // Handle input change with sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Apply length constraint
    if (value.length > actualMaxLength) {
      value = value.substring(0, actualMaxLength);
    }
    
    // Apply field-specific sanitization
    const sanitizerFn = fieldSanitizers[sanitizer];
    if (sanitizerFn) {
      value = sanitizerFn(value);
    } else {
      value = sanitizeInput(value);
    }
    
    // Validate length
    if (value.length > actualMaxLength) {
      setSecurityError(`Maximum ${actualMaxLength} characters allowed`);
    } else {
      setSecurityError("");
    }
    
    // Update formik field
    formik.setFieldValue(name, value);
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!allowPaste) {
      e.preventDefault();
      toast.error("Paste is not allowed for this field");
      return;
    }
    
    const pastedText = e.clipboardData.getData('text');
    const sanitizedText = fieldSanitizers[sanitizer]?.(pastedText) || sanitizeInput(pastedText);
    
    if (sanitizedText !== pastedText) {
      e.preventDefault();
      const truncatedText = sanitizedText.substring(0, actualMaxLength);
      formik.setFieldValue(name, truncatedText);
      toast.error("Pasted content was sanitized for security");
    }
  };

  return (
    <Grid
      justifyContent="flex-start"
      container
      alignItems="center"
      sx={{
        gap: 0,
        pb: 2,
      }}
      // sx={{
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "space-between",
      //   gap: 2,
      // }}
      maxWidth="550px"
    >
      <Box sx={{ minWidth: labelWidth }}>
        <Typography
          variant="subtitle2"
          sx={{
            width: "160px",
          }}
        >
          {text}
        </Typography>
      </Box>
      <Grid item xs={12} md={8} gap={0}>
        <TextField
          disabled={disabled}
          fullWidth
          autoComplete="off"
          value={input.value || ""}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onBlur={formik.handleBlur}
          name={name}
          helperText={helperText}
          error={error}
          type={type}
          placeholder={placeholder}
          inputProps={{ 
            maxLength: actualMaxLength,
            'data-security-sanitized': 'true',
            autoComplete: type === 'password' ? 'new-password' : 'off'
          }}
          sx={{
            borderRadius: 1,
            width: width,
            "& .MuiInputBase-input": {
              bgcolor: "hsla(0, 0%, 98%, 1)",
              height: "40px",
              fontSize: "14px",
              p: 0,
              pl: 1,
            },
            "& .MuiFormHelperText-root": {
              fontSize: "12px",
              color: error ? "error.main" : "text.secondary",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default InputField;
