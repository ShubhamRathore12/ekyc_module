import { Box, Button, Typography } from "@mui/material";
import Verified from "icons/Verified";
import { useRouter } from "next/router";
const PasswordUpdated = () => {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">Password Updated</Typography>
        </Box>
        <Verified />
        <Typography>Your Password has been updated</Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            height: { xs: "50px", xl: "60.98px" },
            mt: { xs: 2.5, xl: 4.5 },
            "&:hover": {
              bgcolor: "primary.main",
            },
          }}
          onClick={() => router.push("/signin")}
        >
          Login to continue
        </Button>
      </Box>
    </>
  );
};

export default PasswordUpdated;
