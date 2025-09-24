import { Box, CircularProgress } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetSegmentDetailsQuery } from "services/ekyc.service";
import TabFromLayout from "../../TabFromLayout";
import SegmentDetailsForm from "./SegmentDetailsForm";

const SegmentDetails = () => {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);

  const { data, error, isLoading, isError } = useGetSegmentDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";

  return (
    <>
      <TabFromLayout
        formHeading="Segment Details"
        formSubheading="Segment Details"
        subtext=""
        files={files}
        setFiles={setFiles}
        images={
          data?.data?.segment_detail?.uploaded_image_urls
            ? data?.data?.segment_detail?.uploaded_image_urls
            : []
        }
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          data?.data?.segment_detail && (
            <SegmentDetailsForm
              details={data?.data?.segment_detail}
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
          )
        )}
      </TabFromLayout>
    </>
  );
};

export default SegmentDetails;
