import DynamicField from "@components/common/DynamicField";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useField, useFormikContext } from "formik";
import { useState } from "react";
import { Option } from "types/app";
interface IProps {
  name: string;
  label: string;
  options?: Option[];
  width?: string;
  mutiple?: boolean;
}

const SelectField = ({ name, options = [], label, width = "100%", mutiple = false }: IProps) => {
  const [selectFiled, setSelectFiled] = useState("");
  const [input, meta] = useField(name);
  const formik = useFormikContext();
  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

  function changeHandler(e: any) {
    setSelectFiled(e.target.value);
  }

  return (
    <DynamicField>
      <Box sx={{ minWidth: "140px" }}>
        <Typography sx={{ width: "160px" }} variant="subtitle2">
          {label}
        </Typography>
      </Box>
      <Grid item xs={8} md={6} lg={6} gap={0}>
        <TextField
          disabled
          multiple={mutiple}
          select
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: "40px",
              bgcolor: "hsla(0, 0%, 98%, 1)",
            },
            // "& .MuiInputBase-input": {
            //   height: "auto",
            //   // padding: "12.5px 14px",
            // },
          }}
          {...formik.getFieldProps(name)}
        >
          <MenuItem disabled>Please choose</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.type} value={option.type} disabled={option.disabled}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </DynamicField>
  );
};

export default SelectField;
