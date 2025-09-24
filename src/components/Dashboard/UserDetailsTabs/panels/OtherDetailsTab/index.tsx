import { Box, CircularProgress } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetPersonalDetailsQuery, useGetSignatureDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import OtherDetailsForm from "./OtherDetailsForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const OtherDetailsTab = (props: IProps) => {
  const { rejectionTemplates } = props;
  const [files, setFiles] = useState<any>([]);

  const router = useRouter();

  const client_id = router.query.userid as string;

  const { data, error, isError, isLoading } = useGetPersonalDetailsQuery(
    { client_id },
    { skip: !client_id }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";

  const signatureData = useGetSignatureDetailsQuery({ client_id }, { skip: !client_id });
  return (
    <>
      <TabFromLayout
        formHeading="Other Details"
        formSubheading="Document"
        files={files}
        setFiles={setFiles}
        subtext=""
        images={signatureData?.data?.data?.signature_detail?.uploaded_image_urls}
        client_id={signatureData?.data?.data?.signature_detail?.client_id}
        stage={EKYCStages.SignatureUploadStage}
      >
        {isError || !data?.data?.personal_detail ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          data?.data?.personal_detail &&
          signatureData.data?.data.signature_detail && (
            <OtherDetailsForm
              rejectionTemplates={rejectionTemplates}
              signatureDetails={signatureData.data?.data.signature_detail}
              client_id={client_id}
              optionsEnums={data?.data?.dropdown_value}
              details={data?.data?.personal_detail}
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

export default OtherDetailsTab;
