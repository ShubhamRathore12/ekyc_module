import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { RejectionTemplate } from "types/ekyc";
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
  rejectionTemplates?: RejectionTemplate[];
}

const ReasonField = ({
  name,
  text,
  type,
  placeholder = "",
  width = "100%",
  height,
  labelWidth = 160,
  full_width = false,
  disabled = true,
  rejectionTemplates,
}: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        width: "min(100%, 550px)",
      }}
      // sx={{
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "space-between",
      //   gap: 2,
      // }}
    >
      {/* <TextField
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
        /> */}

      {rejectionTemplates ? (
        <FormControl
          fullWidth
          sx={{
            mt: 2,
          }}
        >
          <InputLabel>Reject Reason</InputLabel>
          <Select
            fullWidth
            {...formik.getFieldProps(name)}
            label="Reject Reason"
            sx={{
              maxWidth: 400,
            }}
          >
            {rejectionTemplates &&
              rejectionTemplates.map((r) => (
                <MenuItem
                  sx={{
                    maxWidth: "400px",
                  }}
                  value={r.rejection_reason}
                  key={r.rejection_template_id}
                >
                  {r.rejection_reason}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};

export default ReasonField;
