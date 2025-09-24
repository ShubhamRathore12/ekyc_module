import { Box, TextField, TextFieldProps, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useField, useFormikContext } from "formik";
import { formatDate } from "utils/formatDate";
import DynamicField from "../DynamicField";
import FieldContainer from "../FieldContainer";
import LabelContainer from "../LabelContainer";
interface IProps {
  label?: string;
  name: string;
}
const MUIDateComponent = ({ label, name }: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";
  return (
    <DynamicField>
      <LabelContainer>
        <Typography variant="subtitle2">{label}</Typography>
      </LabelContainer>
      <FieldContainer>
        <Box
          sx={{
            " .MuiInputBase-root": {
              backgroundColor: "hsla(0, 0%, 98%, 1)",
            },
          }}
        >
          <>
            <DatePicker
              disabled
              value={formatDate(input.value, true) || null}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => {
                formik.setFieldValue(input.name, formatDate(newValue));
              }}
              renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "14px",
                      height: "40px",
                    },
                  }}
                  {...formik.getFieldProps(name)}
                  {...input}
                  name={name}
                  fullWidth
                  {...params}
                />
              )}
            />
          </>
        </Box>
      </FieldContainer>
    </DynamicField>
  );
};

export default MUIDateComponent;
