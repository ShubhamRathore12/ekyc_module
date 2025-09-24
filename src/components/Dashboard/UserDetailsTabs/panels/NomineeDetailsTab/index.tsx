import { Box, Button } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetNomineeDetailsQuery } from "services/ekyc.service";
import { RejectionTemplate } from "types/ekyc";
import { Nominee } from "types/nominee";
import TabFromLayout from "../../TabFromLayout";
import NomineeDetailsFrom from "./NomineeDetailsFrom";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const NomineeDetailsTab = (props: IProps) => {
  const { rejectionTemplates } = props;
  const [files, setFiles] = useState<any>([]);

  const router = useRouter();
  const [value, setValue] = useState(0);

  const { data, error, isLoading, isError } = useGetNomineeDetailsQuery(
    { client_id: router.query.userid as string },
    { skip: !router.query.userid }
  );
  const nominees = data?.data?.nominee_detail?.nominees?.nominees || [];

  const parsedNominee = { ...data?.data?.nominee_detail?.nominees?.nominees?.[value] };

  if (parsedNominee?.is_address_same) {
    if ("address_line_1" in parsedNominee) delete parsedNominee.address_line_1;
    if ("address_line_2" in parsedNominee) delete parsedNominee.address_line_2;
    if ("address_line_3" in parsedNominee) delete parsedNominee.address_line_3;
    if ("country" in parsedNominee) delete parsedNominee.country;
    if ("city" in parsedNominee) delete parsedNominee.city;
    if ("state" in parsedNominee) delete parsedNominee.state;
    if ("pin_code" in parsedNominee) delete parsedNominee.pin_code;
  }
  const details: Nominee = data?.data?.nominee_detail?.nominees?.nominees?.length
    ? {
        status: data?.data?.nominee_detail?.status || -1,
        reject_reason: data?.data?.nominee_detail?.reject_reason || "",
        remarks: data?.data?.nominee_detail?.remarks || "",
        updated_at: data?.data?.nominee_detail?.updated_at || new Date(),
        created_at: data?.data?.nominee_detail?.created_at || new Date(),
        ...parsedNominee,
      }
    : {
        status: 2,
      };

  return (
    <>
      <TabFromLayout
        formHeading="Nominee Details"
        formSubheading="Document"
        subtext=""
        files={files}
        setFiles={setFiles}
        images={details?.id_proof_document_urls}
        Content={() => {
          return (
            <Box sx={{ my: 2, display: "flex", gap: 2 }}>
              {nominees &&
                nominees.map((n, i) => (
                  <Button
                    onClick={() => setValue(i)}
                    key={i}
                    variant={i === value ? "contained" : "outlined"}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Nominee {i + 1}
                  </Button>
                ))}
            </Box>
          );
        }}
      >
        <NomineeDetailsFrom
          details={details}
          disabled={!data?.data?.nominee_detail?.nominees?.nominees?.length}
          rejectionTemplates={rejectionTemplates}
          // enums={[]}
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
      </TabFromLayout>
    </>
  );
};

export default NomineeDetailsTab;
