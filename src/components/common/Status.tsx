import { Box, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";
interface IProps {
  name: string;
  width?: string;
  disabled?: boolean;
}

const Status = ({ name, width = "100%", disabled = false }: IProps) => {
  const [input, meta] = useField(name);

  const formik = useFormikContext();
  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";
  React.useEffect(() => {
    if (input.value === 1 || input.value === 0) formik.setFieldValue(name, "0");
  }, [formik, input.value, name]);

  return (
    <Grid container alignItems="center" sx={{ pb: 1 }}>
      <Box sx={{ minWidth: 160 }}>
        <Typography noWrap variant="subtitle2">
          Status
        </Typography>
      </Box>
      <Grid item md={8}>
        <RadioGroup row {...formik.getFieldProps(name)} {...input} {...{ error, helperText }}>
          <FormControlLabel value="0" control={<Radio />} label="Pending" disabled />
          {/* <FormControlLabel value="1" control={<Radio />} label="Awaiting" /> */}
          <FormControlLabel value="2" control={<Radio />} label="Verified" disabled={disabled} />
          <FormControlLabel value="3" control={<Radio />} label="Rejected" disabled={disabled} />
        </RadioGroup>
      </Grid>
    </Grid>
  );
};

// 0,1 - pending;
// 2,3 - verified, rejected;

export default Status;

// Pending = 0,
// Awaiting = 1,
// Completed = 2,
// Rejected = 3,
