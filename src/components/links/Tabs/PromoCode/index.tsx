import InfoIcon from "@mui/icons-material/Info";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import handleError from "@utils/handleError";
import { Field, Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useBrokSchemeDetailsQuery,
  useGroupListQuery,
  useProductCodeListQuery,
  usePromoCodeDetailQuery,
  usePromoCodeLinkMutation,
  usePromoCodeListQuery,
  useSchemeDetailsQuery,
} from "services/accountopen.service";
import { GList } from "types/account";
import * as Yup from "yup";

interface Group {
  group: string;
  groupType: string;
  location: string;
}

interface Url {
  data: { link: string };
}

interface PromoCodeErrorData {
  error: string;
}

// const promoCodeProducts = ["FRANCHISE"];
const promoCodeProducts = ["FRANCHISE", "UJJIVAN", "NAINITAL"];

const PromoCode = () => {
  // const [groupList, setGroupList] = useState("");
  const [promoCodeLink] = usePromoCodeLinkMutation();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [specificPromoCode, setSpecificPromoCode] = useState<string[]>([]);
  const [url, setUrl] = useState<Url | null>(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>("");
  const [selectedBrokCode, setSelectedBrokCode] = React.useState<string>("");
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
    typeof error === "object" && error !== null && "data" in error;

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile_number: "",
      email: "",
      group: {
        group: "",
        groupType: "",
        location: "",
      },
      promo_code: "",
      product_code: "FRANCHISE",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .matches(/^[a-zA-Z ]+$/, "Name should only contain letters and spaces")
        .max(100, "Name can have a maximum of 100 characters")
        .test(
          "no-leading-trailing-spaces",
          "Name should not contain spaces at the beginning or end",
          (value) => {
            if (!value) return true;
            return value === value.trim();
          }
        ),

      mobile_number: Yup.string()
        .test("no-spaces", "Mobile number should not contain spaces", (value) => {
          if (!value) return true;
          return !/\s/.test(value);
        })
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

      email: Yup.string()
        .test("no-spaces-in-email", "Email should not contain spaces", (value) => {
          if (!value) return true;
          return !/\s/.test(value); // Check for any space
        })
        .test(
          "no-leading-trailing-spaces",
          "Email should not have spaces at the beginning or end",
          (value) => {
            if (!value) return true;
            return value === value.trim(); // Ensure no leading or trailing spaces
          }
        )
        .test("isValidEmail", "Please enter a valid email address", (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value); // Validate email format
        }),
      // group: Yup.string().required('Group is required'),
      promo_code: Yup.string().test(
        "promo-code",
        "Promo Code is required",
        (val, ctx) => !(promoCodeProducts.includes(ctx.parent.product_code) && !val)
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const formattedValues = {
        ...values,
        group: {
          group3: selectedGroup?.group,
          branch: selectedGroup?.groupType,
          location: selectedGroup?.location,
        },
      };
      try {
        const response = await promoCodeLink(formattedValues).unwrap();
        setUrl(response);
        toast.success("Link sent successfully");
        formik.resetForm();
      } catch (error) {
        handleError(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!promoCodeProducts.includes(formik.values.product_code)) {
      formik.setFieldValue("promo_code", "");
    }
  }, [formik.values.product_code]);

  const { data, error, isLoading } = useGroupListQuery();
  const groupList: GList[] = data?.data || [];


  const shouldSkipPromoDetail = useMemo(() => {
    const isPromoProduct = promoCodeProducts.includes(formik.values.product_code);
    const hasGroupData =
      selectedGroup?.group && selectedGroup?.groupType && selectedGroup?.location;
    return !isPromoProduct || !formik.values.promo_code || !hasGroupData;
  }, [
    formik.values.product_code,
    formik.values.promo_code,
    selectedGroup?.group,
    selectedGroup?.groupType,
    selectedGroup?.location,
  ]);
  

  const {
    data: promoCodeDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = usePromoCodeDetailQuery(selectedPromoCode, {
    skip: shouldSkipPromoDetail
  });
  
  

  const schemeMapping = promoCodeDetails?.data?.promo_codes[0]?.scheme_mapping;

  const handleChange = (selectedObject: any) => {
    if (selectedObject) {
      formik.setFieldValue("group", selectedObject.group);
      setSelectedGroup(selectedObject);
      setSelectedBrokCode("");
    }
  };

  const handleCopyClick = () => {
    if (url?.data?.link) {
      navigator.clipboard
        .writeText(url.data.link)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const handleClickOpen = () => {
    if (url && url.data && url.data.link) {
      window.open(url.data.link, "_blank");
    } else {
      console.error("URL not found");
    }
  };

  const handleInfoClick = (code: string, type: "account" | "brokerage") => {
    if (type === "account") {
      setSelectedSchemeCode(code);
    } else if (type === "brokerage") {
      setSelectedBrokCode(code);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDialogData(null);
    setSelectedSchemeCode(""); // Reset scheme code
    setSelectedBrokCode(""); // Reset brokerage code
  };

  const {
    data: schemeDetails,
    error: schemeDetailsError,
    isLoading: schemeDetailsLoading,
  } = useSchemeDetailsQuery(selectedSchemeCode, {
    skip: !selectedSchemeCode,
  });

  const {
    data: brokSchemeDetails,
    error: brokSchemeDetailsError,
    isLoading: brokSchemeDetailsLoading,
  } = useBrokSchemeDetailsQuery(selectedBrokCode, {
    skip: !selectedBrokCode,
  });

  const { data: promoCodeData, error: promoCodeError } = usePromoCodeListQuery({
    promo_code: formik.values.promo_code,
    group: selectedGroup?.group ?? "",
    branch: selectedGroup?.groupType ?? "",
    location: selectedGroup?.location ?? "",
    product_code: formik.values.product_code
  });

  const { data: productData, error: productError } = useProductCodeListQuery();

  const renderDetails = (data: Record<string, any>) => {
    return Object.keys(data).map((key) => (
      <Typography key={key}>
        <strong>{key.replace(/_/g, " ")}:</strong> {String(data[key])}
      </Typography>
    ));
  };

  useEffect(() => {
    if (promoCodeError) {
      setSpecificPromoCode([]);
    } else if (promoCodeData && Array.isArray(promoCodeData?.data)) {
      setSpecificPromoCode(promoCodeData?.data);
    }
  }, [promoCodeData, promoCodeError]);

  useEffect(() => {
    if (schemeDetailsError) {
      console.error("Error fetching scheme details:", schemeDetailsError);
      // Handle error (e.g., show a notification)
    }
    if (brokSchemeDetailsError) {
      console.error("Error fetching brokerage scheme details:", brokSchemeDetailsError);
      // Handle error (e.g., show a notification)
    }
  }, [schemeDetailsError, brokSchemeDetailsError]);

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
            bgcolor: "#FFFF",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Promo Code Link</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Name</Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Mobile No</Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="mobile_number"
                  type="text"
                  placeholder="Enter Mobile No"
                  error={Boolean(formik.touched.mobile_number && formik.errors.mobile_number)}
                  helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Email</Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="Enter Email ID"
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2">Product Code</Typography>
              <Field
                as={TextField}
                name="product_code"
                select
                fullWidth
                error={Boolean(formik.touched.product_code && formik.errors.product_code)}
                helperText={formik.touched.product_code && formik.errors.product_code}
                onChange={(event: { target: { value: any } }) => {
                  formik.handleChange(event);
                }}
              >
                {isFetchBaseQueryError(productError) && productError.data ? (
                  <MenuItem disabled>{(productError.data as PromoCodeErrorData).error}</MenuItem>
                ) : null}
                {Array.isArray(productData?.data) &&
                  productData?.data?.map((product) => (
                    <MenuItem key={product.product_code} value={product.product_code}>
                      {product.product_code}
                    </MenuItem>
                  ))}
              </Field>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Group 3</Typography>
              <Field
                as={TextField}
                name="group"
                fullWidth
                select
                error={Boolean(formik.touched.group && formik.errors.group)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const selectedObject = groupList.find((group) => group.group === value);
                  handleChange(selectedObject);
                }}
                value={formik.values.group}
                helperText={formik.touched.group && formik.errors.group}
              >
                <MenuItem value="" disabled>
                  Select a group 3
                </MenuItem>
                {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                {error && <MenuItem disabled>Error loading groups</MenuItem>}
                {!isLoading && !error && groupList.length > 0
                  ? groupList.map((group) => (
                      <MenuItem key={group.group} value={group.group}>
                        {group.group}
                      </MenuItem>
                    ))
                  : !isLoading && !error && <MenuItem disabled>No groups available</MenuItem>}
              </Field>
            </Box>
            {promoCodeProducts.includes(formik.values.product_code) && (
              <Box>
                <Typography variant="subtitle2">Promo Code</Typography>
                <Field
                  as={TextField}
                  name="promo_code"
                  select
                  fullWidth
                  error={Boolean(formik.touched.promo_code && formik.errors.promo_code)}
                  helperText={formik.touched.promo_code && formik.errors.promo_code}
                  onChange={(event: { target: { value: any } }) => {
                    const selectedValue = event.target.value;
                    formik.handleChange(event);
                    setSelectedPromoCode(selectedValue);
                  }}
                >
                  {isFetchBaseQueryError(promoCodeError) && promoCodeError.data ? (
                    <MenuItem disabled>
                      {(promoCodeError.data as PromoCodeErrorData).error}
                    </MenuItem>
                  ) : null}
                  {Array.isArray(specificPromoCode) &&
                    specificPromoCode?.map((promoCode) => (
                      <MenuItem key={promoCode} value={promoCode}>
                        {promoCode}
                      </MenuItem>
                    ))}
                </Field>
              </Box>
            )}

            {/* ```````````````````````ACCORDION`````````````````           */}

            <Box>
              {promoCodeProducts.includes(formik.values.product_code) &&
                formik.values.promo_code &&
                schemeMapping &&
                schemeMapping.map((scheme) => (
                  <Accordion key={scheme.account_opening_scheme_code}>
                    <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                      <Typography>{scheme.account_opening_scheme_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {/* Account Opening Scheme Code */}
                        <Grid item xs={12} md={6}>
                          <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Box display="flex" alignItems="center" mb={2}>
                              <Typography variant="subtitle1">
                                <strong>Account Opening Scheme Code:</strong>
                              </Typography>
                              <Typography marginLeft={1}>
                                {scheme.account_opening_scheme_code}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  handleInfoClick(scheme?.account_opening_scheme_code, "account")
                                }
                                size="small"
                                aria-label="account-info"
                                sx={{ marginLeft: 1 }}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>

                        {/* Brokerage Scheme Codes */}
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>Brokerage Scheme Codes:</strong>
                            </Typography>
                            <ul>
                              {scheme.brokerage_scheme_codes.map((brokerage) => (
                                <li key={brokerage.scheme_code}>
                                  <Box display="flex" alignItems="center">
                                    {brokerage.scheme_code} - {brokerage.scheme_name}
                                    <IconButton
                                      onClick={() =>
                                        handleInfoClick(brokerage.scheme_code, "brokerage")
                                      }
                                      size="small"
                                      aria-label="brokerage-info"
                                      sx={{ marginLeft: 1 }}
                                    >
                                      <InfoIcon />
                                    </IconButton>
                                  </Box>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                  {(schemeDetailsLoading || brokSchemeDetailsLoading) && (
                    <CircularProgress /> // Show loading indicator
                  )}
                  {schemeDetailsError || brokSchemeDetailsError ? (
                    <Typography color="error">Error loading data. Please try again.</Typography>
                  ) : (
                    <>
                      {selectedSchemeCode && schemeDetails && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            borderRadius: 2,
                            backgroundColor: "grey.300",
                            flexDirection: "column",
                            p: 1,
                            gap: 1, // Adds space between rows
                          }}
                        >
                          <Typography variant="h6">Account Opening Scheme Details</Typography>
                          {Object.keys(schemeDetails?.data || {}).map((key) => (
                            <Box
                              key={key}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%", // Ensure full width for even spacing
                              }}
                            >
                              <Typography>{key.replace(/_/g, " ")} : </Typography>
                              <Typography>
                                {String((schemeDetails?.data as Record<string, any>)[key])}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {selectedBrokCode &&
                        brokSchemeDetails &&
                        brokSchemeDetails?.data?.schemes?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: 2,
                              backgroundColor: "grey.300",
                              p: 1,
                              gap: 1, // Adds space between rows
                            }}
                          >
                            <Typography variant="h6">Brokerage Scheme Details</Typography>
                            {brokSchemeDetails?.data?.schemes.map((scheme) => (
                              <Box
                                key={scheme.scheme_code}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1, // Adds space between rows
                                }}
                              >
                                {Object.keys(scheme).map((key) => (
                                  <Box
                                    key={key}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%", // Ensure full width for even spacing
                                    }}
                                  >
                                    <Typography>{key.replace(/_/g, " ")}:</Typography>
                                    <Typography>{String((scheme as any)[key])}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        )}
                    </>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            {/* `````````````````````````````````````````````````````````` */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  height: "52px",
                  width: { xs: "auto", md: "fit-content" },
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? <CircularProgress /> : "Send Link"}
              </Button>
            </Box>
            {url && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  value={url?.data?.link || ""}
                  variant="outlined"
                  disabled
                  fullWidth
                  sx={{ mr: 5 }}
                />
                <Button variant="contained" onClick={handleCopyClick} sx={{ mr: 3 }}>
                  Copy
                </Button>
                <Button variant="contained" onClick={handleClickOpen} sx={{ maxWidth: "0.5rem" }}>
                  start
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </FormikProvider>
    </>
  );
};

export default PromoCode;
