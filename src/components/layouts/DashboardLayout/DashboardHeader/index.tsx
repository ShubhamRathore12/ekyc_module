import EastIcon from "@mui/icons-material/East";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "store";
import AccountButton from "./AccountButton";

interface IProps {
  isExpanded: boolean;
  clickHandler: any;
}

export const DashboardHeader = ({ isExpanded, clickHandler }: IProps) => {
  const router = useRouter();
  const timeLeft = useSelector((state) => state.app.timeLeft);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isUserPage = !!router.query.userid;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const date = React.useRef<Date>(new Date());

  return (
    <Toolbar
      sx={{
        color: "secondary.main",
        bgcolor: "#FFFF",
        "&.MuiToolbar-root": {
          position: "sticky",
          top: 0,
          zIndex: 3,
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.10)",
        },
      }}
    >
      <IconButton onClick={clickHandler}>{isExpanded ? <MenuIcon /> : <EastIcon />}</IconButton>
      {isUserPage && timeLeft && <Typography>{timeLeft} left to edit this user</Typography>}
      <Box
        sx={{
          display: "flex",
          marginLeft: "auto",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* <IconButton>
          <NotificationsIcon />
        </IconButton> */}
        <Typography sx={{ textAlign: "center" }} variant="subtitle2">
          {date.current.toDateString()}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <AccountButton />
        </Box>
      </Box>
      {/* <Box sx={{ display: { xs: "block", sm: "none" }, ml: "auto" }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Box sx={{display:'flex', flexDirection:'column', p: 2, alignItems:'center', gap: 2}}>
            <Typography>Notifications</Typography>
            <Typography>Monday, April 12, 2022</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <AccountCircleRoundedIcon />
              <Typography>Admin Profile</Typography>
            </Box>
          </Box>
        </Menu>
      </Box> */}
    </Toolbar>
  );
};
