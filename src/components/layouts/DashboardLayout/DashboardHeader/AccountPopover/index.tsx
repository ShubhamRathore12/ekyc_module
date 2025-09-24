import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, ListItemIcon, ListItemText, MenuItem, Popover, Typography } from "@mui/material";
import { useRouter } from "next/router";
import type { FC } from "react";
import authSlice from "slices/auth.slice";
import { useDispatch } from "store";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = () => dispatch(authSlice.actions.logout());

  const handleLogout = (): void => {
    onClose?.();
    logout();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box sx={{ my: 1 }}>
        <MenuItem onClick={() => router.push("/change-password")}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Logout</Typography>} />
        </MenuItem>
      </Box>
    </Popover>
  );
};
