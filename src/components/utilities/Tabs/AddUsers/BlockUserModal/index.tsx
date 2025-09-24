import { Box, Button, CircularProgress, Dialog, Stack, Typography } from "@mui/material";
import close from "@public/assets/close.svg";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { useBlockAdminMutation } from "services/admin.service";
import { AdminEntity } from "types/admin";

interface IProps {
  handleClose: () => void;
  open: boolean;
  row: AdminEntity;
  reload: () => void;
}

const BlockUserModal = ({ handleClose, open, row, reload }: IProps) => {
  const [blockUser] = useBlockAdminMutation();
  const [isBlocking, setIsBlocking] = React.useState(false);
  async function handleUserBlock() {
    if (row.is_blocked) {
      setIsBlocking(true);
      try {
        const res = await blockUser({
          username: row.username,
          is_blocked: false,
        }).unwrap();
        toast.success(res.message);
      } catch (error) {
        toast.error((error as any)?.error || "Something went wrong");
      } finally {
        reload();
        handleClose();
        setIsBlocking(false);
      }
    } else if (!row.is_blocked) {
      setIsBlocking(true);
      try {
        const res = await blockUser({
          username: row.username,
          is_blocked: true,
        }).unwrap();
        toast.success(res.message);
      } catch (error) {
        toast.error((error as any)?.error || "Something went wrong");
      } finally {
        reload();
        handleClose();
        setIsBlocking(false);
      }
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            padding: 4,
          },
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 1,
          }}
        >
          <Image src={close} alt="close" />
        </Button>

        <>
          <Stack gap={3}>
            <Typography variant="h5" fontWeight={600}>
              Block this Admin?
            </Typography>
            <Typography variant="h6" sx={{ color: "#000" }}>
              {row?.is_blocked ? "Unblock : " : "Block"}{" "}
              <Typography variant="h6" color="text.secondary" component="span">
                {row?.username}
              </Typography>
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
                  handleUserBlock();
                }}
                color="error"
                sx={{
                  "&:hover": {
                    bgcolor: "rgb(234, 58, 61)",
                  },
                }}
              >
                {isBlocking ? <CircularProgress /> : row?.is_blocked ? "Unblock" : "Block"}
              </Button>
            </Box>
          </Stack>
        </>
      </Dialog>
    </>
  );
};

export default BlockUserModal;
