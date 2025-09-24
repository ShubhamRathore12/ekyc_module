import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import React from "react";

interface ViewGuardProps {
  children: React.ReactNode;
}

const exceptions = ["/change-password"];

const ViewGuard: React.FC<ViewGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const { login } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace({
        pathname: "/signin",
        query: !exceptions.some((url) => url === router.asPath) ? { redirect: router.asPath } : {},
      });
    } else if (login?.data.admin_type === "telecaller") {
      router.replace({
        pathname: "/dashboard",
        query: {},
      });
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

export default ViewGuard;
