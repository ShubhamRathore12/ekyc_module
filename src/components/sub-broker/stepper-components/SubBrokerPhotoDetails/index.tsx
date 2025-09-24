import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import InputField from "@components/common/InputField";
import LabelContainer from "@components/common/LabelContainer";
import { BlobFile } from "@components/common/lib";
import { DropZone } from "@components/common/Upload";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import { Box, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { DropzoneProps } from "react-dropzone";

const SubBrokerPhotoDetails = () => {
  const [photoDetailsFiles, setPhotoDetailsFiles] = useState<BlobFile[]>([]);
  const formik = useFormik({
    initialValues: {
      image_otp: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
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
    <>
      <TabFromLayout
        formHeading="Photo"
        formSubheading=""
        subtext=""
        files={photoDetailsFiles}
        setFiles={setPhotoDetailsFiles}
        saveButton={true}
      >
        <FormikProvider value={formik}>
          <Box
            sx={{
              mt: 3,
              mb: 3,
              display: "flex",
              // flexWrap: photoDetailsFiles.length > 1 ? "wrap" : "nowrap ",
              flexWrap: { xs: "wrap", lg: "no wrap" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <DynamicField>
              <LabelContainer>
                <Typography>Upload Photo</Typography>
              </LabelContainer>
              <FieldContainer>
                <DropZone onDrop={photoDetailsOnDrop} />
              </FieldContainer>
            </DynamicField>
            <Typography sx={{ color: "primary.main" }}>(only jpeg, png, jpg or pdf)</Typography>
          </Box>
          <Box>
            <InputField text="Image OTP" name="image_otp" type="text" />
            <Typography sx={{ color: "primary.main" }}>
              * Client Must be Holding a piece of paper with this OTP written on it{" "}
            </Typography>
          </Box>
        </FormikProvider>
      </TabFromLayout>
    </>
  );
};

export default SubBrokerPhotoDetails;
