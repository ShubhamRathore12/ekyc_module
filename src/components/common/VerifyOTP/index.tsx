import AuthLayout from "@components/layouts/AuthLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import handleError from "@utils/handleError";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import OtpInput from "react-otp-input";
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
  at: string;
  username: string;
}

const VerifyOTP = (props: IProps) => {
  const { setStage, at, username, setAt } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [count, setCount] = useState(60);

  const [code, setCode] = useState("");

  React.useEffect(() => {
    setTimeout(() => {
      if (count !== 0) setCount((prev) => prev - 1);
    }, 1000);
  }, [count]);

  return (
    <AuthLayout>
      <Box
        sx={{
          // mt: { xs: 6, sm: 6, md: 6, lg: 8 },
          // pb: '58px',
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "start" },
          gap: 3,
          margin: "auto",
          // mt: 7
        }}
      >
        <>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hello Admin
          </Typography>
          <Typography variant="h5" fontWeight={500}>
            Verify OTP
          </Typography>
          <Typography textAlign={{ xs: "center", md: "unset" }}>
            check you email according to the username given.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <OtpInput
              containerStyle={{ gap: "14px" }}
              placeholder="-"
              onChange={(val: string) => setCode(val)}
              value={code}
              numInputs={6}
              className="react-otp-input"
            />
          </Box>
          <Typography>
            Didn&apos;t recieve the OTP?
            {count !== 0 ? (
              <Typography display="inline" sx={{ color: "hsla(229, 67%, 55%, 1)" }}>
                {" "}
                {`Resend in ${count} sec`}
              </Typography>
            ) : (
              <Button
                sx={{ display: "inline", color: "hsla(229, 67%, 55%, 1)" }}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disableElevation
                onClick={async () => {
                  setCount(60);
                  try {
                    const res = await authApi.setOtp({
                      username: username,
                    });
                    toast.success(res?.data?.message);
                    setStage("otp-sent");
                    setAt(res?.data?.data?.token);
                    setIsLoading(false);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Resend
              </Button>
            )}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={code.length !== 6 || isLoading}
            sx={{
              height: "55px",
              mt: { xs: 2.5, xl: 4.5 },
              maxWidth: "462px",
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
            onClick={async () => {
              try {
                setIsLoading(true);
                const res = await authApi.verifyOTP({
                  otp: code,
                  at: at,
                });
                toast.success(res?.data?.message);
                setStage("generate");
                setIsLoading(false);
              } catch (error) {
                setIsLoading(false);
                handleError(error);
              }
            }}
          >
            {isLoading ? <CircularProgress /> : "Submit"}
          </Button>
        </>
      </Box>
    </AuthLayout>
  );
};

export default VerifyOTP;
