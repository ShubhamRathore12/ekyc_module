import { BlobFile } from "@components/common/lib";
import { Box, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import React from "react";
import { useGetBankDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import BankAccountDetailsForm from "./BankAccountDetailsForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const BankAccountDetailsTab: React.FC<IProps> = (props) => {
  const { rejectionTemplates } = props;
  const router = useRouter();

  const client_id = router.query.userid as string;

  const { data, error, isLoading, isError,refetch } = useGetBankDetailsQuery(
    { client_id },
    { skip: !client_id }
  );
  const [files, setFiles] = React.useState<BlobFile[]>([]);

  const bankDetails = data?.data?.bank_detail;

  const errorMessage = (error as any)?.error || "Something went wrong";
  return (
    <>
      {isError ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {bankDetails && bankDetails?.length > 0 ? (
            bankDetails?.map((details) => (
              <>
                <TabFromLayout
                  formHeading="Bank Accounting Details"
                  formSubheading="Bank Account Details"
                  files={files}
                  subtext=""
                  setFiles={setFiles}
                  images={details?.uploaded_image_urls}
                  stage={EKYCStages.BankVerificationStage}
                  client_id={details?.client_id}
                >
                  <BankAccountDetailsForm
                    rejectionTemplates={rejectionTemplates}
                    key={details.client_id}
                    details={details}
                    enums={data?.data?.dropdown_value}
                    refetch={refetch}
                    client_id={details.client_id}
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
                </TabFromLayout>
              </>
            ))
          ) : (
            <Typography>No data found</Typography>
          )}
        </>
      )}
    </>
  );
};

export default BankAccountDetailsTab;
