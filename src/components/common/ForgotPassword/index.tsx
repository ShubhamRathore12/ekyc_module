import AuthLayout from "@components/layouts/AuthLayout";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import handleError from "@utils/handleError";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { authApi } from "services/auth.service";

// const OTPTextField = styled(TextField)({
//   width: "65px",
//   height: "75px",
//   "& .MuiInputBase-input": {
//     backgroundColor: "hsla(0, 0%, 44%, 0.05)",
//     textAlign: "center",
//   },
// });

interface IProps {
  setStage: React.Dispatch<React.SetStateAction<"init" | "otp-sent" | "generate">>;
  setAt: React.Dispatch<React.SetStateAction<string | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const ForgotPassword = (props: IProps) => {
  const { setAt, setStage, setName } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <AuthLayout>
      <Box
        sx={{
          // mt: { xs: 6, sm: 6, md: 6, lg: 8 },
          // pb: '58px',
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: "auto",
          // mt: 7
        }}
      >
        <>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Forgot password
          </Typography>
          <Typography variant="h5" fontWeight={500}>
            Hello Admin
          </Typography>
          <Box sx={{ height: "120px", display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography>User name</Typography>
            <TextField
              fullWidth
              variant="outlined"
              id="adornment-password"
              placeholder="user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Typography
              component="a"
              href="/signin"
              sx={{
                textAlign: "right",
                cursor: "pointer",
                color: "hsla(229, 67%, 55%, 1)",
              }}
            >
              Login here
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              height: "55px",
              mt: 4.5,
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
            onClick={async () => {
              setName(username);
              try {
                setIsLoading(true);
                const res = await authApi.setOtp({
                  username: username,
                });
                toast.success(res?.data?.message);
                setStage("otp-sent");
                setAt(res?.data?.data?.token);
                setIsLoading(false);
              } catch (error) {
                setIsLoading(false);
                handleError(error);
              }
            }}
            disabled={isLoading || username.length === 0}
          >
            {isLoading ? <CircularProgress /> : "Submit"}
          </Button>
        </>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPassword;
