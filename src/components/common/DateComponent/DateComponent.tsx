import { Box, TextField, TextFieldProps } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useField, useFormikContext } from "formik";

import React from "react";
interface IProps {
  name: string;
}
const DateComponent = ({ name }: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";
  const [value, setValue] = React.useState<Dayjs | null>(null);
  return (
    <Box
      sx={{
        " .MuiInputBase-root": {
          backgroundColor: "hsla(0, 0%, 98%, 1)",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={value}
          onChange={(newValue: React.SetStateAction<dayjs.Dayjs | null>) => {
            setValue(newValue);
          }}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <TextField
              {...formik.getFieldProps(name)}
              {...input}
              {...{ error, helperText }}
              name={name}
              // fullWidth
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateComponent;
