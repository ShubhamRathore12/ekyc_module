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
  import { useEffect, useState } from "react";
  import toast from "react-hot-toast";
  import { useSchemeListQuery, useSchemeDetailsQuery, useUpdateSchemeMutation } from "services/accountopen.service";
  import { Scheme, SScheme } from "types/account";
  import * as Yup from "yup";
  
  interface Props{
    closeHandle:()=> void,
    open : boolean,
  }
  const ModifyAocScheme = () => {
    const { data, error, isLoading } = useSchemeListQuery();
    const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>("");
    const [updateScheme] = useUpdateSchemeMutation();
  
    const schemeList: Scheme[] = data?.data?.schemes || [];
  
    const {
      data: schemeDetails,
      error: schemeDetailsError,
      isLoading: schemeDetailsLoading,
    } = useSchemeDetailsQuery((selectedSchemeCode), {
      skip: !selectedSchemeCode,
    });
  
    useEffect(() => {
      if (schemeDetails?.data) {
        const scheme = schemeDetails.data;
        for (const key in scheme) {
          if (Object.prototype.hasOwnProperty.call(scheme, key)) {
            formik.setFieldValue(key, scheme[key as keyof SScheme]);
          }
        }
      }
    }, [schemeDetails]);
  
    const handleChange:React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
      const value = e.target.value;
      formik.setFieldValue(e.target.name, value);
      if (e.target.name === "scheme_list") {
        setSelectedSchemeCode(value);
      }
    };
  
    const formik = useFormik({
      initialValues: {
        scheme_list: "",
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
        scheme_list: Yup.string().required("Please select Scheme List"),
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
  
      onSubmit: async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const response = await updateScheme({
            ...values,
            product_code: "",
            is_for_promo_code_only: false
          }).unwrap();
          toast.success('Scheme updated successfully');
        } catch (error) {
          handleError(error);
        } finally {
          setSubmitting(false); 
        }
      },
    });
  
    return (
      <>
        <FormikProvider value={formik}>
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
                    <Typography variant="subtitle2">Scheme List</Typography>
                    <TextField
                      name="scheme_list"
                      fullWidth
                      select
                      error={Boolean(formik.touched.scheme_list && formik.errors.scheme_list)}
                      onChange={handleChange}
                      value={formik.values.scheme_list}
                    >
                      <MenuItem value="" disabled>
                        Select a scheme
                      </MenuItem>
                      {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                      {error && <MenuItem disabled>Error loading schemes</MenuItem>}
                      {!isLoading && !error && schemeList.length > 0
                        ? schemeList.map((scheme) => (
                            <MenuItem key={scheme?.scheme_code} value={scheme?.scheme_code}>
                              {scheme?.scheme_name}
                            </MenuItem>
                          ))
                        : !isLoading && !error && <MenuItem disabled>No schemes available</MenuItem>}
                    </TextField>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Scheme Code</Typography>
                    <TextField
                    inputProps={{ maxLength: 200 }}
                      name="scheme_code"
                      fullWidth
                      disabled
                      type="text"
                      error={Boolean(formik.touched.scheme_code && formik.errors.scheme_code)}
                      helperText={(formik.touched.scheme_code && formik.errors.scheme_code) || " "}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.scheme_code}
                    ></TextField>
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
                      type="text"
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
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Charges</Typography>
                    <TextField
                      name="charges"
                      fullWidth
                      type="number"
                      placeholder="Enter Charges"
                      error={Boolean(formik.touched.charges && formik.errors.charges)}
                      helperText={(formik.touched.charges && formik.errors.charges) || " "}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.charges}
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
                    <Typography variant="subtitle2">Active</Typography>
                    <TextField
                      name="active"
                      fullWidth
                      select
                      error={Boolean(formik.touched.active && formik.errors.active)}
                      onChange={(e) => {
                        const value = e.target.value === 'true' ? true : false;
                        formik.setFieldValue('active', value);
                      }}
                      value={formik.values.active}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </TextField>
                  </Box>
                  {/* <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Is For Promo Code Only</Typography>
                    <TextField
                      name="is_for_promo_code_only"
                      fullWidth
                      select
                      error={Boolean(formik.touched.is_for_promo_code_only && formik.errors.is_for_promo_code_only)}
                      onChange={(e) => {
                        const value = e.target.value === 'true' ? true : false;
                        formik.setFieldValue('is_for_promo_code_only', value);
                      }}
                      value={formik.values.is_for_promo_code_only}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </TextField>
                  </Box> */}
                  {/* <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Product Code</Typography>
                    <TextField
                    inputProps={{ maxLength: 200 }}
                      name="product_code"
                      fullWidth
                      type="text"
                      placeholder="Enter Product Code"
                      error={Boolean(formik.touched.product_code && formik.errors.product_code)}
                      helperText={(formik.touched.product_code && formik.errors.product_code) || " "}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.product_code}
                    />
                  </Box> */}
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
        </FormikProvider>
      </>
    );
  };
  
  export default ModifyAocScheme;
  