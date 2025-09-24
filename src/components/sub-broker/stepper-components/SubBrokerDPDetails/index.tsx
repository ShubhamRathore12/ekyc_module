import DynamicField from "@components/common/DynamicField";
import LabelContainer from "@components/common/LabelContainer";
import TabFromLayout from "@components/Dashboard/UserDetailsTabs/TabFromLayout";
import SelectField from "@components/utilities/Tabs/BrokerageScheme/utils/SelectField";
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

const SubBrokerDPDetails = () => {
  const formik = useFormik({
    initialValues: {
      want_to_open_dp_account: "",
      dp_account_type: "",
      poa: "",
      statement_frequency: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });
  return (
    <>
      <TabFromLayout formHeading="DP Details" formSubheading="" subtext="" saveButton={true}>
        <Box>
          <FormikProvider value={formik}>
            <DynamicField>
              <LabelContainer>
                <Typography>Want DP Account</Typography>
              </LabelContainer>
              <RadioGroup row name="want_to_open_dp_account">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </DynamicField>
            <SelectField name="dp_account_type" label="Dp Account Type" />
            <DynamicField>
              <LabelContainer>
                <Typography>POA</Typography>
              </LabelContainer>
              <RadioGroup row name="poa">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </DynamicField>
            <SelectField name="statement_frequency" label="Statement Frequency" />
          </FormikProvider>
        </Box>
      </TabFromLayout>
    </>
  );
};

export default SubBrokerDPDetails;
