import { OptionsType } from "@components/common/lib";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useState } from "react";

interface IProps {
  name: string;
  label?: string;
  options: any;
  width?: string;
  mutiple?: boolean;
}

const Select = ({ name, options, label, width = "90%", mutiple = false }: IProps) => {
  const [selectFiled, setSelectFiled] = useState("");
  const [input, meta] = useField(name);
  const formik = useFormikContext();
  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

  function changeHandler(e: any) {
    setSelectFiled(e.target.value);
  }
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-end"
        sx={{ pr: { xs: "unset", md: 4 } }}
      >
        <Grid item xs={12} md={4} gap={0}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid xs={12} md={8} gap={0}>
          <TextField
            fullWidth
            multiple={mutiple}
            select
            sx={{
              mt: 2,
              "& .MuiInputBase-input": {
                bgcolor: "hsla(0, 0%, 98%, 1)",
              },
            }}
            {...formik.getFieldProps(name)}
            {...input}
            {...{ error, helperText }}
          >
            <MenuItem key=" " disabled selected value="Plese choose">
              Plese choose
            </MenuItem>
            {options.map((option: OptionsType) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Select;
