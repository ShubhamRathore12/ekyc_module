import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";
import DynamicField from "./DynamicField";
import FieldContainer from "./FieldContainer";
import LabelContainer from "./LabelContainer";

export const DropZone: React.FC<DropzoneProps> = (props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "video/*": [],
    },
    ...props,
  });
  return (
    <DynamicField>
      <LabelContainer>
        <Typography variant="subtitle2">Upload Document</Typography>
      </LabelContainer>
      <FieldContainer>
        <Box
          sx={{
            width: "100%",
            height: "40px",
            border: "1px dashed green",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            bgcolor: "hsla(0, 0%, 98%, 1)",
            borderRadius: 2,
          }}
          {...getRootProps({ className: "dropzone" })}
        >
          <Typography variant="subtitle2">Upload File</Typography>
          <CloudUploadIcon fontSize="large" />
          <input {...getInputProps()} />
        </Box>
      </FieldContainer>
    </DynamicField>
  );
};
