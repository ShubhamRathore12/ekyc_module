import useWindowDimensions from "@hooks/useWindowDimensions";
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from "@mui/material";
import handleError from "@utils/handleError";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useBrokerageSchemeListQuery,
  useBrokSchemeDetailsQuery,
  useUpdateBrokSchemeMutation,
} from "services/accountopen.service";
import { BScheme, Scheme, UpdateBrokSchemeRequest } from "types/account";
import * as Yup from "yup";

const ModifyBrokerageScheme = () => {
  const { height, width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [selectedBrokCode, setSelectedBrokCode] = React.useState<string>("");
  const [updateBrokScheme] = useUpdateBrokSchemeMutation();
  const { data, error, isLoading } = useBrokerageSchemeListQuery({});

  const brokSchemeList: Scheme[] = data?.data?.schemes || [];

  useEffect(() => {
    toast("⚠️ Please select the scheme code");
  }, []);

  React.useEffect(() => {
    return setWindowWidth(width);
  }, [width]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = e.target.value;
    formik.setFieldValue(e.target.name, value);
    if (e.target.name === "scheme_code") {
      setSelectedBrokCode(value);
    }
  };

  const {
    data: brokSchemeDetails,
    error: brokSchemeDetailsError,
    isLoading: brokSchemeDetailsLoading,
  } = useBrokSchemeDetailsQuery(selectedBrokCode, {
    skip: !selectedBrokCode,
  });

  useEffect(() => {
    if (
      brokSchemeDetails &&
      brokSchemeDetails?.data &&
      brokSchemeDetails?.data.schemes &&
      brokSchemeDetails?.data.schemes.length > 0
    ) {
      const scheme = brokSchemeDetails?.data.schemes[0];
      for (const key in scheme) {
        if (Object.prototype.hasOwnProperty.call(scheme, key)) {
          formik.setFieldValue(key, scheme[key as keyof BScheme]);
        }
      }
    }
  }, [brokSchemeDetails]);

  const formik = useFormik<UpdateBrokSchemeRequest>({
    initialValues: {
      scheme_code: "",
      scheme_name: "",
      scheme_desc: "",
      active: true,
      // charges: 0,
      // chargeable_for_account_opening:0,
      margin_amount: 0,
      // discount: 0,
      jobbing_perc: 0,
      jobbing_max: 0,
      delivery_max: 0,
      delivery_min: 0,
      derivative_perc: 0,
      derivative_max: 0,
      derivative_opt_perc: 0,
      derivative_opt_min: 0,
      derivative_opt_max: 0,
      derivative_opt_stx_perc: 0,
      derivative_opt_stx_min: 0,
      derivative_opt_stx_max: 0,
      curr_perc: 0,
      curr_min: 0,
      curr_opt_perc: 0,
      curr_opt_min: 0,
      curr_opt_max: 0,
      commodity_perc: 0,
      commodity_min: 0,
      commodity_opt_perc: 0,
      commodity_opt_min: 0,
      commodity_opt_max: 0,
      // product_code: "",
      // is_for_promo_code_only: true
    },
    validationSchema: Yup.object().shape({
      scheme_code: Yup.string().required("Scheme Code is required"),
      scheme_name: Yup.string().required("Scheme Name is required"),
      scheme_desc: Yup.string().required("Scheme Description is required"),
      active: Yup.boolean().required("Is Active required"),
      // charges: Yup.number().required("Charges are required"),
      // chargeable_for_account_opening:Yup.number().required("Chargeable amount required"),
      margin_amount: Yup.number().required("Margin Amount is required"),
      // discount: Yup.number().required("Discount is required"),

      jobbing_perc: Yup.number()
        // .min(0.009, 'Equity Job % must be at least 0.009')
        // .max(2.5, 'Equity Job % must be at most 2.5')
        // .test('is-decimal', 'Equity Job % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Equity Job % is required"),

      jobbing_max: Yup.number()
        // .min(0.01, 'Equity Job Min must be at least 0.01')
        // .max(0.25, 'Equity Job Min must be at most 0.25')
        // .test('is-decimal', 'Equity Job Min must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Equity Job Min is required"),

      delivery_max: Yup.number()
        // .min(0.09, 'Equity Delivery % must be at least 0.09')
        // .max(2.5, 'Equity Delivery % must be at most 2.5')
        // .test('is-decimal', 'Equity Delivery % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Equity Delivery % is required"),

      delivery_min: Yup.number()
        // .min(0.01, 'Equity Delivery Min must be at least 0.01')
        // .max(0.25, 'Equity Delivery Min must be at most 0.25')
        // .test('is-decimal', 'Equity Delivery Min must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Equity Delivery Min is required"),

      derivative_perc: Yup.number()
        // .min(0.008, 'Derivative Future % must be at least 0.008')
        // .max(2.5, 'Derivative Future % must be at most 2.5')
        // .test('is-decimal', 'Derivative Future % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Derivtive Future % is required"),

      derivative_max: Yup.number().required("Derivative Future Min is required"),

      derivative_opt_perc: Yup.number()
        // .min(0.008, 'Derivative option % must be at least 0.008')
        // .max(2.5, 'Derivative option % must be at most 2.5')
        // .test('is-decimal', 'Derivative option % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Derivative option % is required"),

      derivative_opt_min: Yup.number()
        // .min(25, 'Derivative option min must be at least 25')
        // .max(75, 'Derivative option min must be at most 75')
        // .test('is-decimal', 'Derivative option min must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Derivative option min is required"),

      derivative_opt_max: Yup.number()
        // .min(Yup.ref('derivative_opt_min'),
        // 'Derivative option max must be at least the value of Derivative option min')
        // .max(75, 'Derivative option max must be at most 75')
        // .test('is-decimal', 'Derivative option max must have at most 3 decimal places', value => {
        //   return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Derivative Option Max is required"),

      curr_perc: Yup.number()
        // .min(0.006, 'Currency Future % must be at least 0.006')
        // .max(2.5, 'Currency Future % must be at most 2.5')
        // .test('is-decimal', 'Currency Future % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Currency Future % is required"),

      curr_min: Yup.number().required("Currency Future Min is required"),
      curr_opt_perc: Yup.number()
        // .min(0.008, 'Currency option % must be at least 0.008')
        // .max(2.5, 'Currency option % must be at most 2.5')
        // .test('is-decimal', 'Currency option % must have at most 3 decimal places', value => {
        //   return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Currency option % is required"),

      curr_opt_min: Yup.number()
        // .min(8, 'Currency option Min must be at least 8')
        // .max(20, 'Currency option Min must be at most 20')
        // .test('is-decimal', 'Currency option Min must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Currency option Min is required"),

      curr_opt_max: Yup.number()
        // .min(Yup.ref('curr_opt_min'),
        // 'Currency option max must be at least the value of Currency option min')
        // .max(20, 'Currency option max must be at most 20')
        // .test('is-decimal', 'Currency option max must have at most 3 decimal places', value => {
        //   return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Currency Option Max is required"),

      commodity_perc: Yup.number()
        // .min(0.006, 'Commodity Future % must be at least 0.006')
        // .max(2.5, 'Commodity Future % must be at most 2.5')
        // .test('is-decimal', 'Commodity Future % must have at most 3 decimal places', value => {
        //  return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Commodity Future % is required"),
      commodity_min: Yup.number().required("Commodity Future Min is required"),
      commodity_opt_perc: Yup.number()
        // .min(2.5, 'Commodity option % must be at least 2.5')
        // .max(2.5, 'Commodity option % must be at most 2.5')
        // .test('is-decimal', 'Commodity option % must have at most 3 decimal places', value => {
        //   return value === undefined || /^\d+(\.\d{1,3})?$/.test(String(value));
        // })
        .required("Commodity Future % is required"),
      commodity_opt_min: Yup.number().required("Commodity option min is required"),
      commodity_opt_max: Yup.number().required("Commodity option Max is required"),
      // product_code : Yup.string().required("Product Code is required"),
      // is_for_promo_code_only : Yup.string().required("For Promo Code is required"),
    }),

    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        const res = await updateBrokScheme(values).unwrap();
        toast.success(res?.message);
      } catch (error) {
        handleError(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              flexDirection: { xs: "column", md: "row" },
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
                  name="scheme_code"
                  fullWidth
                  select
                  error={Boolean(formik.touched.scheme_code && formik.errors.scheme_code)}
                  onChange={handleChange}
                  value={formik.values.scheme_code}
                >
                  <MenuItem value="" disabled>
                    Select a scheme
                  </MenuItem>
                  {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                  {error && <MenuItem disabled>Error loading schemes</MenuItem>}
                  {!isLoading && !error && brokSchemeList.length > 0
                    ? brokSchemeList.map((scheme) => (
                        <MenuItem key={scheme.scheme_code} value={scheme.scheme_code}>
                          {scheme.scheme_name}
                        </MenuItem>
                      ))
                    : !isLoading && !error && <MenuItem disabled>No schemes available</MenuItem>}
                </TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Scheme Code</Typography>
                <TextField
                  name="scheme_name"
                  disabled
                  value={formik.values.scheme_code}
                ></TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Scheme Name</Typography>
                <TextField
                  name="scheme_name"
                  placeholder="Enter Scheme Name"
                  inputProps={{ maxLength: 200 }}
                  error={Boolean(formik.touched.scheme_name && formik.errors.scheme_name)}
                  onChange={formik.handleChange}
                  value={formik.values.scheme_name}
                  helperText={(formik.touched.scheme_name && formik.errors.scheme_name) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Scheme Description</Typography>
                <TextField
                  name="scheme_desc"
                  placeholder="Enter Scheme Description"
                  inputProps={{ maxLength: 200 }}
                  error={Boolean(formik.touched.scheme_desc && formik.errors.scheme_desc)}
                  onChange={formik.handleChange}
                  value={formik.values.scheme_desc}
                  helperText={(formik.touched.scheme_desc && formik.errors.scheme_desc) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Margin Amount</Typography>
                <TextField
                  name="margin_amount"
                  placeholder="Enter Margin Amount"
                  error={Boolean(formik.touched.margin_amount && formik.errors.margin_amount)}
                  value={formik.values.margin_amount}
                  helperText={(formik.touched.margin_amount && formik.errors.margin_amount) || " "}
                  onBlur={formik.handleBlur}
                  type="number"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    formik.setFieldValue("margin_amount", value);
                  }}
                ></TextField>
              </Box>
              {/* <Box sx={{ flex: 1 }}>  
      <Typography variant="subtitle2">Product Code</Typography>
        <TextField name="product_code"  placeholder="Enter Product Code"
        inputProps={{ maxLength: 200 }}
         error={Boolean(formik.touched.product_code && formik.errors.product_code)}
         onChange={formik.handleChange} value={formik.values.product_code}
         helperText={(formik.touched.product_code && formik.errors.product_code) || " "}
         onBlur={formik.handleBlur} ></TextField>
      </Box> */}
              {/* <Box sx={{ flex: 1 }}>  
      <Typography variant="subtitle2">Charges</Typography>
        <TextField name="charges"  placeholder="Enter Charges"
         error={Boolean(formik.touched.charges && formik.errors.charges)}
         value={formik.values.charges}
         helperText={(formik.touched.charges && formik.errors.charges) || " "}
         onBlur={formik.handleBlur} 
         type="number"
         onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          formik.setFieldValue('charges', value);
        }}></TextField>
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
              {/* <Box sx={{ flex: 1 }}>  
      <Typography variant="subtitle2">Chargeable for account opening</Typography>
        <TextField name="chargeable_for_account_opening"  placeholder="Enter charges for account opening"
         error={Boolean(formik.touched.chargeable_for_account_opening && formik.errors.chargeable_for_account_opening)}
         value={formik.values.chargeable_for_account_opening}
         helperText={(formik.touched.chargeable_for_account_opening && formik.errors.chargeable_for_account_opening) || " "}
         onBlur={formik.handleBlur} 
         type="number"
         onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          formik.setFieldValue('chargeable_for_account_opening', value);
        }}></TextField>
      </Box> */}

              {/* <Box sx={{ flex: 1 }}>  
      <Typography variant="subtitle2">Discount</Typography>
        <TextField name="discount"  placeholder="Enter Discount"
         error={Boolean(formik.touched.discount && formik.errors.discount)}
         value={formik.values.discount}
         helperText={(formik.touched.discount && formik.errors.discount) || " "}
         onBlur={formik.handleBlur} 
         type="number"
         onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          formik.setFieldValue('discount', value);
        }}></TextField>
      </Box> */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Equity Job %</Typography>
                <TextField
                  name="jobbing_perc"
                  placeholder="Enter Equity Job %"
                  error={Boolean(formik.touched.jobbing_perc && formik.errors.jobbing_perc)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("jobbing_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.jobbing_perc}
                  helperText={(formik.touched.jobbing_perc && formik.errors.jobbing_perc) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Equity Job Min</Typography>
                <TextField
                  name="jobbing_max"
                  placeholder="Enter Equity Job Min"
                  error={Boolean(formik.touched.jobbing_max && formik.errors.jobbing_max)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("jobbing_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.jobbing_max}
                  helperText={(formik.touched.jobbing_max && formik.errors.jobbing_max) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Equity Delivery %</Typography>
                <TextField
                  name="delivery_max"
                  placeholder="Enter Equity Delivery %"
                  error={Boolean(formik.touched.delivery_max && formik.errors.delivery_max)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("delivery_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.delivery_max}
                  helperText={(formik.touched.delivery_max && formik.errors.delivery_max) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Equity Delivery min</Typography>
                <TextField
                  name="delivery_min"
                  placeholder="Enter Equity Delivery min"
                  error={Boolean(formik.touched.delivery_min && formik.errors.delivery_min)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("delivery_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.delivery_min}
                  helperText={(formik.touched.delivery_min && formik.errors.delivery_min) || " "}
                  onBlur={formik.handleBlur}
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
                <Typography variant="subtitle2">Derivative Future %</Typography>
                <TextField
                  name="derivative_perc"
                  placeholder="Enter Derivative Future %"
                  error={Boolean(formik.touched.derivative_perc && formik.errors.derivative_perc)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_perc}
                  helperText={
                    (formik.touched.derivative_perc && formik.errors.derivative_perc) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative Future Min</Typography>
                <TextField
                  name="derivative_max"
                  placeholder="Enter Derivative Future min"
                  error={Boolean(formik.touched.derivative_max && formik.errors.derivative_max)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_max}
                  helperText={
                    (formik.touched.derivative_max && formik.errors.derivative_max) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option index %</Typography>
                <TextField
                  name="derivative_opt_perc"
                  placeholder="Enter Derivative option %"
                  error={Boolean(
                    formik.touched.derivative_opt_perc && formik.errors.derivative_opt_perc
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_perc}
                  helperText={
                    (formik.touched.derivative_opt_perc && formik.errors.derivative_opt_perc) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option index min</Typography>
                <TextField
                  name="derivative_opt_min"
                  placeholder="Enter Derivative option min"
                  error={Boolean(
                    formik.touched.derivative_opt_min && formik.errors.derivative_opt_min
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_min}
                  helperText={
                    (formik.touched.derivative_opt_min && formik.errors.derivative_opt_min) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option index max</Typography>
                <TextField
                  name="derivative_opt_max"
                  placeholder="Enter Derivative option max"
                  error={Boolean(
                    formik.touched.derivative_opt_max && formik.errors.derivative_opt_max
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_max}
                  helperText={
                    (formik.touched.derivative_opt_max && formik.errors.derivative_opt_max) || " "
                  }
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.derivative_opt_min}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option stocks %</Typography>
                <TextField
                  name="derivative_opt_stx_perc"
                  placeholder="Enter Derivative option %"
                  error={Boolean(
                    formik.touched.derivative_opt_stx_perc && formik.errors.derivative_opt_stx_perc
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_stx_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_stx_perc}
                  helperText={
                    (formik.touched.derivative_opt_stx_perc &&
                      formik.errors.derivative_opt_stx_perc) ||
                    " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option stocks min</Typography>
                <TextField
                  name="derivative_opt_stx_min"
                  placeholder="Enter Derivative option min"
                  error={Boolean(
                    formik.touched.derivative_opt_stx_min && formik.errors.derivative_opt_stx_min
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_stx_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_stx_min}
                  helperText={
                    (formik.touched.derivative_opt_stx_min &&
                      formik.errors.derivative_opt_stx_min) ||
                    " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Derivative option stocks max</Typography>
                <TextField
                  name="derivative_opt_stx_max"
                  placeholder="Enter Derivative option max"
                  error={Boolean(
                    formik.touched.derivative_opt_stx_max && formik.errors.derivative_opt_stx_max
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("derivative_opt_stx_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.derivative_opt_stx_max}
                  helperText={
                    (formik.touched.derivative_opt_stx_max &&
                      formik.errors.derivative_opt_stx_max) ||
                    " "
                  }
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.derivative_opt_stx_min}
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
                <Typography variant="subtitle2">Currency Future %</Typography>
                <TextField
                  name="curr_perc"
                  placeholder="Currency Future %"
                  error={Boolean(formik.touched.curr_perc && formik.errors.curr_perc)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("curr_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.curr_perc}
                  helperText={(formik.touched.curr_perc && formik.errors.curr_perc) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Currency Future min</Typography>
                <TextField
                  name="curr_min"
                  placeholder="Enter Currency Future min"
                  error={Boolean(formik.touched.curr_min && formik.errors.curr_min)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("curr_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.curr_min}
                  helperText={(formik.touched.curr_min && formik.errors.curr_min) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Currency option %</Typography>
                <TextField
                  name="curr_opt_perc"
                  placeholder="Enter Currency option %"
                  error={Boolean(formik.touched.curr_opt_perc && formik.errors.curr_opt_perc)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("curr_opt_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.curr_opt_perc}
                  helperText={(formik.touched.curr_opt_perc && formik.errors.curr_opt_perc) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Currency option min</Typography>
                <TextField
                  name="curr_opt_min"
                  placeholder="Enter Currency option min"
                  error={Boolean(formik.touched.curr_opt_min && formik.errors.curr_opt_min)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("curr_opt_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.curr_opt_min}
                  helperText={(formik.touched.curr_opt_min && formik.errors.curr_opt_min) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Currency option max</Typography>
                <TextField
                  name="curr_opt_max"
                  placeholder="Enter Currency option max"
                  error={Boolean(formik.touched.curr_opt_max && formik.errors.curr_opt_max)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("curr_opt_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.curr_opt_max}
                  helperText={(formik.touched.curr_opt_max && formik.errors.curr_opt_max) || " "}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.curr_opt_min}
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
                <Typography variant="subtitle2">Commodity Future %</Typography>
                <TextField
                  name="commodity_perc"
                  placeholder="Enter Commodity Future %"
                  error={Boolean(formik.touched.commodity_perc && formik.errors.commodity_perc)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("commodity_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.commodity_perc}
                  helperText={
                    (formik.touched.commodity_perc && formik.errors.commodity_perc) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Commodity Future Min</Typography>
                <TextField
                  name="commodity_min"
                  placeholder="Enter Commodity Future Min"
                  error={Boolean(formik.touched.commodity_min && formik.errors.commodity_min)}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("commodity_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.commodity_min}
                  helperText={(formik.touched.commodity_min && formik.errors.commodity_min) || " "}
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Commodity option %</Typography>
                <TextField
                  name="commodity_opt_perc"
                  placeholder="Enter Commodity option %"
                  error={Boolean(
                    formik.touched.commodity_opt_perc && formik.errors.commodity_opt_perc
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("commodity_opt_perc", parseFloat(value));
                    }
                  }}
                  value={formik.values.commodity_opt_perc}
                  helperText={
                    (formik.touched.commodity_opt_perc && formik.errors.commodity_opt_perc) || " "
                  }
                  onBlur={formik.handleBlur}
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
                <Typography variant="subtitle2">Commodity option min</Typography>
                <TextField
                  name="commodity_opt_min"
                  placeholder="Enter Commodity option min"
                  error={Boolean(
                    formik.touched.commodity_opt_min && formik.errors.commodity_opt_min
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("commodity_opt_min", parseFloat(value));
                    }
                  }}
                  value={formik.values.commodity_opt_min}
                  helperText={
                    (formik.touched.commodity_opt_min && formik.errors.commodity_opt_min) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Commodity option max</Typography>
                <TextField
                  name="commodity_opt_max"
                  placeholder="Commodity option max"
                  error={Boolean(
                    formik.touched.commodity_opt_max && formik.errors.commodity_opt_max
                  )}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      formik.setFieldValue("commodity_opt_max", parseFloat(value));
                    }
                  }}
                  value={formik.values.commodity_opt_max}
                  helperText={
                    (formik.touched.commodity_opt_max && formik.errors.commodity_opt_max) || " "
                  }
                  onBlur={formik.handleBlur}
                ></TextField>
              </Box>
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
              {/* <Box sx={{ flex: 1}}>
                  <Typography variant="subtitle2">Is fo Promo Code Only</Typography>
                  <TextField
                    name="is_for_promo_code_only"
                    fullWidth
                    select
                    error={Boolean(formik.touched.is_for_promo_code_only && formik.errors.is_for_promo_code_only)}
                    helperText={(formik.touched.is_for_promo_code_only && formik.errors.is_for_promo_code_only) || " "}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value === 'true' ? true : false;
                      formik.setFieldValue('is_for_promo_code_only', value);
                    }}
                    value={formik.values.is_for_promo_code_only}
                  >
                    <MenuItem value="true"> Yes</MenuItem>
                    <MenuItem value="false"> No</MenuItem>
                  </TextField>
                </Box> */}
            </Box>
          </Box>
        </Box>
        <Button type="submit" variant="contained" sx={{ my: 2 }} disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <CircularProgress /> : "Submit"}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default ModifyBrokerageScheme;
