import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetSegmentDetailsQuery } from "services/ekyc.service";
import { EKYCStages } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import DerivateDetailsTabForm from "./DerivateDetailsTabForm";

const DerivateDetailsTab = () => {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);

  const { data, error, isLoading, isError } = useGetSegmentDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";
  const client_id = router.query.userid as string;

  return (
    <>
      <TabFromLayout
        formHeading="Derivative Details"
        formSubheading="Derivative Details"
        subtext=""
        files={files}
        setFiles={setFiles}
        images={data?.data?.segment_detail?.uploaded_image_urls}
        client_id={data?.data?.segment_detail?.client_id}
        stage={EKYCStages.SegmentUploadStage}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.segment_detail ? (
          <DerivateDetailsTabForm
            details={data?.data?.segment_detail}
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

export default DerivateDetailsTab;
