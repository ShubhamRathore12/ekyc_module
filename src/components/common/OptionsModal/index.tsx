import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Box } from "@mui/system";
import close from "@public/assets/close.svg";
import Image from "next/image";
import Preview from "../Preview";

const OptionsModal = ({ closeHandle, open, files }: any) => {
  return (
    <Box>
      <Dialog fullScreen open={open} onClose={closeHandle}>
        <Button
          onClick={closeHandle}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 1,
          }}
        >
          <Image src={close} alt="close" />
        </Button>
        <DialogTitle>Full Window</DialogTitle>
        <DialogContent>
          <Box>
            <Preview files={files} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default OptionsModal;
