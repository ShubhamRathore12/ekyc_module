import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useUpdateIDProofMutation } from "services/ekyc.service";
interface IProps {
  name: string;
  text: string;
  type: string;
  placeholder?: string;
  width?: string;
  height?: string;
  full_width?: boolean;
  labelWidth?: string | number;
  client_id?: string;
  handleOpen?: () => void;
}

const UpdateRejectReason = ({
  name,
  text,
  type,
  placeholder = "",
  width = "100%",
  height,
  labelWidth = 160,
  full_width = false,
  client_id,
  handleOpen,
}: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

  const [updateIDProof] = useUpdateIDProofMutation();

  return (
    <Grid
      justifyContent="flex-start"
      container
      alignItems="center"
      sx={{
        gap: { xs: 1, md: 0 },
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
      <Grid item xs={12} md={4} gap={0}>
        <TextField
          disabled={true}
          fullWidth
          {...formik.getFieldProps(name)}
          type={type}
          placeholder={placeholder}
          multiline
          rows={3}
          maxRows={5}
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

      <Grid item xs={12} md={4} gap={0} sx={{ pl: { xs: "unset", md: 2 } }}>
        <Button fullWidth variant="contained" size="small" onClick={handleOpen}>
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default UpdateRejectReason;
