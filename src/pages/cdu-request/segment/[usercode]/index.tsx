import FieldsLayout from "@components/common/FieldsLayout";
import InputField from "@components/common/InputField";
import { BlobFile } from "@components/common/lib";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { Box } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";

const CDURequestsSegmentUpdation: NextPage = () => {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const formik = useFormik({
    initialValues: {
      bo_code: "BD00009",
      name: "Govind Kumar",
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
        formHeading="Segment Updation - BD00009"
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
        </FormikProvider>
      </TabFromLayout>
    </Box>
  );
};

CDURequestsSegmentUpdation.getLayout = (
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

export default CDURequestsSegmentUpdation;
