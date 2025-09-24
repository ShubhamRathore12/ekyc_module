import FieldsLayout from "@components/common/FieldsLayout";
import InputField from "@components/common/InputField";
import { BlobFile } from "@components/common/lib";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { Box, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";

const CDURequestsBankDetailsPage: NextPage = () => {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const formik = useFormik({
    initialValues: {
      bo_code: "8266489",
      name: "Sumit Kumar",
      account_number: "34672941746",
      ifsc_code: "SBIN0000182",
      micr_code: "785002202",
      branch_name: "SIBSAGAR",
      bank_name: "STATE BANK OF INDIA",
      penny_drop_status: "Failed",
      name_as_per_bank: "Force Verified",
      e_sign_notdone: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });

  function eSignNotdoneOnChange(e: { target: { value: any } }) {
    formik.setFieldValue("e_sign_notdone", e.target.value);
  }

  return (
    <Box sx={{ p: 3 }}>
      <TabFromLayout
        formHeading="Bank Accounting Details"
        files={files}
        formSubheading="View Details/E-Sign PDF"
        subtext=""
        cdurequests={true}
        eSignNotdoneOnChange={eSignNotdoneOnChange}
      >
        <FormikProvider value={formik}>
          <FieldsLayout>
            <InputField type="text" name="bo_code" text="BO Code" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="name" text="Name" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="account_number" text="Account Number" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="ifsc_code" text="IFSC Code" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="micr_code" text="MICR Code" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="branch_name" text="Branch Name" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="bank_name" text="Bank Name" />
          </FieldsLayout>
          <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
            Penny Drop
          </Typography>
          <FieldsLayout>
            <InputField type="text" name="penny_drop_status" text="Penny Drop Status" />
          </FieldsLayout>
          <FieldsLayout>
            <InputField type="text" name="name_as_per_bank" text="Name as per Bank" />
          </FieldsLayout>
        </FormikProvider>
      </TabFromLayout>
    </Box>
  );
};

CDURequestsBankDetailsPage.getLayout = (
  page:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
) => <DashboardLayout>{page}</DashboardLayout>;
export default CDURequestsBankDetailsPage;
