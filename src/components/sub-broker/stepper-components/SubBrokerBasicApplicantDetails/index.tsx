import DynamicField from "@components/common/DynamicField";
import FieldContainer from "@components/common/FieldContainer";
import InputField from "@components/common/InputField";
import LabelContainer from "@components/common/LabelContainer";
import { BlobFile } from "@components/common/lib";
import MUIDateComponent from "@components/common/MUIDateComponent";
import TypeOfDocument from "@components/common/TypeOfDocument";
import { DropZone } from "@components/common/Upload";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, Button, Typography } from "@mui/material";
import convertFileToBase64 from "@utils/convertFileBase64";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { DropzoneProps } from "react-dropzone";

const genderOptions = [
  {
    type: "male",
    title: "MALE",
  },
  {
    type: "female",
    title: "FEMALE",
  },
  {
    type: "other",
    title: "OTHER",
  },
];

const SubBrokerBasicApplicantDetails = () => {
  const [bAppFormFiles, setBAppFormFiles] = useState<BlobFile[]>([]);
  const [bankAccountDetailsFiles, setBankAccountDetailsFiles] = useState<BlobFile[]>([]);

  const formik = useFormik({
    initialValues: {
      pan_number: "",
      dob: "",
      select_product: "",
      father_name: "",
      mother_name: "",
      gender: "",
      married_status: "",
      nationality: "",
      verify_email: "",
      bank_list_for_online_transaction: "",
      account_number: "",
      ifsc_code: "",
      micr_code: "",
      branch_name: "",
      bank_name: "",
      selected_group_3: "",
      rm_code: "",
      promo_code: "",
      aoc_scheme: "",
      brokerage_type: "",
      brokerage_scheme1: "",
      brokerage_details: "",
      brokerage_scheme2: "",
      total_amount: "",
      document_type: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });

  const basicApplicantOnDrop: DropzoneProps["onDrop"] = async (acceptedFiles) => {
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
    setBAppFormFiles(result);
  };
  const bankAccountDetailsOnDrop: DropzoneProps["onDrop"] = async (acceptedFiles) => {
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
    setBankAccountDetailsFiles(result);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <TabFromLayout
          formHeading="Basic Applicant Details"
          formSubheading="Identity Proof"
          subtext=""
          files={bAppFormFiles}
          setFiles={setBAppFormFiles}
          saveButton={true}
        >
          <FormikProvider value={formik}>
            <Box>
              <InputField name="pan" type="text" text="PAN Number" />
              <MUIDateComponent name="dob" label="DOB*" />
              <InputField name="pan" type="text" text="PAN Number" />
              <InputField name="father_name" type="text" text="Father Name" />
              <InputField name="mother_name" type="text" text="Mother Name" />
              <SelectField label="Gender" name="gender" options={genderOptions} />
              <SelectField label="Married Status" name="married_status" />
              <InputField name="nationality" type="text" text="Nationality" />
              <InputField name="verify_email" type="text" text="Verify Email" />
              <Box sx={{ display: "flex", gap: 2, maxWidth: "528px" }}>
                <Button size="large" variant="contained" fullWidth>
                  Change Email
                </Button>
                <Button size="large" variant="contained" fullWidth>
                  Generate OTP
                </Button>
              </Box>
              <Box sx={{ mt: 3, mb: 3 }}>
                <DynamicField>
                  <LabelContainer>
                    <Typography>Upload Document</Typography>
                  </LabelContainer>
                  <FieldContainer>
                    <DropZone onDrop={basicApplicantOnDrop} />
                  </FieldContainer>
                </DynamicField>
              </Box>
            </Box>
          </FormikProvider>
        </TabFromLayout>
      </Box>
      <Box>
        <TabFromLayout
          formHeading="Bank Account Details"
          formSubheading=""
          subtext=""
          files={bankAccountDetailsFiles}
          setFiles={setBankAccountDetailsFiles}
          saveButton={true}
        >
          <FormikProvider value={formik}>
            <Box>
              <SelectField name="bank_list_for_online_transaction" label="Bank List" />
              <InputField name="account_number" text="Account Number" type="text" />
              <InputField name="ifsc_code" text="IFSC Code" type="text" />
              <InputField name="micr_code" text="MICR Code" type="text" />
              <InputField name="branch_name" text="Branch Name" type="text" />
              <InputField name="bank_name" text="Bank Name" type="text" />
              <SelectField name="select_field_3" label="Select Group 3" />
              <InputField name="rm_code" text="RM Code" type="text" />
              <InputField name="promo_code" text="Promo Code" type="text" />
              <SelectField name="aoc_scheme" label="AOC Scheme" />
              {/* brokerage type */}
              <SelectField name="brokerage_scheme1" label="Brokerage Scheme" />
              <InputField name="brokerage_details" text="Brokerage Details" type="text" />
              <SelectField name="brokerage_scheme2" label="Brokerage Scheme" />
              <InputField name="total_amount" text="Total Amount" type="text" />
              <TypeOfDocument name="Document Type" />
              <Box sx={{ mt: 3, mb: 3 }}>
                <DynamicField>
                  <LabelContainer>
                    <Typography>Upload Document</Typography>
                  </LabelContainer>
                  <FieldContainer>
                    <DropZone onDrop={bankAccountDetailsOnDrop} />
                  </FieldContainer>
                </DynamicField>
              </Box>
            </Box>
          </FormikProvider>
        </TabFromLayout>
      </Box>
    </Box>
  );
};

export default SubBrokerBasicApplicantDetails;
