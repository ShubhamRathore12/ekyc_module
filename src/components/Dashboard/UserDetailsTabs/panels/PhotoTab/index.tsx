import { Box, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetSelfieDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import PhotoTabForm from "./PhotoTabForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const PhotoTab = (props: IProps) => {
  const { rejectionTemplates } = props;
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);

  const { data, error, isLoading, isError } = useGetSelfieDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";

  return (
    <>
      <TabFromLayout
        formHeading="Photo"
        formSubheading="Photo"
        subtext=""
        files={files}
        setFiles={setFiles}
        images={data?.data?.selfie_detail?.image_url ? [data?.data?.selfie_detail?.image_url] : []}
        client_id={data?.data?.selfie_detail?.client_id}
        stage={EKYCStages.SelfieVerificationStage}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.selfie_detail ? (
          <PhotoTabForm
            rejectionTemplates={rejectionTemplates}
            details={data?.data?.selfie_detail}
            enums={data?.data?.dropdown_value}
            client_id={router.query.userid as string}
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

export default PhotoTab;
