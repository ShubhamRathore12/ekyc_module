import TabHeader from "@components/utilities/layouts/TabHeader";
import UtlitiesLayout from "@components/utilities/layouts/UtlitiesLayout";
import React from "react";
import FormLayout from "./Layouts/BrokerageSchemeFormLayout";

const BrokerageScheme = () => {
  return (
    <UtlitiesLayout>
      {/* <TabHeader
        leftText={"Add or Modify Existing Schemes"}
        rightButton1={"Add Scheme"}
        rightButton2={"Modify Scheme"}
      /> */}
      <FormLayout />
    </UtlitiesLayout>
  );
};

export default BrokerageScheme;
