import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import close from "@public/assets/close.svg";
import { Form, FormikProvider, useFormik } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCreateAdminMutation } from "services/admin.service";
import * as Yup from "yup";
const AddUserModal = ({ closeHandle, open }: any) => {
  const [createAdmin, { isError, isLoading }] = useCreateAdminMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      phone_number: "",
      admin_type: "",
      email: "",
      location: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("User Name is required"),
      password: Yup.string().required("Password is required"),
      phone_number: Yup.string().required("Phone Number is required"),
      admin_type: Yup.string().required("Admin Type is required"),
      email: Yup.string().required("Email Type is required"),
      location: Yup.string().required("Location is required"),
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);

      // setTimeout(() => {
      //   helpers.setSubmitting(false);
      // // }, 2000);
      // if (isLoading)
      // if (isError) toast.error("error");
      try {
        const res = await createAdmin(values).unwrap();
        toast.success(res.message);
        closeHandle();
      } catch (error) {
        toast.error((error as any)?.data?.error || "Something went wrong");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  //
  return (
    <>
      <FormikProvider value={formik}>
        <Dialog
          open={open}
          onClose={closeHandle}
          PaperProps={{
            sx: {
              width: "min(100%, 500px)",
            },
          }}
        >
          <Button
            onClick={closeHandle}
            sx={{
              position: "absolute",
              right: 0,
              top: 10,
              zIndex: 1,
            }}
          >
            <Image src={close} alt="close" />
          </Button>
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <Box
              component={Form}
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Name</Typography>
                  <TextField
                    name="name"
                    fullWidth
                    type="text"
                    placeholder="Enter Your Name"
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    helperText={(formik.touched.name && formik.errors.name) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    inputProps={{ 
                      maxLength: 100,
                      autoComplete: 'off'
                    }}
                  ></TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">User Name</Typography>
                  <TextField
                    name="username"
                    type="text"
                    placeholder="Admin"
                    fullWidth
                    error={Boolean(formik.touched.username && formik.errors.username)}
                    helperText={(formik.touched.username && formik.errors.username) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    inputProps={{ 
                      maxLength: 50,
                      autoComplete: 'off'
                    }}
                  ></TextField>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2">Password</Typography>
                <TextField
                  name="password"
                  type="password"
                  fullWidth
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  helperText={(formik.touched.password && formik.errors.password) || " "}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  inputProps={{ 
                    maxLength: 128,
                    autoComplete: 'new-password'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Admin Type</Typography>
                  <TextField
                    name="admin_type"
                    select
                    fullWidth
                    error={Boolean(formik.touched.admin_type && formik.errors.admin_type)}
                    helperText={(formik.touched.admin_type && formik.errors.admin_type) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.admin_type}
                    inputProps={{ 
                      maxLength: 30,
                      autoComplete: 'off'
                    }}
                  >
                  <MenuItem value="kra"> KRA</MenuItem>
                  <MenuItem value="telecaller"> Telecaller</MenuItem>
                  <MenuItem value="backoffice">Backoffice</MenuItem>
                  <MenuItem value="grootsupport">Grootsupport</MenuItem>
                  <MenuItem value="lms_user">LMS User</MenuItem>
                  <MenuItem value="mf_user">Mutual Fund User</MenuItem>
                  <MenuItem value="sub_user">Subscription User</MenuItem>
                  <MenuItem value="stx_user"> Stoxkart Subscription User</MenuItem>

                </TextField>
              </Box>
              <Box>
                <Box>
                  <Typography variant="subtitle2">Mobile No</Typography>
                    <TextField
                      name="phone_number"
                      fullWidth
                      type="tel"
                      placeholder="Enter Mobile No"
                      error={Boolean(formik.touched.phone_number && formik.errors.phone_number)}
                      helperText={(formik.touched.phone_number && formik.errors.phone_number) || " "}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.phone_number}
                      inputProps={{ 
                        maxLength: 15,
                        autoComplete: 'tel'
                      }}
                    ></TextField>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2">Email</Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="Enter Email ID"
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={(formik.touched.email && formik.errors.email) || " "}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  inputProps={{ 
                    maxLength: 254,
                    autoComplete: 'email'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Location</Typography>
                <TextField
                  name="location"
                  select
                  fullWidth
                  error={Boolean(formik.touched.location && formik.errors.location)}
                  helperText={(formik.touched.location && formik.errors.location) || " "}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.location}
                  inputProps={{ 
                    maxLength: 50,
                    autoComplete: 'off'
                  }}
                >
                  <MenuItem value="HO"> HO</MenuItem>
                  <MenuItem value="BOM"> BOM</MenuItem>
                  <MenuItem value="KOL">KOL</MenuItem>
                </TextField>
              </Box>
              <Button
                sx={{
                  height: "52px",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
                type="submit"
                disabled={formik.isSubmitting}
                variant="contained"
                fullWidth
              >
                {formik.isSubmitting ? <CircularProgress /> : "Submit"}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </FormikProvider>
    </>
  );
};
export default AddUserModal;
