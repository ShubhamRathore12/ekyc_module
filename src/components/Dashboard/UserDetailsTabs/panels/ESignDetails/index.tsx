import { Box, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetESignDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import ESignDetailsForm from "./ESignDetailsForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
  pan: string;
}

const ESignDetails = (props: IProps) => {
  const { rejectionTemplates, pan } = props;

  const router = useRouter();
  const [files, setFiles] = useState<any>([]);

  const client_id = router.query.userid as string;

  const { data, error, isError, isLoading } = useGetESignDetailsQuery(
    { client_id },
    { skip: !client_id }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";
  return (
    <>
      <TabFromLayout
        formHeading="Esign Details"
        formSubheading="Esign Details"
        subtext=""
        files={files}
        setFiles={setFiles}
        stage={EKYCStages.EsignStage}
        client_id={data?.data?.esign_detail?.client_id}
        images={
          data?.data?.esign_detail?.esigned_pdf_url
            ? [data?.data?.esign_detail?.esigned_pdf_url]
            : []
        }
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.esign_detail ? (
          <ESignDetailsForm
            rejectionTemplates={rejectionTemplates}
            details={data?.data?.esign_detail}
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
          <Typography>No Data</Typography>
        )}
      </TabFromLayout>
    </>
  );
};

export default ESignDetails;
