import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import close from "@public/assets/close.svg";
import Image from "next/image";

const BAPModal = ({ closeHandle, open }: any) => {
  return (
    <>
      <Dialog open={open} onClose={closeHandle}>
        <Button
          onClick={closeHandle}
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 1,
          }}
        >
          <Image src={close} alt="close" />
        </Button>
        <DialogTitle>Open New Account</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: 2,
              width: { xs: "100%", sm: "400px", md: "450px" },
            }}
          >
            <Typography sx={{ mt: 4 }}>Email Id</Typography>
            <TextField type="email" fullWidth placeholder="Enter your email" />
            <Typography>Mobile</Typography>
            <TextField type="text" fullWidth placeholder="Enter your mobile number" />
            <Button sx={{ mt: 3, height: "50px" }} variant="contained" fullWidth>
              Verify
            </Button>
            <Button sx={{ height: "50px" }} variant="outlined" fullWidth>
              Back to Dashboard
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BAPModal;
