import { Box } from "@mui/system";
import React from "react";
const FieldsLayout = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        // py: 2,
      }}
    >
      {props.children}
    </Box>
  );
};

export default FieldsLayout;
