import { BlobFile } from "@components/common/lib";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import DashboardLayout from "@components/layouts/DashboardLayout";
import BasicApplicantDetails from "@components/sub-broker/stepper-components/BasicApplicantDetails";
import EditIcon from "@mui/icons-material/Edit";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DropzoneProps } from "react-dropzone";
import SubBrokerBasicApplicantDetails from "../stepper-components/SubBrokerBasicApplicantDetails";
import SubBrokerContactDetails from "../stepper-components/SubBrokerContactDetails";
import SubBrokerDPDetails from "../stepper-components/SubBrokerDPDetails";
import SubBrokerOtherDetails from "../stepper-components/SubBrokerOtherDetails";
import SubBrokerPhotoDetails from "../stepper-components/SubBrokerPhotoDetails";
import SubBrokerSignatureDetails from "../stepper-components/SubBrokerSignatureDetails";

const OpenAccount = () => {
  const router = useRouter();

  // const [activeStep, setActiveStep] = useState(1);
  const activeStep = +(router.query.step as string) || 1;
  const setActiveStep = (step: number) =>
    router.replace({ pathname: router.pathname, query: { ...router.query, step } });
  // ////////////////////////////////////
  const [bAppFormFiles, setBAppFormFiles] = useState<BlobFile[]>([]);
  const [bankAccountDetailsFiles, setBankAccountDetailsFiles] = useState<BlobFile[]>([]);
  const [contactDetailsFiles, setContactDetailsFiles] = useState<BlobFile[]>([]);
  const [dpDetailsFiles, setDpDetailsFiles] = useState<BlobFile[]>([]);
  const [otherDetailsFiles, setOtherDetailsFiles] = useState<BlobFile[]>([]);
  const [photoDetailsFiles, setPhotoDetailsFiles] = useState<BlobFile[]>([]);
  const [signatureDetailsFiles, setSignatureDetailsFiles] = useState<BlobFile[]>([]);

  // ////////////////////////////////////
  function nextStep() {
    if (activeStep < 7) setActiveStep(activeStep + 1);
  }
  function previousStep() {
    if (activeStep !== -1) setActiveStep(activeStep - 1);
  }
  function showStepperComponents(step: number) {
    switch (step) {
      case 1:
        return <BasicApplicantDetails />;
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <SubBrokerBasicApplicantDetails />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <SubBrokerDPDetails />
            <SubBrokerContactDetails />
            <SubBrokerOtherDetails />
          </Box>
        );
      case 4:
        // eslint-disable-next-line no-case-declarations
        const photoDetailsOnDrop: DropzoneProps["onDrop"] = async (acceptedFiles) => {
          const result = [];
          for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i];
            result.push({
              base64: await convertFileToBase64(file),
              type: file.type,
              lastModified: file.lastModified,
              name: file.name,
              size: file.size,
            });
          }
          setPhotoDetailsFiles(result);
        };
        return (
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* <Box
              sx={{
                mt: 3,
                "& .MuiBox-root": {
                  flexWrap: "nowrap",
                },
              }}
            >
              <TabFromLayout
                formHeading="Photo"
                formSubheading="Photo"
                subtext=""
                // PreviewComponent={<Preview files={files} />}
                files={photoDetailsFiles}
                setFiles={setPhotoDetailsFiles}
              >
                <PhotoTabForm
                  onDrop={async (acceptedFiles) => {
                    const result = [];
                    for (let i = 0; i < acceptedFiles.length; i++) {
                      const file = acceptedFiles[i];
                      result.push({
                        base64: await convertFileToBase64(file),
                        type: file.type,
                        lastModified: file.lastModified,
                        size: file.size,
                        name: file.name,
                      });
                    }
                    setPhotoDetailsFiles(result);
                  }}
                />
              </TabFromLayout>
            </Box>
            <Box
              sx={{
                mt: 3,
                "& .MuiBox-root": {
                  flexWrap: "nowrap",
                },
              }}
            >
              <TabFromLayout
                formHeading={"Signature"}
                formSubheading={"Signature"}
                subtext={""}
                // PreviewComponent={<Preview files={files} />}
                files={signatureDetailsFiles}
                setFiles={setSignatureDetailsFiles}
              >
                <SignatureTabForm
                  onDrop={async (acceptedFiles) => {
                    const result = [];
                    for (let i = 0; i < acceptedFiles.length; i++) {
                      const file = acceptedFiles[i];
                      result.push({
                        base64: await convertFileToBase64(file),
                        type: file.type,
                        lastModified: file.lastModified,
                        size: file.size,
                        name: file.name,
                      });
                    }
                    setSignatureDetailsFiles(result);
                  }}
                />
              </TabFromLayout>
            </Box>
            <Box
              sx={{
                mt: 3,
                "& .MuiBox-root": {
                  flexWrap: "nowrap",
                },
              }}
            >
              <ESignDetailsTab />
            </Box> */}
            <SubBrokerPhotoDetails />
            <SubBrokerSignatureDetails />
            <TabFromLayout
              formHeading="ESign Details"
              formSubheading=""
              subtext=""
              saveButton={true}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  maxWidth: "550px",
                  flexWrap: "wrap",
                }}
              >
                <Typography>ESign Document</Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexGrow: 1,
                    flexWrap: { xs: "wrap", md: "nowrap" },
                  }}
                >
                  <Button
                    startIcon={<InsertLinkIcon />}
                    variant="contained"
                    fullWidth
                    sx={{ height: "46px" }}
                  >
                    Send E-Sign Link
                  </Button>
                  <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    fullWidth
                    sx={{ height: "46px" }}
                  >
                    Check E-Sign
                  </Button>
                </Box>
              </Box>
            </TabFromLayout>
          </Box>
        );
      case 5:
        return <Typography>step 5</Typography>;
      case 6:
        return <Typography>step 6</Typography>;
      case 7:
        return <Typography>step 7</Typography>;
      // default:
      //   return <Typography>Thank you</Typography>
    }
  }
  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        sx={{ justifyContent: "center", pt: { xs: 2, md: "unset" } }}
      >
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
        <Step>
          <StepLabel></StepLabel>
        </Step>
      </Stepper>
      <Box>{showStepperComponents(activeStep)}</Box>
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button variant="contained" onClick={previousStep}>
          Previous Step
        </Button>
        <Button variant="contained" onClick={nextStep}>
          Next Step
        </Button>
      </Box>
    </Box>
  );
};

OpenAccount.getLayout = (
  page:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
) => <DashboardLayout>{page}</DashboardLayout>;

export default OpenAccount;
function setFiles(arg0: { preview: string }[]) {
  throw new Error("Function not implemented.");
}
