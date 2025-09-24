import { Box, CircularProgress, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetContactDetailsQuery } from "services/ekyc.service";
import { EKYCStages, RejectionTemplate } from "types/ekyc";
import TabFromLayout from "../../TabFromLayout";
import ContactDetailsForm from "./ContactDetailsForm";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const ContactDetails = (props: IProps) => {
  const { rejectionTemplates } = props;
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);

  const client_id = router.query.userid as string;

  const { data, error, isError, isLoading } = useGetContactDetailsQuery(
    { client_id },
    { skip: !client_id }
  );

  const errorMessage = (error as any)?.error || "Something went wrong";

  return (
    <>
      <TabFromLayout
        formHeading="Contact Details"
        formSubheading="Contact Details"
        subtext=""
        files={files}
        setFiles={setFiles}
        stage={EKYCStages.DigioStage}
        client_id={data?.data?.contact_detail?.client_id}
        images={data?.data?.contact_detail?.uploaded_image_urls}
      >
        {isError ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>{errorMessage}</Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data?.contact_detail ? (
          <ContactDetailsForm
            rejectionTemplates={rejectionTemplates}
            details={data?.data?.contact_detail}
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

export default ContactDetails;
