import GuestGuard from "@components/auth/GuestGuard";
import AuthLayout from "@components/layouts/AuthLayout";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { authApi } from "services/auth.service";
import authSlice from "slices/auth.slice";
import { useDispatch } from "store";
import { LoginRequest } from "types/auth";
import * as Yup from "yup";

const SignIn: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const [step, setStep] = useState<"login" | "change-password">("login")

  const formik = useFormik<LoginRequest>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        // if (step === "login") {
        const response = await authApi.login(values);
        dispatch(authSlice.actions.login(response.data));
        // } else if (step === "change-password") {
        // hit change password api
        // }
      } catch (error) {
        const response = (error as any)?.response;
        toast.error(response?.data?.message || response?.data?.error || "Something went wrong");

        // if (response?.status === 'failed') {
        if (response?.data?.data?.password_changed === false) {
          // setStep("change-password");
          // masking the credentials in query
          router.push(
            `/new-password?username=${values.username}&old_password=${values.password}`,
            "/change-password"
          );
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Box component={Form}>
        <AuthLayout>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hello Admin
          </Typography>
          <Box>
            <Typography sx={{ mb: 2 }}>User Name</Typography>
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              helperText={(formik.touched.username && formik.errors.username) || " "}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              name="username"
              value={formik.values.username}
              fullWidth
              type="text"
            />
          </Box>
          <Box sx={{ height: "120px" }}>
            <Typography sx={{ mb: 2 }}>Password</Typography>
            <TextField
              name="password"
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={(formik.touched.password && formik.errors.password) || " "}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              fullWidth
              type="password"
            />
          </Box>
          <Typography
            component="a"
            href="/forgot-password"
            sx={{
              textAlign: "right",
              cursor: "pointer",
              color: "hsla(229, 67%, 55%, 1)",
            }}
          >
            Forgot your password?
          </Typography>
          <Button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            fullWidth
            variant="contained"
            sx={{
              height: "55px",
              mt: 6,
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
          >
            {formik.isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </AuthLayout>
      </Box>
    </FormikProvider>
  );
};

SignIn.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default SignIn;
