import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import handleError from "@utils/handleError";
import React from "react";
import toast from "react-hot-toast";
import { useDeleteUserMutation } from "services/ekyc.service";

interface IProps {
  handleClose: () => void;
  open: boolean;
  phone: string;
  userType: string;
  panNumber: string
}

const DeleteUserModal = ({ handleClose, open, phone, userType, panNumber }: IProps) => {
  const [deleteUser] = useDeleteUserMutation();
  const [isDeleting, setIsDeleting] = React.useState(false);
  async function handleUserDelete() {
    setIsDeleting(true);
    try {
      const res = await deleteUser({
        mobile_number: phone,
        user_type: userType,
        ...(userType !== "REGULAR" && { pan_number: panNumber })
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
      handleClose();
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "min(100%, 650px)",
            p: 3,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Delete user</Typography>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <>
          <Stack gap={3} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {`Are you sure want to delete this user with phone number : ${phone}?`}
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button fullWidth size="large" variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {
                  handleUserDelete();
                }}
                color="error"
                disabled={isDeleting}
                sx={{
                  "&:hover": {
                    bgcolor: "rgb(234, 58, 61)",
                  },
                }}
              >
                {isDeleting ? <CircularProgress /> : "Delete"}
              </Button>
            </Box>
          </Stack>
        </>
      </Dialog>
    </>
  );
};

export default DeleteUserModal;
