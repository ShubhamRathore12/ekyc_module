import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import { BlobFile } from "@components/common/lib";
import { Box, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGetBasicDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import BAppForm from "./BAppForm";

interface IProps {
  rejectionTemplates?: RejectionTemplate[];
}

const BasicApplications = (props: IProps) => {
  const { rejectionTemplates } = props;
  const router = useRouter();
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [photos, setPhotos] = React.useState({});
  const { data, error, isLoading, isError } = useGetBasicDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";
  const client_id = router.query.userid as string;
  React.useEffect(() => {
    data?.data?.basic_detail?.uploaded_image_urls?.map((i) => {
      setPhotos((prev) => [{ ...prev }, { width: "250", height: "250", src: i }]);
    });
  }, [data]);

  return (
    <>
      <TabFromLayout
        formHeading="Basic Applicant Details"
        formSubheading="Identity Proof"
        subtext={data?.data?.basic_detail?.is_kra_verified ? "(Kra Verified)" : "(Aadhar Verified)"}
        files={files}
        setFiles={setFiles}
        images={data?.data?.basic_detail?.uploaded_image_urls}
        // images={[
        //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/logo/af90c1e5-703f-4705-a935-2b039289c28f.png",
        //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/pitch_deck/bb1a412d-f845-4069-af80-f24959cbbfbd.pdf",
        //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/cover_image/d69a90bc-a04c-45fe-81f9-74be20e2d8cf.jpg",
        // ]}
        stage={EKYCStages.PANUploadStage}
        client_id={data?.data.basic_detail?.client_id}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.basic_detail ? (
          <BAppForm
            rejectionTemplates={rejectionTemplates}
            details={data?.data?.basic_detail}
            enums={data?.data?.dropdown_value}
            client_id={client_id}
            onDrop={async (acceptedFiles) => {
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
              setFiles(result);
              // await Promise.all(acceptedFiles.map(convertFileToBase64))
              //   .then((res) => setFiles(res))
              //   .catch(console.error);
            }}
          />
        ) : (
          <Typography>No data found</Typography>
        )}
      </TabFromLayout>
    </>
  );
};

export default BasicApplications;
