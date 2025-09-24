import AuthLayout from "@components/layouts/AuthLayout";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import PasswordUpdated from "@components/signin/PasswordUpdated";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import handleError from "@utils/handleError";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { authApi } from "services/auth.service";
import YupPassword from "yup-password";

interface IProps {
  setStage: React.Dispatch<React.SetStateAction<"init" | "otp-sent" | "generate">>;
  at: string;
}

const NewPassword = (props: IProps) => {
  YupPassword(Yup);
  const { setStage, at } = props;
  const [password1, setPassword1] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [submitClick, setSubmitClick] = useState(false);
  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange1(e: { target: { value: React.SetStateAction<string> } }) {
    setPassword1(e.target.value);
  }
  const handleMouseDownPassword1 = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };
  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  function handleChange2(e: { target: { value: React.SetStateAction<string> } }) {
    setPassword2(e.target.value);
  }
  const handleMouseDownPassword2 = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object().shape({
      new_password: Yup.string()
        .required("new password is required")
        .min(8, "password must contain 8 or more characters")
        .minLowercase(1, "password must contain at least 1 lower case letter")
        .minUppercase(1, "password must contain at least 1 upper case letter")
        .minNumbers(1, "password must contain at least 1 number")
        .minSymbols(1, "password must contain at least 1 special character"),
      confirm_password: Yup.string()
        .required("confirm password is required")
        .oneOf([Yup.ref("new_password")], "Confirm password should be the same as the new password")
        .min(8, "password must contain 8 or more characters")
        .minLowercase(1, "password must contain at least 1 lower case letter")
        .minUppercase(1, "password must contain at least 1 upper case letter")
        .minNumbers(1, "password must contain at least 1 number")
        .minSymbols(1, "password must contain at least 1 special character"),
    }),
    async onSubmit(values, helpers) {
      helpers.setSubmitting(true);
      try {
        setIsLoading(true);
        const res = await authApi.resetPassword({
          new_password: values.new_password,
          confirm_password: values.confirm_password,
          at: at,
        });
        toast.success(res?.data?.message);
        setSubmitClick(true);
        setIsLoading(false);
      } catch (error) {
        handleError(error);
        setIsLoading(false);
        setStage("init");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout>
      <Box
        sx={{
          //   mt: { xs: 6, sm: 6, md: 6, lg: 8 },
          //   width: { xs: "70%", lg: "80%" },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: { xs: 1, xl: 2 },
          margin: "auto",
        }}
      >
        {!submitClick ? (
          <FormikProvider value={formik}>
            <Box component={Form}>
              <Typography variant="h4" sx={{ mb: 5 }}>
                Hello Admin
              </Typography>
              <Box sx={{ height: "120px", display: "flex", gap: 2, flexDirection: "column" }}>
                <Typography>New Password</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="adornment-password"
                  placeholder="password"
                  type={showPassword1 ? "text" : "password"}
                  name="new_password"
                  error={Boolean(formik.touched.new_password && formik.errors.new_password)}
                  helperText={(formik.touched.new_password && formik.errors.new_password) || " "}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.new_password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={handleClickShowPassword1}
                          onMouseDown={handleMouseDownPassword1}
                        >
                          {showPassword1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ height: "120px", display: "flex", gap: 2, flexDirection: "column" }}>
                <Typography>Confirm Password</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="adornment-password"
                  placeholder="password"
                  type={showPassword2 ? "text" : "password"}
                  name="confirm_password"
                  error={Boolean(formik.touched.confirm_password && formik.errors.confirm_password)}
                  helperText={
                    (formik.touched.confirm_password && formik.errors.confirm_password) || " "
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword2}
                        >
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  height: "55px",
                  mt: 4.5,
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {formik.isSubmitting ? <CircularProgress /> : "Submit"}
              </Button>
            </Box>
          </FormikProvider>
        ) : (
          <>
            <PasswordUpdated />
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default NewPassword;
