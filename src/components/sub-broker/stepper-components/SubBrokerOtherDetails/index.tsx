import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import InputField from "@components/common/InputField";
import LabelContainer from "@components/common/LabelContainer";
import { BlobFile } from "@components/common/lib";
import TypeOfDocument from "@components/common/TypeOfDocument";
import { DropZone } from "@components/common/Upload";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { DropzoneProps } from "react-dropzone";

const SubBrokerOtherDetails = () => {
  const formik = useFormik({
    initialValues: {
      education: "",
      occupation: "",
      net_worth: "",
      income: "",
      pep_type1: "",
      pep_type2: "",
      document_type: "",
      want_to_open_dp_account: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  const [otherDetailsFiles, setOtherDetailsFiles] = useState<BlobFile[]>([]);
  const otherDetailsOnDrop: DropzoneProps["onDrop"] = async (acceptedFiles) => {
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
    setOtherDetailsFiles(result);
  };
  return (
    <>
      <TabFromLayout
        formHeading="Other Details"
        formSubheading=""
        subtext=""
        saveButton={true}
        files={otherDetailsFiles}
        setFiles={setOtherDetailsFiles}
      >
        <Box>
          <FormikProvider value={formik}>
            <SelectField name="education" label="Education" />
            <SelectField name="occupation" label="Occupation" />
            <InputField name="net_worth" type="text" text="Net Worth" />
            <SelectField name="income" label="Income" />
            <InputField name="pep_type1" type="text" text="PEP Type" />
            <SelectField name="pep_type2" label="PEP Type" />
            <TypeOfDocument name="document_type" />
            <Box sx={{ mt: 3, mb: 3 }}>
              <DynamicField>
                <LabelContainer>
                  <Typography>Upload Document</Typography>
                </LabelContainer>
                <FieldContainer>
                  <DropZone onDrop={otherDetailsOnDrop} />
                </FieldContainer>
              </DynamicField>
            </Box>
          </FormikProvider>
        </Box>
      </TabFromLayout>
      <TabFromLayout formHeading="Other Details" formSubheading="" subtext="" saveButton={true}>
        <FormikProvider value={formik}>
          <DynamicField>
            <LabelContainer>
              <Typography>Add Nominee?</Typography>
            </LabelContainer>
            <RadioGroup row name="want_to_open_dp_account">
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </DynamicField>
        </FormikProvider>
      </TabFromLayout>
    </>
  );
};

export default SubBrokerOtherDetails;
