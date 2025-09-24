import { Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import close from "@public/assets/close.svg";
import Image from "next/image";
import ModalIcon from "../assets/ModalIcon.png";
const PanModal = ({ closeHandle, open }: any) => {
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
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box>
              <Image src={ModalIcon} alt="ModalIcon" width={200} height={200} />
            </Box>
            <Typography variant="h5" fontWeight={600}>
              Welcome to{" "}
              <Typography variant="h5" display="inline" fontWeight={400} color="primary.main">
                Shri MOHD MOHSIN RAZA
              </Typography>
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              (PAN: BVJPR7761L)
            </Typography>
            <Typography variant="body2">
              By providing us information in few simple steps you will be able to open your
              Demat/Trading account and start trading online!
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2, height: "50px" }}>
              Continue
            </Button>
            <Button variant="outlined" fullWidth sx={{ height: "50px" }}>
              Back
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PanModal;
