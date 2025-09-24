import GuestGuard from "@components/auth/GuestGuard";
import ForgotPassword from "@components/common/ForgotPassword";
import NewPassword from "@components/common/NewPassword";
import VerifyOTP from "@components/common/VerifyOTP";
import Typography from "@mui/material/Typography";

import React from "react";

const EnableOTP = () => {
  // const [isEnabled, setIsEnabled] = React.useState(false);
  const [stage, setStage] = React.useState<"init" | "otp-sent" | "generate">("init");
  const [name, setName] = React.useState<string>("");
  const [at, setAt] = React.useState<string>();
  const [, setGenerateOtpData] = React.useState();

  const is2FAEnabled = false; // take this from API

  return (
    <GuestGuard>
      <Typography variant="h1" color="initial">
        {stage === "init" ? (
          <ForgotPassword setStage={setStage} setAt={setAt} setName={setName} />
        ) : stage === "otp-sent" && at && name ? (
          <VerifyOTP setStage={setStage} at={at} username={name} setAt={setAt} />
        ) : (
          at && <NewPassword setStage={setStage} at={at} />
        )}
      </Typography>
    </GuestGuard>
  );
};

export default EnableOTP;
