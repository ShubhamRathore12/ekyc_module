import InputField from "@components/common/InputField";
import MUIDateComponent from "@components/common/MUIDateComponent";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import OpenAccountModal from "./OpenAccountModal";
import PanModal from "./PanModal";
const BasicApplicantDetails = () => {
  const router = useRouter();
  const [panModalOpen, setPanModalOpen] = useState(false);
  const handlePanOpen = () => setPanModalOpen(true);
  const handlePanClose = () => {
    setPanModalOpen(false);
  };

  const [newAccountModalOpen, setNewAccountModalOpen] = useState(router.query.step ? false : true);
  const accountHandlePanOpen = () => setNewAccountModalOpen(true);
  const accountHandlePanClose = () => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, step: 1 },
    });
    setNewAccountModalOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      pan_number: "",
      date_of_birth: "",
      select_product: "",
      verify_email: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Modal
        open={panModalOpen}
        onClose={handlePanClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <PanModal closeHandle={handlePanClose} open={panModalOpen} />
      </Modal>
      <Modal
        open={newAccountModalOpen}
        onClose={accountHandlePanClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <OpenAccountModal closeHandle={accountHandlePanClose} open={newAccountModalOpen} />
      </Modal>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          bgcolor: "#FFFF",
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 2,
        }}
      >
        <Typography variant="h4" fontWeight={500}>
          Basic Applicant Details
        </Typography>
        <Box
          sx={{
            maxWidth: { xs: "550px", md: "750px" },
            display: "flex",
            alignItems: "baseline",
            flexWrap: { xs: "wrap", md: "unset" },
          }}
        >
          <InputField name="pan_number" text="PAN Number*" type="text" />
          <Button
            onClick={handlePanOpen}
            startIcon={<CheckCircleIcon />}
            variant="contained"
            sx={{
              width: "250px",
              height: "50px",
              // mb: 1,
              // position: { md: "absolute" },
              // right: { xs: 0, md: -120 },
              // top: 15,
            }}
          >
            Verify PAN
          </Button>
        </Box>
        <Box sx={{ maxWidth: "550px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // position: { xs: "none", md: "relative" },
              flexWrap: "wrap",
            }}
          >
            <MUIDateComponent name="dob" label="DOB*" />
            <SelectField name="select_product" label="Select Product" />
            <InputField name="verify_email" text="Verify Email*" type="email" />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                ml: { xs: "unset", md: "160px" },
              }}
            >
              <Button size="large" variant="contained">
                Change Email
              </Button>
              <Button size="large" variant="contained">
                Generate OTP
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormikProvider>
  );
};

export default BasicApplicantDetails;
