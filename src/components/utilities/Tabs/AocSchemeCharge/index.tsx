import TabHeader from "@components/utilities/layouts/TabHeader";
import UtlitiesLayout from "@components/utilities/layouts/UtlitiesLayout";
import React from "react";
import AocShemeFormLayout from "./Layouts/AocShemeFormLayout";

const AocSchemeCharge = () => {
  return (
    <UtlitiesLayout>
      {/* <TabHeader
        leftText="Account Opening Scheme"
        rightButton3="Add Scheme"
        rightButton4="Modify Scheme"
      /> */}
      <AocShemeFormLayout />
    </UtlitiesLayout>
  );
};

export default AocSchemeCharge;
