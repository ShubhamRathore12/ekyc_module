import GuestGuard from "@components/auth/GuestGuard";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "@public/Logo.png";
import { FormikProvider, useFormik } from "formik";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNewPasswordMutation } from "services/admin.service";
import * as Yup from "yup";
import YupPassword from "yup-password";
const NewPassword: NextPage = () => {
  YupPassword(Yup);
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
  const router = useRouter();
  const username = router.query.username as string;
  const old_password = router.query.old_password as string;

  React.useEffect(() => {
    if (router.isReady && (!username || !old_password)) {
      router.replace("/signin");
      // TODO: change this later
      toast.error("please re enter credentials");
    }
  }, [router, username, old_password]);
  const [NewPasswordMutation] = useNewPasswordMutation();
  const formik = useFormik({
    initialValues: {
      username,
      old_password,
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object().shape({
      new_password: Yup.string()
        .required("New password is required")
        .notOneOf(
          [Yup.ref("old_password")],
          "New password should not be the same as the old password"
        )
        .min(8, "password must contain 8 or more characters")
        .minLowercase(1, "password must contain at least 1 lower case letter")
        .minUppercase(1, "password must contain at least 1 upper case letter")
        .minNumbers(1, "password must contain at least 1 number")
        .minSymbols(1, "password must contain at least 1 special character"),
      confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("new_password")], "Confirm should be the same as the new password"),
    }),
    async onSubmit(values, helpers) {
      helpers.setSubmitting(true);
      try {
        const res = await NewPasswordMutation(values).unwrap();
        toast.success(res.message);
        router.push("/signin");
      } catch (error) {
        toast.error((error as any)?.error || "Something went wrong");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ position: "relative", bgcolor: "#FFFF" }}>
      <Box
        sx={{
          top: 0,
          left: 0,
          p: 2,
          position: "absolute",
        }}
      >
        <Image src={Logo} height={70} width={220} alt="stoxcart logo" />
      </Box>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <FormikProvider value={formik}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, xl: 3 },
              margin: "auto",
            }}
          >
            <Typography variant="h4">Hello Admin</Typography>
            <Typography variant="subtitle1" sx={{ mb: { xs: 2, xl: 4 } }}>
              {/* write here */}
              Cillum cillum commodo magna exercitation.
            </Typography>
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
              type={showPassword1 ? "text" : "password"}
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
            <Typography>Confirm Password</Typography>
            <TextField
              variant="outlined"
              name="confirm_password"
              error={Boolean(formik.touched.confirm_password && formik.errors.confirm_password)}
              helperText={
                (formik.touched.confirm_password && formik.errors.confirm_password) || " "
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              id="adornment-password"
              placeholder="password"
              type={showPassword2 ? "text" : "password"}
              value={formik.values.confirm_password}
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
          </Box>
        </FormikProvider>
      </Container>
    </Box>
  );
};

NewPassword.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default NewPassword;
