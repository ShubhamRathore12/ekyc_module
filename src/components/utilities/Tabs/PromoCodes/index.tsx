import TabHeader from "@components/utilities/layouts/TabHeader";
import UtlitiesLayout from "@components/utilities/layouts/UtlitiesLayout";
import React from "react";
import PromocodesFormLayout from "./Layouts/PromocodesFormLayout";

const PromoCodes = () => {
  return (
    <UtlitiesLayout>
      {/* <TabHeader
        leftText="Add Promo Code"
        rightButton1={"Add Scheme"}
        rightButton2={"Modify Scheme"}
      /> */}
      <PromocodesFormLayout />
    </UtlitiesLayout>
  );
};

export default PromoCodes;
