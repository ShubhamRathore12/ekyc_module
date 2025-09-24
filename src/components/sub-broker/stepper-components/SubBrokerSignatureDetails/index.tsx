import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import LabelContainer from "@components/common/LabelContainer";
import { BlobFile } from "@components/common/lib";
import { DropZone } from "@components/common/Upload";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import { Box, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useState } from "react";
import { DropzoneProps } from "react-dropzone";

const SubBrokerSignatureDetails = () => {
  const [signatureDetailsFiles, setSignatureDetailsFiles] = useState<BlobFile[]>([]);
  //   const formik = useFormik({
  //     initialValues: {
  //       image_otp: "",
  //     },
  //     onSubmit: (values, helpers) => {
  //       helpers.setSubmitting(true);
  //       setTimeout(() => {
  //         //
  //         helpers.setSubmitting(false);
  //       }, 2000);
  //     },
  //   });
  const signatureDetailsOnDrop: DropzoneProps["onDrop"] = async (acceptedFiles) => {
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
    setSignatureDetailsFiles(result);
  };
  return (
    <>
      <TabFromLayout
        formHeading="Signature"
        formSubheading=""
        subtext=""
        files={signatureDetailsFiles}
        setFiles={setSignatureDetailsFiles}
        saveButton={true}
      >
        {/* <FormikProvider value={formik}> */}
        <Box
          sx={{
            mt: 3,
            mb: 3,
            display: "flex",
            flexWrap: { xs: "wrap", lg: "no wrap" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <DynamicField>
            <LabelContainer>
              <Typography>Upload Signature*</Typography>
            </LabelContainer>
            <FieldContainer>
              <DropZone onDrop={signatureDetailsOnDrop} />
            </FieldContainer>
          </DynamicField>
          <Typography sx={{ color: "primary.main" }}>(only jpeg, png, jpg or pdf)</Typography>
        </Box>
        <Typography sx={{ color: "primary.main" }}>
          (Note: Signature Should be on Plain White Paper)
        </Typography>
        {/* </FormikProvider> */}
      </TabFromLayout>
    </>
  );
};

export default SubBrokerSignatureDetails;
