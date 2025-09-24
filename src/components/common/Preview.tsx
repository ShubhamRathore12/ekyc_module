import useWindowDimensions from "@hooks/useWindowDimensions";
import close from "@public/assets/close.svg";

import LoopIcon from "@mui/icons-material/Loop";
import TransformIcon from "@mui/icons-material/Transform";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import noFiles from "@public/assets/no files.png";
import handleError from "@utils/handleError";
import Compress from "compress.js";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ReactCropperElement } from "react-cropper";
import { toast } from "react-hot-toast";
import { ImageDecorator } from "react-viewer/lib/ViewerProps";
import { useUpdateImageMutation } from "services/ekyc.service";
import { useDispatch } from "store";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import CropComponent from "./Cropper/CropperComponent";
import { BlobFile } from "./lib";

const StyledSwiper = styled(Swiper)(({ theme }) => ({
  minHeight: "inherit",
  ".swiper-button-next": {
    color: theme.palette.primary.main,
  },
  ".swiper-button-prev": {
    color: theme.palette.primary.main,
  },
  ".swiper-slide": {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));
interface IProps {
  files: BlobFile[];
  stage?: string;
  clientId?: string;
}

const Preview = ({ files, stage, clientId }: IProps) => {
  const images: any = [];
  const ReactViewer = dynamic(() => import("react-viewer"), { ssr: false });
  // files.map((file: any) => {
  //   images.push({
  //     url: file?.preview,
  //     type: file?.type,
  //   });
  // });

  // const reader = new FileReader();
  // files.map((file: File) => {
  //   reader.readAsArrayBuffer(file);
  //   reader.onload = async () => {
  //
  //     const pdfDoc = await PDFDocument.load(reader.result);
  //     const pdf = await pdfDoc.save();
  //     const bytes = new Uint8Array(pdf);
  //     const blob = new Blob([bytes], { type: "application/pdf" });
  //     const docUrl = URL.createObjectURL(blob);
  //
  //   };
  // });
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    return setWindowWidth(width);
  }, [width]);
  //

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const handleCropModalOpen = () => setOpenCropModal(true);
  const handleCropModalClose = () => setOpenCropModal(false);
  const currentFile = files?.at(currentIndex);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [cropper, setCropper] = React.useState<Cropper>();
  const [flipValue, setFlipValue] = React.useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [updateImage] = useUpdateImageMutation();

  const rotateLeft = () => {
    if (cropperRef.current) {
      // cropperRef.current.cropper.rotate(-90);
      cropperRef.current.cropper.rotate(-90);
    }
  };

  const rotateRight = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(90);
    }
  };

  React.useEffect(() => {
    if (flipValue) {
      cropperRef.current && cropperRef.current.cropper.scale(-1, 1);
    } else {
      cropperRef.current && cropperRef.current.cropper.scale(1, 1);
    }
  }, [flipValue]);
  const compressOptions = {
    size: 5, // the max size in MB, defaults to 2MB
    quality: 1, // the quality of the image, max is 1,
    maxWidth: 1920, // the max width of the output image, defaults to 1920px
    maxHeight: 1920, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
    orientation: 0,
  };
  const compressFile = (file: File) => {
    const compress = new Compress();

    compress
      .compress([file], compressOptions)
      .then(async (data) => {
        const img = data[0];
        const base64str = img.data;
        const imgExt = img.ext;
        const file = Compress.convertBase64ToFile(base64str, imgExt);

        if (file && stage && clientId) {
          setIsUpdating(true);
          try {
            const response = await updateImage({
              action: stage === "segment_upload" ? "delete" : "edit",
              client_id: clientId,
              image: file,
              stage: stage,
            }).unwrap();
            toast.success(response?.message);
            handleCropModalClose();
          } catch (error) {
            handleError(error);
          } finally {
            setIsUpdating(false);
          }
        }

        // const fileSrc = `${img.prefix}${img.data}`;
        // sendFile(file, fileSrc);
        // const link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        // link.setAttribute("download", "something.png");
        // document.body.appendChild(link);
        // link.href = URL.createObjectURL(file);
        // link.click();
        // link.remove();
      })
      .catch(() => {
        // setIsCompressing(true);
      });
  };
  const handleSave = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const file = new File([blob], currentFile?.name || "image.jpeg");
          compressFile(file);
        }
      });

      // compress
      // const link = document.createElement("a");
      // link.href = base64;
      // link.click();
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const [openCrop, setOpenCrop] = useState(false);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setViewerIsOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerIsOpen(false);
  };

  const viewerImages = files
    ?.filter((img: BlobFile) => img.type !== "application/pdf")
    ?.map((image) => ({ src: image.base64 }));

  const [currentImage, setCurrentImage] = useState("");

  const navigationPrevRef = React.useRef<HTMLDivElement>(null);
  const navigationNextRef = React.useRef<HTMLDivElement>(null);

  function formatBytes(sizeinbytes: number, decimals = 2) {
    if (!+sizeinbytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(sizeinbytes) / Math.log(k));

    return `${parseFloat((sizeinbytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  // React.useEffect(() => {
  //   if (files.length > 0) {
  //     const convert = files.map(async (f) => {
  //       return convertFileToJPEG(f as File);
  //     });
  //     Promise.all(convert).then((img) => setImgs(img));
  //   }
  // }, [files]);

  return (
    <Box
      component="div"
      // onMouseEnter={() => {
      //   if (currentFile?.type !== "pdf") handleOpen();
      // }}
      onMouseLeave={() => {
        handleClose();
      }}
      sx={{
        mt: 5,
        background: "#F8F8F8",
        border: "20px solid rgba(66, 66, 66, 0.1)",
        borderRadius: "15.5186px",
        width: "auto",
        height: files.length ? "auto" : "60vh",
        position: "relative",
      }}
    >
      <StyledSwiper
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.activeIndex);
          handleClose();
        }}
        autoplay
        // pagination={{
        //   dynamicBullets: true,
        // }}
        modules={[Navigation]}
        className="mySwiper"
        navigation={true}
        // navigation={{
        //   prevEl: navigationPrevRef.current,
        //   nextEl: navigationNextRef.current,
        // }}
        // onBeforeInit={(swiper) => {
        //   swiper.params.navigation?.prevEl = navigationPrevRef.current
        //   // swiper?.params?.navigation?.prevEl = navigationPrevRef.current;
        //   swiper?.params?.navigation?.nextEl = navigationNextRef.current;
        // }}
      >
        {files?.length ? (
          files.map((file: BlobFile) => {
            return (
              <SwiperSlide key={file?.lastModified}>
                {file?.type === "video/mp4" && (
                  <Box sx={{ textAlign: "center", width: "auto" }}>
                    <video width="100%" height="450" controls>
                      <source src={file?.base64 as string}></source>
                    </video>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="subtitle2">Name : {file?.name}</Typography>
                      <Typography variant="subtitle2">
                        size: {file?.size && formatBytes(file?.size)}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {file?.type === "application/pdf" && (
                  <>
                    <object
                      data={file?.base64 as string}
                      width="100%"
                      height="100%"
                      style={{ paddingInline: "48px" }}
                      type="application/pdf"
                    ></object>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="subtitle2">Name : {file?.name}</Typography>
                      <Typography variant="subtitle2">
                        size: {file?.size && formatBytes(file?.size)}
                      </Typography>
                    </Box>
                  </>
                )}
                {(file?.type === "image/png" ||
                  file?.type === "image/jpeg" ||
                  file?.type === "image/jpg") && (
                  <Tooltip
                    placement="top"
                    title={
                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="h6">Name : {file?.name}</Typography>
                        <Typography variant="h6">
                          size: {file?.size && formatBytes(file?.size)}
                        </Typography>
                      </Box>
                    }
                  >
                    <Box
                      component="div"
                      onMouseEnter={() => {
                        handleOpen();
                        setIsOver(true);
                      }}
                      onMouseLeave={() => {
                        handleClose();
                      }}
                      sx={{
                        height: "450px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Image
                        src={file?.base64 as string}
                        alt="Slider"
                        height="450px"
                        width="400px"
                        // layout='fill'
                        objectFit="contain"
                      />
                    </Box>
                  </Tooltip>
                )}
              </SwiperSlide>
            );
          })
        ) : (
          <SwiperSlide>
            <Box
              sx={{
                color: "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "500px",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Image src={noFiles} alt="no images image" height={40} width={40} />
              <Typography variant="h5">No Files yet</Typography>
            </Box>
          </SwiperSlide>
        )}
      </StyledSwiper>
      <Box
        onMouseEnter={handleOpen}
        sx={{
          display: open ? "block" : "none",
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%, -50%)",
          zIndex: 1,
        }}
      >
        <Chip
          label={
            <Stack direction="row" gap={2}>
              <IconButton size="large" onClick={handleCropModalOpen}>
                <TransformIcon fontSize="large" color="secondary" sx={{ color: "#FFFF" }} />
              </IconButton>
              <IconButton size="large" onClick={handleCropModalOpen}>
                <LoopIcon fontSize="large" color="secondary" sx={{ color: "#FFFF" }} />
              </IconButton>
              <IconButton size="large" onClick={() => handleImageClick(currentIndex)}>
                <ZoomInIcon fontSize="large" color="secondary" sx={{ color: "#FFFF" }} />
              </IconButton>
            </Stack>
          }
          sx={{ height: "50px", bgcolor: "black" }}
        />
      </Box>
      <CropComponent
        openCropModal={openCropModal}
        handleCropModalClose={handleCropModalClose}
        open={open}
        close={close}
        currentFile={currentFile}
        cropperRef={cropperRef}
        setCropper={setCropper}
        rotateLeft={rotateLeft}
        rotateRight={rotateRight}
        handleSave={handleSave}
        isLoading={isUpdating}
      />
      <ReactViewer
        visible={viewerIsOpen}
        onClose={handleCloseViewer}
        images={viewerImages as ImageDecorator[]}
        activeIndex={activeImageIndex}
      />
    </Box>
  );
};

export default Preview;

function setPdfInfo(docUrl: string) {
  throw new Error("Function not implemented.");
}
// className={"swiper-fixed-width-300"}
