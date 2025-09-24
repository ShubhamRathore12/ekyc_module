import { useDispatch } from "store";

import AuthGuard from "@components/auth/AuthGuard";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { useAuth } from "@hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { NextPage } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import { useChangePasswordMutation } from "services/admin.service";
import appSlice from "slices/app.slice";
import authSlice from "slices/auth.slice";
import * as Yup from "yup";
import YupPassword from "yup-password";
const ChangePassword: NextPage = () => {
  YupPassword(Yup);
  const { login } = useAuth();
  const [password1, setPassword1] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [submitClick, setSubmitClick] = useState(false);
  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);

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
  const [changePassword] = useChangePasswordMutation();
  const logout = () => dispatch(authSlice.actions.logout());
  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
    },
    validationSchema: Yup.object().shape({
      old_password: Yup.string().required("old password is required"),
      new_password: Yup.string()
        .required("new password is required")
        .notOneOf(
          [Yup.ref("old_password")],
          "New password should not be the same as the old password"
        )
        .min(8, "password must contain 8 or more characters")
        .minLowercase(1, "password must contain at least 1 lower case letter")
        .minUppercase(1, "password must contain at least 1 upper case letter")
        .minNumbers(1, "password must contain at least 1 number")
        .minSymbols(1, "password must contain at least 1 special character"),
    }),
    async onSubmit(values, helpers) {
      helpers.setSubmitting(true);
      try {
        const res = await changePassword(values).unwrap();
        toast.success(res.message);
        logout();
      } catch (error) {
        toast.error((error as any)?.data?.error || "Something went wrong");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  const dispatch = useDispatch();
  const layoutBonds = dispatch(appSlice.getInitialState);

  return (
    <>
      <Box sx={{ position: "relative", bgcolor: "#FFFF", height: "100%" }}>
        {/* <Box
          sx={{
            top: 0,
            left: 0,
            p: 2,
            position: "absolute",
          }}
        >
          <Image src={Logo} height={70} width={220} alt="stoxcart logo" />
        </Box> */}
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <FormikProvider value={formik}>
            <Card
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              elevation={3}
              sx={{
                minWidth: "min(80%, 500px)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, xl: 3 },
                margin: "auto",
                p: 3,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <Typography variant="h6" sx={{}}>
                Hello {login?.data?.username}
              </Typography>
              {/* <Typography>User Name</Typography>
              <TextField
                variant="outlined"
                name="username"
                error={Boolean(formik.touched.username && formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder="Username"
                type="text"
                value={formik.values.username}
              /> */}
              <Typography>Old Password</Typography>
              <TextField
                variant="outlined"
                name="old_password"
                error={Boolean(formik.touched.old_password && formik.errors.old_password)}
                helperText={(formik.touched.old_password && formik.errors.old_password) || " "}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                id="adornment-password"
                placeholder="password"
                type={showPassword1 ? "text" : "password"}
                value={formik.values.old_password}
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
              <Typography>New Password</Typography>
              <TextField
                variant="outlined"
                name="new_password"
                error={Boolean(formik.touched.new_password && formik.errors.new_password)}
                helperText={(formik.touched.new_password && formik.errors.new_password) || " "}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                id="adornment-password"
                placeholder="password"
                type={showPassword2 ? "text" : "password"}
                value={formik.values.new_password}
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
              <Button
                disabled={formik.isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  height: { xs: "50px", xl: "76.29px" },
                  mt: { xs: 2.5, xl: 4.5 },
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                {formik.isSubmitting ? <CircularProgress /> : "Submit"}
              </Button>
            </Card>
          </FormikProvider>
        </Container>
      </Box>
    </>
  );
};

ChangePassword.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
export default ChangePassword;
