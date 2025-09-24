import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import React from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const exceptions = ["/change-password"];

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace({
        pathname: "/signin",
      });
    } else if (
      auth?.login?.data.admin_type === "telecaller" &&
      !exceptions.includes(router.pathname)
    ) {
      router.replace({
        pathname: "/telecaller",
      });
      setChecked(true);
    } else if (
      auth?.login?.data.admin_type === "backoffice" &&
      !exceptions.includes(router.pathname)
    ) {
      router.replace({
        pathname: "/backoffice",
      });
      setChecked(true);
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

export default AuthGuard;
