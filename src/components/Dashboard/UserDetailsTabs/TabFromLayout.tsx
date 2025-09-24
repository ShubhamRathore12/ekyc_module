import { CropOptionIcon, DeleteOptionIcon, FullWindowOptionIcon } from "@icons/sidebar/TabOptions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  FormControlLabel,
  Menu,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import close from "@public/assets/close.svg";
import "cropperjs/dist/cropper.css";
import { ReactCropperElement } from "react-cropper";

import CropComponent from "@components/common/Cropper/CropperComponent";
import OptionsModal from "@components/common/OptionsModal";
import Preview from "@components/common/Preview";
import { BlobFile } from "@components/common/lib";
import { useMounted } from "@hooks/useMounted";
import { convertFileToJPEG } from "@utils/convert-file-to-jpeg";
import { identifyFile, identifyFilename } from "@utils/identify-file";
import Compress from "compress.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper } from "swiper/react";
import "swiper/swiper.min.css";

interface IProps {
  formHeading?: string;
  formSubheading?: string;
  children?: React.ReactNode | React.ReactNode[];
  subtext?: string;
  files?: BlobFile[];
  setFiles?: React.Dispatch<React.SetStateAction<BlobFile[]>>;
  cdurequests?: boolean;
  eSignNotdoneOnChange?: (e: any) => void;
  saveButton?: boolean;
  images?: string[];
  stage?: string;
  client_id?: string;
  Content?: React.FC;
}

const ReactViewer = dynamic(() => import("react-viewer"), { ssr: false });

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
    justifyContent: "center",
    alignItems: "center",
  },
}));

