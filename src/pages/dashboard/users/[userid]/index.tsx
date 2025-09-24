import AuthGuard from "@components/auth/AuthGuard";
import Tabs from "@components/Dashboard/UserDetailsTabs";
import { Box, Button, Typography } from "@mui/material";
import comparePathnames from "@utils/comparePathnames";
import getTimeDifference from "@utils/getTimeDifference";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Renderable, toast, Toast, ValueFunction } from "react-hot-toast";
import { useLockKYCMutation, useUnlockKYCMutation } from "services/ekyc.service";
import appSlice from "slices/app.slice";
import { useDispatch, useSelector } from "store";

const EKYC: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [lockKYC] = useLockKYCMutation();
  const [unlockKYC] = useUnlockKYCMutation();
  const expirationTime = useSelector((state) => state.app.expirationTime);

  const [locking, setLocking] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const client_id = router.query.userid as string;

  // locking the ekyc when page is loaded
  React.useEffect(() => {
    if (client_id && !locking) {
      lockKYC({ client_id })
        .unwrap()
        .then(
          (response: {
            message: Renderable | ValueFunction<Renderable, Toast>;
            data: { expiration_time: string | number | Date };
          }) => {
            setLocking(true);
            toast.success(response.message, { id: "LOCK_SUCCESS" });
            dispatch(appSlice.actions.setExpirationTime(new Date(response.data.expiration_time)));
          }
        )
        .catch((error: { data: any }) => {
          // upon error, route the user back to dashboard
          setLocking(false);
          setIsError(true);
          toast.error(error?.data?.error || "Something went wrong!!", { id: "LOCK_ERROR" });
          router.push("/dashboard");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id, locking]);

  // unlock the ekyc when page is unloaded
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      const isMovingAway = comparePathnames(router.asPath, url);
      if (isMovingAway && client_id) {
        dispatch(appSlice.actions.setExpirationTime(null));
        unlockKYC({ client_id })
          .unwrap()
          .then((response: { message: Renderable | ValueFunction<Renderable, Toast> }) => {
            toast.success(response.message, { id: "UNLOCK_SUCCESS" });
          })
          .catch((error: { error: any }) => {
            toast.error(error?.error || "Something went wrong!!", { id: "UNLOCK_ERROR" });
          });
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id]);

  // this runs when the ekyc is locked by the user
  React.useEffect(() => {
    if (!expirationTime) return;
    const handleTimeChange = () => {
      const currentTime = new Date();

      const diff = getTimeDifference(expirationTime, currentTime);
      // handle time over event
      if (!diff) {
        document.body.style.pointerEvents = "none";
        toast(
          (t) => (
            <Box>
              <Typography>Time over. Want more time?</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    setLocking(false);
                    toast.dismiss(t.id);
                  }}
                  sx={{ color: "primary.main" }}
                >
                  Yes
                </Button>
                {/* <Link href="/dashboard" passHref> */}
                <Button
                  component="a"
                  variant="text"
                  color="secondary"
                  sx={{ color: "secondary.main" }}
                  onClick={() => {
                    router.push("/dashboard");
                    toast.dismiss(t.id);
                  }}
                >
                  Back to dashboard
                </Button>
                {/* </Link> */}
              </Box>
            </Box>
          ),
          { id: "TIME_OVEVR", duration: 1000000 }
        );
      }
      dispatch(appSlice.actions.setTimeLeft(diff));
    };
    const interval = setInterval(handleTimeChange, 1000);
    return () => {
      document.body.style.pointerEvents = "auto";
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expirationTime]);

  return <Tabs />;
};

EKYC.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default EKYC;
