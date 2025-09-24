// import { Box, experimental_sx, TextField, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useField, useFormikContext } from "formik";
// const FullWidthBox = styled(Box)(({ theme }) =>
//   experimental_sx({
//     display: "flex",
//     flexDirection: { xs: "column", md: "row" },
//     alignItems: { xs: "flex-start", md: "center" },
//     mr: { xs: 0, lg: 2 },
//   })
// );

// const CustomeTextField = styled(TextField)({
//   "&.MuiFormControl-root": {},
//   "& .MuiInputBase-root": {
//     padding: 0,
//     backgroundColor: "hsla(0, 0%, 98%, 1)",
//     height: "40px",
//     fontSize: "14px",
//   },
//   "&.MuiInputBase-input": {
//     paddingLeft: 2,
//   },
// });

// interface IProps {
//   name: string;
//   label?: string;
//   paddingBottom?: string;
//   paddingTop?: string;
//   paddingLeft?: string;
//   paddingRight?: string;
//   placeHolder?: string;
//   multiline?: boolean;
//   rows?: number;
//   maxRows?: number;
// }

// const FullWidthField = ({
//   name,
//   label,
//   paddingBottom = "0",
//   paddingLeft,
//   paddingRight,
//   paddingTop,
//   placeHolder,
//   maxRows,
//   multiline = false,
//   rows,
// }: IProps) => {
//   const [input, meta] = useField(name);
//   const formik = useFormikContext();

//   const error = Boolean(meta.touched && !!meta.error);
//   const helperText = (meta.touched && meta.error) || " ";
//   return (
//     <FullWidthBox sx={{ pb: `${paddingBottom}px` }}>
//       <Typography sx={{ width: "180px", mb: 2 }} variant="subtitle2">
//         {label}
//       </Typography>
//       <CustomeTextField
//         {...formik.getFieldProps(name)}
//         {...{ error, helperText }}
//         multiline={multiline}
//         fullWidth
//         maxRows={maxRows}
//         rows={rows}
//         sx={{ flexGrow: 1 }}
//         name={name}
//         placeholder={placeHolder}
//       />
//     </FullWidthBox>
//   );
// };

// export default FullWidthField;


import { Box, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";

interface IProps {
  name: string;
  label?: string;
  paddingBottom?: string;
  paddingTop?: string;
  paddingLeft?: string;
  paddingRight?: string;
  placeHolder?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
}

const FullWidthField = ({
  name,
  label,
  paddingBottom = "0",
  paddingLeft,
  paddingRight,
  paddingTop,
  placeHolder,
  maxRows,
  multiline = false,
  rows,
}: IProps) => {
  const [input, meta] = useField(name);
  const formik = useFormikContext();

  const error = Boolean(meta.touched && !!meta.error);
  const helperText = (meta.touched && meta.error) || " ";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        mr: { xs: 0, lg: 2 },
        pb: `${paddingBottom}px`,
      }}
    >
      <Typography sx={{ width: "180px", mb: 2 }} variant="subtitle2">
        {label}
      </Typography>
      <TextField
        {...formik.getFieldProps(name)}
        error={error}
        helperText={helperText}
        multiline={multiline}
        fullWidth
        maxRows={maxRows}
        rows={rows}
        sx={{
          flexGrow: 1,
          "& .MuiInputBase-root": {
            padding: 0,
            backgroundColor: "hsla(0, 0%, 98%, 1)",
            height: "40px",
            fontSize: "14px",
          },
          "& .MuiInputBase-input": {
            paddingLeft: 2,
          },
        }}
        name={name}
        placeholder={placeHolder}
      />
    </Box>
  );
};

export default FullWidthField;