const TabFromLayout = ({
  formHeading,
  formSubheading,
  children,
  files,
  subtext,
  setFiles,
  cdurequests = false,
  eSignNotdoneOnChange,
  saveButton = false,
  images,
  stage,
  client_id,
  Content,
}: IProps) => {
  files = [];
  // images = [
  //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/logo/af90c1e5-703f-4705-a935-2b039289c28f.png",
  //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/pitch_deck/bb1a412d-f845-4069-af80-f24959cbbfbd.pdf",
  //   "https://dev-ma-public-s3.s3.ap-south-1.amazonaws.com/61cc230c-64fb-4462-b9a1-a90a2dba84ba/cover_image/d69a90bc-a04c-45fe-81f9-74be20e2d8cf.jpg",
  // ];

  // const [windowWidth, setWindowWidth] = useState(0);
  // const mounted = useMounted();
  // const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(1);
  // const currentImage = images?.at(currentIndex);
  // const currentIndex = useSelector((state) => state.app.currentSlide);
  const currentFile = files?.at(currentIndex);

  const router = useRouter();

  // useEffect(() => {
  //   return setWindowWidth(width);
  // }, [width]);

  //////////////////////////////////
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /////////////////////////////////

  const [currentMenu, setCurrentMenu] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [blobFiles, setBlobFiles] = useState<BlobFile[]>([]);

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setViewerIsOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerIsOpen(false);
  };

  const viewerImages = images
    ?.filter((img) => identifyFile(img) !== "pdf")
    ?.map((image) => ({ src: image }));
  if (currentMenu === "open in large window") {
    setOpenModal(true);
  }
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleCropModalOpen = () => setOpenCropModal(true);
  const handleCropModalClose = () => setOpenCropModal(false);

  // function handleModalFeature(menu: string) {}

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
  };
  const [cropper, setCropper] = React.useState<Cropper>();
  const [flipValue, setFlipValue] = React.useState(false);

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
  const [isCompressing, setIsCompressing] = React.useState(false);

  const compressOptions = {
    size: 2, // the max size in MB, defaults to 2MB
    quality: 1, // the quality of the image, max is 1,
    maxWidth: 1920, // the max width of the output image, defaults to 1920px
    maxHeight: 1920, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
    orientation: 0,
  };
  const compressFile = (file: File) => {
    const compress = new Compress();
    setIsCompressing(true);
    compress
      .compress([file], compressOptions)
      .then((data) => {
        setIsCompressing(false);
        const img = data[0];
        const base64str = img.data;
        const imgExt = img.ext;
        const file = Compress.convertBase64ToFile(base64str, imgExt);
        const fileSrc = `${img.prefix}${img.data}`;
        // sendFile(file, fileSrc);
        const link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute("download", "something.png");
        document.body.appendChild(link);
        link.href = URL.createObjectURL(file);
        link.click();
        // link.remove();
      })
      .catch(() => {
        setIsCompressing(true);
      });
  };

  const handleSave = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "something.png");
          compressFile(file);
        }
      });

      // compress

      //

      // const link = document.createElement("a");
      // link.href = base64;
      // link.click();
    }
  };

  function handleDeletion() {
    setFiles?.([]);
    handleClose();
  }

  const isMounted = useMounted();

  React.useEffect(() => {
    const controller = new AbortController();
    if (!images || !isMounted) return;
    // images.map((img) => {
    //   fetch(img)
    //     .then((res) => {
    //       return res.blob();
    //     })
    //     .then((data) => {
    //       const metadata = {
    //         type: "image/jpeg",
    //       };
    //       const file = new File([data], "test.jpg", metadata);
    //       if (file) {
    //         setBlobFiles([file]);
    //       }
    //     });
    // });
    const promises = images.map((img, i) => {
      return fetch(img, { signal: controller.signal })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          return new File([blob], `${identifyFilename(img)}`, {
            type:
              identifyFile(img) !== ".pdf"
                ? identifyFile(img) === ".png"
                  ? "image/png"
                  : "image/jpeg"
                : "application/pdf",
          });
        })
        .then(async (file) => {
          if (file.type === "image/png") {
            const jpegFile = await convertFileToJPEG(file);
            const url = URL.createObjectURL(jpegFile);
            (jpegFile as BlobFile).base64 = url;
            return jpegFile;
          }
          const url = URL.createObjectURL(file);
          (file as BlobFile).base64 = url;
          return file;
        });
    });

    Promise.all(promises)
      .then((blobFiles) => {
        setBlobFiles(blobFiles);
      })
      .catch((err) => {
        return;
      });

    return () => {
      controller.abort();
    };
  }, [isMounted, images]);

  return (
    <Box sx={{ bgcolor: "#FFFF", borderRadius: 2 }}>
      <Box>
        <Box
          sx={{
            color: "hsla(0, 0%, 26%, 1)",
            p: { xs: 0, sm: 2 },
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ p: 2, flex: { xs: 1 / 2, md: 1 } }}>
            <Typography variant="h6" textAlign="left">
              {formHeading}
              {subtext?.length !== 0 ? (
                <Typography component="span" color="primary.main" fontSize="0.8em">
                  {" " + subtext}
                </Typography>
              ) : (
                <></>
              )}
            </Typography>
            {Content && <Content />}
            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                gap: 2,
                maxHeight: "60vh",
                overflow: "auto",
                direction: "rtl",
                position: "relative",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                  backgroundColor: "rgba(0,0,0,.1)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.1)",
                  borderRadius: "4px",
                },
              }}
            >
              <Box sx={{ direction: "ltr", pl: 2, pb: 2 }}>{children}</Box>
              {/* {!cdurequests && !saveButton && (
                <Box sx={{ position: "absolute", bottom: -65, mb: 2 }}>
                  <Button variant="contained" fullWidth size="large">
                    Save and Continue
                  </Button>
                </Box>
              )} */}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              // minHeight: "500px",
              // maxHeight: "500px",
            }}
          >
            {/* {images && images.length > 0 ? (
              <Box>
                <StyledSwiper
                  modules={[Navigation]}
                  autoplay
                  navigation={true}
                  // loop
                  // allowSlideNext={images.length > 1}
                  // allowSlidePrev={images.length > 1}
                  onSlideChange={(swiper) => {
                    setCurrentIndex(swiper?.activeIndex);
                  }}
                >
                  {images.map((image, index) => {
                    if (identifyFile(image) === ".pdf") {
                      return (
                        <SwiperSlide key={index}>
                          <Box sx={{ height: "100%", width: "100%", flexBasis: "100%", px: 8 }}>
                            <object
                              data={image as string}
                              width="100%"
                              height="100%"
                              type="application/pdf"
                            ></object>
                          </Box>
                        </SwiperSlide>
                      );
                    } else {
                      return (
                        <SwiperSlide key={index}>
                          <Box
                            sx={{
                              minHeight: "inherit",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: images?.length > 1 ? 8 : 0,
                            }}
                          >
                            <img
                              width="100%"
                              height="100%"
                              style={{ objectFit: "contain", maxHeight: 500 }}
                              src={image}
                              alt={`Image ${index}`}
                              onClick={() => handleImageClick(index)}
                              onError={(event) => {
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                event.currentTarget.onerror = () => {};
                                event.currentTarget.src = "/noimage.svg";
                                return true;
                              }}
                            />
                          </Box>
                        </SwiperSlide>
                      );
                    }
                  })}
                </StyledSwiper>
                {mounted && typeof window !== "undefined" && typeof document !== "undefined" && (
                  <ReactViewer
                    visible={viewerIsOpen}
                    onClose={handleCloseViewer}
                    images={viewerImages}
                    activeIndex={activeImageIndex}
                  />
                )}
              </Box>
            ) : (
              <></>
            )} */}
            <Box sx={{ position: "relative", p: 2 }}>
              {blobFiles?.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mt: { xs: 3, md: "unset" } }}>
                    {formSubheading}
                  </Typography>
                  <Preview files={blobFiles} stage={stage || ""} clientId={client_id || ""} />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 5,
                      top: 5,
                    }}
                  >
                    <Button size="large" onClick={handleClick}>
                      <MoreHorizIcon />
                    </Button>
                  </Box>
                </>
              ) : (
                <></>
              )}
              {cdurequests && (
                <>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#FFFF" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: "auto",
                          bgcolor: "#FFFF",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          gap: 3,
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Typography>E-Sign Not Done</Typography>
                          <RadioGroup
                            name="esigndone"
                            row
                            onChange={(e) => {
                              eSignNotdoneOnChange;
                            }}
                          >
                            <FormControlLabel value="none" control={<Radio />} label="None" />
                            <FormControlLabel value="failed" control={<Radio />} label="Failed" />
                            <FormControlLabel
                              value="rejected"
                              control={<Radio />}
                              label="Rejected"
                            />
                          </RadioGroup>
                        </Box>
                        <Button variant="contained" sx={{ width: "150px" }}>
                          Submit
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Menu
        // sx={{ maxHeight: "200px" }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem sx={{ display: "flex", gap: 2 }} onClick={handleDeletion}>
          <DeleteOptionIcon />
          <Typography>Delete Document</Typography>
        </MenuItem>
        <MenuItem sx={{ display: "flex", gap: 2 }} onClick={handleModalOpen}>
          <FullWindowOptionIcon />
          <Typography>Open in Large Window</Typography>
        </MenuItem>
        {currentFile?.type !== "video/mp4" && (
          <MenuItem sx={{ display: "flex", gap: 2 }} onClick={handleCropModalOpen}>
            <CropOptionIcon />
            <Typography>Crop Document</Typography>
          </MenuItem>
        )}
      </Menu>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {openModal ? (
          <OptionsModal open={openModal} closeHandle={handleModalClose} files={files} />
        ) : (
          <></>
        )}
      </Modal>
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
      />
    </Box>
  );
};

export default TabFromLayout;
