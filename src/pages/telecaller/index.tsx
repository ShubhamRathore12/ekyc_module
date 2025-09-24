import AuthGuard from "@components/auth/AuthGuard";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { OpenInNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import getErrorProps from "@utils/formik-error-props";
import handleError from "@utils/handleError";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import prettyPrintDate from "@utils/prettyPrintDate";
import { Form, FormikProvider, useFormik } from "formik";
import { NextPage } from "next";
import React from "react";
import { useGetTalismaAccessTokenMutation, useGetTalismaEkycMutation } from "services/ekyc.service";
import { AgentEkyc } from "types/ekyc";
import { ApplicationStatus } from "types/links";
import * as Yup from "yup";
import MaskedData from "@components/common/MaskedData";
import { MaskType } from "@utils/maskingUtils";

const TelecallerPage: NextPage = () => {
  const [getTalismaEkyc] = useGetTalismaEkycMutation();
  const [getTalismaAccessToken, { isLoading }] = useGetTalismaAccessTokenMutation();

  const [ekyc, setEkyc] = React.useState<AgentEkyc>();
  const formik = useFormik({
    initialValues: {
      // lead_id: "",
      mobile_number: "",
      userType: "REGULAR",
      panNumber: "",
    },
    validationSchema: Yup.object().shape({
      // lead_id: Yup.string().length(15, "Lead Id Must be 15 characters"),
      mobile_number: Yup.string().length(10, "Mobile number must be 10 characters"),
      userType: Yup.string().required("User Type is mandatory"),
      panNumber: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format (e.g., ABCDE1234F)")
        .length(10, "Pan Number must be 10 characters"),
    }),
    onSubmit: async (values, helpers) => {
      const payload = {
        user_type: values?.userType,
        ...(values?.mobile_number && { mobile_number: values?.mobile_number }),
        // ...(values?.lead_id && { lead_id: values?.lead_id }),
        ...(values?.userType !== "REGULAR" &&
          values?.userType !== "SUBSCRIPTION_CLIENT" &&  values?.userType !== "STX_SUBSCRIPTION_CLIENT " && { pan_number: values?.panNumber }),
      };
      helpers.setSubmitting(true);
      try {
        const res = await getTalismaEkyc(payload).unwrap();
        setEkyc(res.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Card
        component={Form}
        sx={{
          p: 4,
          width: "100%",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h6">Telecaller Dashboard</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "start", md: "center" },
            gap: { xs: 1, md: 3 },
            // flexWrap: "wrap",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Stack sx={{ width: { xs: "100%", md: "100%" } }}>
            <Typography variant="subtitle2">User Type</Typography>
            <TextField
              fullWidth
              select
              {...formik.getFieldProps("userType")}
              onChange={(e) => {
                formik.setFieldValue("userType", e.target.value);
              }}
              {...getErrorProps(formik, "userType")}
            >
              <MenuItem value="REGULAR"> REGULAR</MenuItem>
              <MenuItem value="SUBSCRIPTION_CLIENT"> SUBSCRIPTION_CLIENT</MenuItem>
              <MenuItem value="STX_SUBSCRIPTION_CLIENT"> STX_SUBSCRIPTION_CLIENT </MenuItem>
              
              <MenuItem value="MUTUAL_FUND_CLIENT"> MUTUAL_FUND_CLIENT</MenuItem>
              <MenuItem value="MUTUAL_FUND_DISTRIBUTOR"> MUTUAL_FUND_DISTRIBUTOR</MenuItem>
            </TextField>
          </Stack>
          {/* <Stack sx={{ width: { xs: "100%", md: "100%" } }}>
            <Typography variant="subtitle2">Lead ID</Typography>
            <TextField
              fullWidth
              {...formik.getFieldProps("lead_id")}
              onChange={(e) => {
                if (
                  "`!@#$%^&*()_+-=[]\\{}|;':\",./<>?"
                    .split("")
                    .some((char) => e.target.value.includes(char))
                )
                  return;
                if (e.target.value.length > 15) return;
                formik.setFieldValue("lead_id", e.target.value);
              }}
              {...getErrorProps(formik, "lead_id")}
            />
          </Stack> */}
          {/* <Typography variant="subtitle1">Or</Typography> */}
          <Stack sx={{ width: { xs: "100%", md: "100%" } }}>
            <Typography variant="subtitle2">Mobile Number</Typography>
            <TextField
              fullWidth
              {...formik.getFieldProps("mobile_number")}
              onChange={(e) => {
                if (Number.isNaN(+e.target.value)) return;
                if (e.target.value.length > 10) return;
                formik.setFieldValue("mobile_number", e.target.value);
              }}
              {...getErrorProps(formik, "mobile_number")}
            />
          </Stack>
          {formik?.values?.userType &&
            formik?.values?.userType !== "REGULAR" &&
            formik?.values?.userType !== "SUBSCRIPTION_CLIENT" &&
            formik?.values?.userType !== "STX_SUBSCRIPTION_CLIENT" && (
              <Stack sx={{ width: { xs: "100%", md: "100%" } }}>
                <Typography variant="subtitle2">Pan Number</Typography>
                {/* <TextField
                sx={{ width: "50%" }}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="Enter PAN No."
                error={panNumber !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)}
                inputProps={{ maxLength: 10 }}
              /> */}
                <TextField
                  fullWidth
                  {...formik.getFieldProps("panNumber")}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value.length > 10) return;
                    formik.setFieldValue("panNumber", value);
                  }}
                  inputProps={{ 
                    maxLength: 10,
                    pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                    autoComplete: 'off'
                  }}
                  placeholder="Enter PAN No."
                  error={
                    !!formik.values.panNumber &&
                    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formik.values.panNumber)
                  }
                  {...getErrorProps(formik, "panNumber")}
                />
              </Stack>
            )}

          <Button
            type="submit"
            variant="contained"
            disabled={
              !formik.values.mobile_number ||
              !formik.values?.userType ||
              (formik.values?.userType !== "REGULAR" &&
                formik.values?.userType !== "SUBSCRIPTION_CLIENT" &&
                formik.values?.userType !== "STX_SUBSCRIPTION_CLIENT" &&
                !formik.values?.panNumber) ||
              formik.isSubmitting
            }
          >
            {formik.isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </Box>
        {ekyc && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assist Client</TableCell>
                  <TableCell>Client Id</TableCell>
                  <TableCell>Pan Number</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date Of Birth</TableCell>
                  <TableCell>Created On</TableCell>
                  <TableCell>Last Modified On</TableCell>
                  <TableCell>App Stage</TableCell>
                  <TableCell>App Status</TableCell>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Promo Code</TableCell>
                  <TableCell>Referral Code</TableCell>
                  <TableCell>Group3</TableCell>
                  <TableCell>UCC Code</TableCell>
                  <TableCell>Talisma</TableCell>
                  <TableCell>Credit Category</TableCell>
                  <TableCell>User Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="text"
                      sx={{ color: "primary.main" }}
                      endIcon={<OpenInNew />}
                      disabled={isLoading}
                      onClick={async () => {
                        try {
                          const res = await getTalismaAccessToken({
                            client_id: ekyc.client_id,
                          }).unwrap();

                          window.open(res.data.redirect);
                        } catch (error) {
                          handleError(error);
                        }
                      }}
                    >
                      {isLoading ? <CircularProgress /> : kebabToCapitalize(ekyc?.app_stage)}
                    </Button>
                  </TableCell>
                  <TableCell>{ekyc?.client_id || "--"}</TableCell>
                  <TableCell>
                    {ekyc?.pan_number ? (
                      <MaskedData
                        data={ekyc.pan_number}
                        type={MaskType.PAN}
                        variant="body2"
                        showIcon={true}
                      />
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell>{ekyc?.full_name || "--"}</TableCell>
                  <TableCell>
                    {ekyc?.mobile_number ? (
                      <MaskedData
                        data={ekyc.mobile_number}
                        type={MaskType.MOBILE}
                        variant="body2"
                        showIcon={true}
                      />
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell>
                    {ekyc?.email ? (
                      <MaskedData
                        data={ekyc.email}
                        type={MaskType.EMAIL}
                        variant="body2"
                        showIcon={true}
                      />
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell>{ekyc?.date_of_birth || "--"}</TableCell>
                  <TableCell>{prettyPrintDate(ekyc?.created_at) || "--"}</TableCell>
                  <TableCell>{prettyPrintDate(ekyc?.updated_at) || "--"}</TableCell>
                  <TableCell>{kebabToCapitalize(ekyc?.app_stage) || "--"}</TableCell>
                  <TableCell>
                    {ApplicationStatus[ekyc?.app_status as unknown as ApplicationStatus] || "--"}
                  </TableCell>
                  <TableCell>{ekyc?.product_code || "--"}</TableCell>
                  <TableCell>{ekyc?.promo_code || "--"}</TableCell>
                  <TableCell>{ekyc?.referral_code || "--"}</TableCell>
                  <TableCell>{ekyc?.group3 || "--"}</TableCell>
                  <TableCell>{ekyc?.ucc_code || "--"}</TableCell>
                  <TableCell>{ekyc?.talisma_id || "--"}</TableCell>
                  <TableCell>{ekyc?.credit_category || ""}</TableCell>
                  <TableCell>{ekyc?.user_type || ""}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </FormikProvider>
  );
};

TelecallerPage.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default TelecallerPage;
