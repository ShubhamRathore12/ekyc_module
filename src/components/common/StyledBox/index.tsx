// import { Box } from "@mui/material";
// import { experimental_sx, styled } from "@mui/material/styles";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const StyledBox = styled(Box)(({ theme }) =>
//   experimental_sx({
//     // padding: theme.spacing(2), // p: 2
//     p: 2,
//   })
// );

// export default StyledBox;

import { Box } from "@mui/material";

const StyledBox = (props: any) => (
  <Box {...props} sx={{ p: 2 }} />
);

export default StyledBox;