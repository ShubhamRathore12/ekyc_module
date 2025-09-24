import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import React from "react";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.isAuthenticated) {
      router.replace("/dashboard");
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, auth.isAuthenticated]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
};

export default GuestGuard;
