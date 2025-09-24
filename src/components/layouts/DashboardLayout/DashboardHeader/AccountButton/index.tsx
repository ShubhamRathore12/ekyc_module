import { useAuth } from "@hooks/useAuth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import React from "react";
import { AccountPopover } from "../AccountPopover";

const AccountButton = () => {
  const { login } = useAuth();
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = React.useState<boolean>(false);
  const [username, setUserName] = React.useState("");
  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  // React.useEffect(() => {
  //   var name = "at";
  //   const token = localStorage.getItem(name);
  //   var base64Url = token?.split(".")[1];
  //   var base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  //   if (base64) {
  //
  //     var jsonPayload = decodeURIComponent(
  //       window
  //         .atob(base64)
  //         .split("")
  //         .map(function (c) {
  //           return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //         })
  //         .join("")
  //     );
  //     setUserName(JSON.parse(jsonPayload));
  //   }
  // }, []);
  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
          ml: 2,
        }}
      >
        <Avatar sx={{ backgroundColor: "transparent", color: "text.secondary" }}>
          <AccountCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="subtitle2" sx={{ display: { xs: "none", md: "block" } }}>
          {kebabToCapitalize(login?.data.admin_type as string)}
        </Typography>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export default AccountButton;
