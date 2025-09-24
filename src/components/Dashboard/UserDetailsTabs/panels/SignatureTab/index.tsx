import { Box, CircularProgress } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGetSignatureDetailsQuery } from "services/ekyc.service";
import TabFromLayout from "../../TabFromLayout";
import SignatureTabForm from "./SignatureTabForm";

const SignatureTab = () => {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);
  const [index, setIndex] = React.useState<number>(0);

  const { data, error, isLoading, isError } = useGetSignatureDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";
  const detail = data?.data?.signature_detail;

  return (
    <>
      <TabFromLayout
        formHeading="Signature"
        formSubheading="Signature"
        subtext=""
        files={files}
        setFiles={setFiles}
        // images={detail?.uploaded_image_urls}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          detail && (
            <SignatureTabForm
              details={detail}
              // enums={data?.data?.dropdown_value}
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

export default SignatureTab;
