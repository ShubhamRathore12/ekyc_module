import { options } from "@components/common/lib";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useField, useFormikContext } from "formik";
import { useState } from "react";
import DynamicField from "./DynamicField";

interface IProps {
  name: string;
  width?: string;
}

const TypeOfDocument = ({ name, width = "100%" }: IProps) => {
  const [typeOfDocument, setTypeOfDocument] = useState("");
  const [input, meta] = useField(name);
  const formik = useFormikContext();
  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";
  // const formik = useFormik({
  //     initialValues: {
  //      type_of_document : "",
  //     },
  //     onSubmit: (values, helpers) => {
  //       helpers.setSubmitting(true);
  //       setTimeout(() => {
  //
  //         helpers.setSubmitting(false);
  //       }, 2000);
  //     },
  //   });
  //
  function changeHandler(e: any) {
    setTypeOfDocument(e.target.value);
  }
  return (
    <DynamicField>
      <Box sx={{ minWidth: 160 }}>
        <Typography noWrap variant="subtitle2">
          Type Of Document
        </Typography>
      </Box>
      <Grid item xs={12} md={8} gap={0}>
        <TextField
          select
          sx={{
            width: width,
            my: 1,
            "& .MuiInputBase-input": {
              bgcolor: "hsla(0, 0%, 98%, 1)",
              height: "40px",
              fontSize: "14px",
              p: 0,
            },
          }}
          {...formik.getFieldProps(name)}
          {...input}
        >
          <MenuItem key=" " disabled selected value="Plese choose the type of document">
            Plese choose the type of document
          </MenuItem>
          {options.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.lable}
              </MenuItem>
            );
          })}
        </TextField>
      </Grid>
    </DynamicField>
  );
};

export default TypeOfDocument;
