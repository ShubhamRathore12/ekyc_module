import { Box, Grid, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
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
}

const FullwidthInputField = ({
  name,
  text,
  type,
  placeholder = "",
  width = "100%",
  height,
  labelWidth = 160,
  full_width = false,
  disabled = true,
}: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

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
          multiline={true}
          maxRows={8}
          rows={5}
          disabled={disabled}
          fullWidth
          {...formik.getFieldProps(name)}
          type={type}
          placeholder={placeholder}
          sx={{
            borderRadius: 1,
            // mt: { xs: 0, md: 2 },
            // width: `min(50vw, 230px)`,
            // minWidth: { xs: "150px", lg: "200px" },
            width: width,
            // height:'53px',
            "& .MuiInputBase-input": {
              bgcolor: "hsla(0, 0%, 98%, 1)",
              height: "40px",
              fontSize: "14px",
              p: 0,
              pl: 1,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default FullwidthInputField;
