import { Box, Button, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetDematAccountDetailsQuery, useGetNomineeDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import { Nominee } from "types/nominee";
import TabFromLayout from "../../TabFromLayout";
import DematDetailsForm from "./DematDetailsForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const DematAccountDetailsTab = (props: IProps) => {
  const { rejectionTemplates } = props;
  const [files, setFiles] = useState<any>([]);

  const router = useRouter();
  const [value, setValue] = useState(0);


  const client_id = router.query.userid as string;

  const { data, error, isError, isLoading } = useGetDematAccountDetailsQuery(
    { client_id },
    { skip: !client_id }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";


 
  return (
    <>
        <TabFromLayout
        formHeading="Demat Details"
        formSubheading="Demat Details"
        subtext=""
        files={files}
        setFiles={setFiles}
     images={data?.data?.demat_account_detail?.s3url ? [data?.data?.demat_account_detail?.s3url] : []}
        client_id={data?.data?.demat_account_detail?.client_id}
        stage={EKYCStages.DematVerificationStage}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.demat_account_detail ? (
          <DematDetailsForm
            rejectionTemplates={rejectionTemplates}
            details={data?.data?.demat_account_detail}
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

export default DematAccountDetailsTab;
