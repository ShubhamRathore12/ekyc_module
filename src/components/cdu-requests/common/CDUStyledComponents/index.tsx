// import { Box, Button } from "@mui/material";
// import { experimental_sx, styled } from "@mui/material/styles";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const CDUStyledFormBox = styled(Box)(({ theme }) =>
//   experimental_sx({
//     // padding: theme.spacing(2), // p: 2
//     // mt: 2,
//     display: "flex",
//     alignItems: { xs: "flex-start", sm: "center" },
//     flexDirection: { xs: "column", sm: "row" },
//   })
// );
// export const CDUSSearchButton = styled(Button)(({ theme }) =>
//   experimental_sx({
//     // padding: theme.spacing(2), // p: 2
//     // mt: 2,
//     width: { xs: "100%", md: "300px" },
//     height: "50px",
//     mb: 1,
//   })
// );

import { Box, Button } from "@mui/material";

export const CDUStyledFormBox = (props: any) => (
  <Box
    {...props}
    sx={{
      display: "flex",
      alignItems: { xs: "flex-start", sm: "center" },
      flexDirection: { xs: "column", sm: "row" },
    }}
  />
);

export const CDUSSearchButton = (props: any) => (
  <Button
    {...props}
    sx={{
      width: { xs: "100%", md: "300px" },
      height: "50px",
      mb: 1,
    }}
  />
);
