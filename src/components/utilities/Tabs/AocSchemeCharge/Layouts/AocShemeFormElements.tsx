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
import handleError from "@utils/handleError";
import { Form, FormikProvider, useFormik } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAccountOpeningMutation } from "services/accountopen.service";
import * as Yup from "yup";

interface Props {
  closeHandle: () => void;
  open: boolean;
}
const AocShemeFormElements = () => {
  const [accountOpening] = useAccountOpeningMutation();

  document.addEventListener('wheel', (event: WheelEvent) => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.type === 'number' && activeElement === event.target) {
      event.preventDefault();
    }
  }, { passive: false })
  
  const formik = useFormik({
    initialValues: {
      scheme_code: "",
      scheme_name: "",
      scheme_desc: "",
      charges: 0,
      active: true,
      group_code: "",
      bo_scheme_code: "",
      // is_for_promo_code_only: true,
      // product_code: "",
    },
    validationSchema: Yup.object().shape({
      scheme_code: Yup.string().required("Scheme Code is required"),
      scheme_name: Yup.string().required("Scheme Name is required"),
      scheme_desc: Yup.string().required("Scheme Description is required"),
      charges: Yup.string().required("Charges are required"),
      active: Yup.string().required("Is Active required"),
      group_code: Yup.string().required("Group Code is required"),
      bo_scheme_code: Yup.string().required("BO Scheme Code is required"),
      // is_for_promo_code_only: Yup.string().required("For Promo Code is required"),
      // product_code: Yup.string().required("Product Code is required"),
    }),
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        const response = await accountOpening(values).unwrap();
        toast.success(response.message);
      } catch (error) {
        handleError(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        {/* <Dialog
          fullWidth={true}
          maxWidth="xl"
          open={open}
          onClose={closeHandle}
          // PaperProps={{
          //   sx: {
          //     width: "min(100%, 500px)",
          //   },
          // }}
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
          <DialogTitle>Add Scheme</DialogTitle>
          <DialogContent> */}
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
                  <Typography variant="subtitle2">Scheme Name</Typography>
                  <TextField
                    inputProps={{ maxLength: 200 }}
                    name="scheme_name"
                    type="text"
                    fullWidth
                    placeholder="Enter Scheme Name"
                    error={Boolean(formik.touched.scheme_name && formik.errors.scheme_name)}
                    helperText={(formik.touched.scheme_name && formik.errors.scheme_name) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.scheme_name}
                  ></TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Scheme Code</Typography>
                  <TextField
                  inputProps={{ maxLength: 200 }}
                    name="scheme_code"
                    fullWidth
                    type="text"
                    placeholder="Enter Scheme Code"
                    error={Boolean(formik.touched.scheme_code && formik.errors.scheme_code)}
                    helperText={(formik.touched.scheme_code && formik.errors.scheme_code) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.scheme_code}
                  ></TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Scheme Description</Typography>
                  <TextField
                  inputProps={{ maxLength: 200 }}
                    name="scheme_desc"
                    type="text"
                    fullWidth
                    error={Boolean(formik.touched.scheme_desc && formik.errors.scheme_desc)}
                    helperText={(formik.touched.scheme_desc && formik.errors.scheme_desc) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.scheme_desc}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Group Code</Typography>
                  <TextField
                  inputProps={{ maxLength: 200 }}
                    name="group_code"
                    fullWidth
                    type="text"
                    placeholder="Enter Group Code"
                    error={Boolean(formik.touched.group_code && formik.errors.group_code)}
                    helperText={(formik.touched.group_code && formik.errors.group_code) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.group_code}
                  ></TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">BO Scheme Code</Typography>
                  <TextField
                  inputProps={{ maxLength: 200 }}
                    fullWidth
                    name="bo_scheme_code"
                    type="bo_scheme_code"
                    placeholder="Enter BO Scheme Code"
                    error={Boolean(formik.touched.bo_scheme_code && formik.errors.bo_scheme_code)}
                    helperText={
                      (formik.touched.bo_scheme_code && formik.errors.bo_scheme_code) || " "
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bo_scheme_code}
                  />
                </Box>
                {/* <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Product Code</Typography>
                  <TextField
                  inputProps={{ maxLength: 200 }}
                    fullWidth
                    name="product_code"
                    type="product_code"
                    placeholder="Enter Product Code"
                    error={Boolean(formik.touched.product_code && formik.errors.product_code)}
                    helperText={(formik.touched.product_code && formik.errors.product_code) || " "}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.product_code}
                  />
                </Box> */}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Active</Typography>
                  <TextField
                    name="active"
                    fullWidth
                    select
                    error={Boolean(formik.touched.active && formik.errors.active)}
                    helperText={(formik.touched.active && formik.errors.active) || " "}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value === "true" ? true : false;
                      formik.setFieldValue("active", value);
                    }}
                    value={formik.values.active}
                  >
                    <MenuItem value="true"> Yes</MenuItem>
                    <MenuItem value="false"> No</MenuItem>
                  </TextField>
                </Box>
                {/* <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Is for Promo Code Only</Typography>
                  <TextField
                    name="is_for_promo_code_only"
                    fullWidth
                    select
                    error={Boolean(
                      formik.touched.is_for_promo_code_only && formik.errors.is_for_promo_code_only
                    )}
                    helperText={
                      (formik.touched.is_for_promo_code_only &&
                        formik.errors.is_for_promo_code_only) ||
                      " "
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value === "true" ? true : false;
                      formik.setFieldValue("is_for_promo_code_only", value);
                    }}
                    value={formik.values.is_for_promo_code_only}
                  >
                    <MenuItem value="true"> Yes</MenuItem>
                    <MenuItem value="false"> No</MenuItem>
                  </TextField>
                </Box> */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Charges</Typography>
                  <TextField
                    fullWidth
                    name="charges"
                    type="number"
                    placeholder="Enter Charges"
                    error={Boolean(formik.touched.charges && formik.errors.charges)}
                    helperText={(formik.touched.charges && formik.errors.charges) || " "}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      formik.setFieldValue("charges", value);
                    }}
                    value={formik.values.charges}
                  />
                </Box>
              </Box>
              <Button
                sx={{
                  height: "52px",
                  width: { xs: "auto", md: "fit-content" },
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
          {/* </DialogContent>
        </Dialog> */}
      </FormikProvider>
    </>
  );
};
export default AocShemeFormElements;

