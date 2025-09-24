import convertFileToBase64 from "@utils/convertFileBase64";
import { useState } from "react";
import TabFromLayout from "../../TabFromLayout";
import IPVDetailsTabForm from "./IPVDetailsTabForm";

const IPVDetailsTab = () => {
  const [files, setFiles] = useState<any>([]);
  return (
    <>
      <TabFromLayout
        formHeading="IPV Details"
        formSubheading="IPV Proof"
        subtext=""
        files={files}
        setFiles={setFiles}
      >
        <IPVDetailsTabForm
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

export default IPVDetailsTab;
