import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import SaveIcon from "@mui/icons-material/Save";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { Cropper, ReactCropperElement } from "react-cropper";
import { BlobFile } from "../lib";

interface CropperProps {
  openCropModal: boolean;
  handleCropModalClose: () => void;
  open: boolean;
  close: string;
  currentFile: BlobFile | undefined;
  cropperRef: React.RefObject<ReactCropperElement>;
  setCropper: React.Dispatch<React.SetStateAction<Cropper | undefined>>;
  rotateLeft: () => void;
  rotateRight: () => void;
  handleSave: () => void;
  isLoading?: boolean;
}

export default function CropComponent(props: CropperProps) {
  const {
    openCropModal,
    handleCropModalClose,
    close,
    currentFile,
    cropperRef,
    setCropper,
    rotateLeft,
    rotateRight,
    handleSave,
    isLoading,
  } = props;

  const zoomIn = () => {
    if (cropperRef.current) {
      // cropperRef.current.cropper.rotate(-90);
      cropperRef.current.cropper.zoom(0.1);
    }
  };

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.zoom(-0.1);
    }
  };
  const initialCropperRef: React.RefObject<ReactCropperElement> = cropperRef;

  return (
    <Dialog
      open={openCropModal}
      onClose={handleCropModalClose}
      PaperProps={{
        sx: {
          minWidth: "min(100%, 500px)",
          p: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Crop</Typography>
        <Button onClick={handleCropModalClose} sx={{ p: 0, justifyContent: "end" }}>
          <Image src={close} alt="close" />
        </Button>
      </Box>
      <Box>
        {currentFile?.type !== "application/pdf" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              pt: 3,
              width: "auto",
              m: "0 auto",
            }}
          >
            <Cropper
              ref={cropperRef}
              src={currentFile?.base64 as string} // style={{ height: lgUp ? '400' : mdUp ? 300 : smUp ? 300 : 200, width: 300 }}
              style={{
                // minWidth: "min(350px, 500px)",
                minWidth: "min(100%, 500px)",

                height: "400px",
              }} // Cropper.js options
              viewMode={2}
              rotatable={true}
              // background={false}
              // responsive={true}
              // autoCropArea={2}
              // aspectRatio={16 / 9}
              checkOrientation={false}
              onInitialized={(instance: React.SetStateAction<Cropper | undefined>) => {
                setCropper(instance);
              }}
              guides={false}
            />
            <Box
              sx={{
                m: 2,
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <IconButton onClick={rotateLeft}>
                <RotateLeftIcon fontSize="large" color="primary" />
              </IconButton>
              <IconButton onClick={rotateRight}>
                <RotateRightIcon fontSize="large" color="primary" />
              </IconButton>
              <IconButton onClick={zoomIn}>
                <ZoomInIcon fontSize="large" color="primary" />
              </IconButton>
              <IconButton onClick={zoomOut}>
                <ZoomOutIcon fontSize="large" color="primary" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              m: 5,
            }}
          >
            Cannot be cropped
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress /> : "Save"}
        </Button>
      </Box>
    </Dialog>
  );
}
