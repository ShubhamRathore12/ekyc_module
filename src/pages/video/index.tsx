import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import FullwidthInputField from "@components/common/FullwidthInputField"; // Import the FullwidthInputField component
import AuthGuard from "@components/auth/AuthGuard";
import { NextPage } from "next";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { reorderObject } from "@utils/reorderObject";
import {
  GETVIDEOREPORTREQUEST,
  GetVideoReportsResponse,
  videoKeys,
  VideoReports,
} from "types/ekyc";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import { useAuth } from "@hooks/useAuth";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import {
  useGetVideoReportsQuery,
  useUploadVideoMutation,
  useUploadVideoStatusMutation,
} from "services/ekyc.service";
import handleError from "@utils/handleError";
import toast from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledCard = styled(Card)<{ cardVariant?: "total" | "active" | "inactive" }>(
  ({ theme, cardVariant }) => ({
    height: "100%",
    background:
      cardVariant === "total"
        ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
        : cardVariant === "active"
        ? "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"
        : "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
    borderRadius: "30px",
    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.12)",
      "& .shine-effect": {
        transform: "translateX(100%)",
      },
    },
  })
);

const ShineEffect = styled(Box)({
  position: "absolute",
  top: 0,
  left: "-100%",
  width: "100%",
  height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
  transition: "transform 0.6s ease-in-out",
  transform: "translateX(-100%)",
});

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.1) rotate(5deg)",
  },
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 8,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
}));

const VideoPage: NextPage = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GETVIDEOREPORTREQUEST>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GETVIDEOREPORTREQUEST>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editUploadLoading, setEditUploadLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoReports | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const { data, isError, isLoading } = useGetVideoReportsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [uploadVideo] = useUploadVideoMutation();
  const [uploadVideoStatus] = useUploadVideoStatusMutation();

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const productCodeSata = [
    { key: "SMCDIY", value: "SMCDIY" },
    { key: "FRANCHISE", value: "FRANCHISE" },
    { key: "IOB", value: "IOB" },
    { key: "GRIOB", value: "GRIOB" },
    { key: "PNB", value: "PNB" },
    { key: "GRPNB", value: "GRPNB" },
    { key: "UBI", value: "UBI" },
    { key: "NAINITAL", value: "NAINITAL" },
    { key: "GRNAINITAL", value: "GRNAINITAL" },
    { key: "UJJIVAN", value: "UJJIVAN" },
    { key: "GRUJJIVAN", value: "GRUJJIVAN" },
    { key: "DEMAT", value: "DEMAT" },
    { key: "DEMAT_UPMOVE", value: "DEMAT_UPMOVE" },
  ];

  const handleEdit = (video: any) => {
    setCurrentVideo(video);
    setVideoFile(video?.demo_video_s3_url);
    setError("");
    setOpenDialog(true);
  };

  const handleView = (video: any) => {
    // Logic to view the video details
    setOpenViewDialog(true);
    setCurrentVideo(video);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedFiles = ["video/mp4", "video/mov", "video/avi"];
    const file: any = e.target.files?.[0] || null;
    if (!allowedFiles.includes(file?.type)) {
      setError("Please select valid file.");
    } else {
      setError(null);
    }
    setVideoFile(file);
  };

  const resetInput = () => {
    setVideoFile(null); // Reset the videoFile state
    const fileInput = document.getElementById("video-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset the file input's value
    }
  };

  const totalPages = data?.data?.no_of_pages || 0;
  const initialColumns = useInitialColumns(data?.data?.demo_video_info, videoKeys);

  const reorderedObj = reorderObject(data?.data?.demo_video_info?.[0], videoKeys);
  const isFilters = checkFilters(actualFilters, currentFilters);

  const { clientData } = useClientData<
    VideoReports,
    "demo_video_info",
    GetVideoReportsResponse,
    GETVIDEOREPORTREQUEST
  >({
    data: data,
    keyname: "demo_video_info",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "product_code",
  });

  function handleSubmit() {
    if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
      const { ...rest } = currentFilters;
      setActualFilters(() => ({
        ...rest,
        page_number: 1,
      }));
    }
  }

  const handleVideoEditUpload = async () => {
    setEditUploadLoading(true);
    try {
      if (!currentVideo || !currentVideo.product_code) {
        toast.error("Missing video product code.");
        return;
      }
      if (!videoFile) {
        toast.error("Please select a new video file to upload.");
        return;
      }
      const metadata = {
        product_code: currentVideo.product_code,
        demo_video_enabled_to_display: currentVideo.demo_video_enabled_to_display ?? true,
      };
      const formData = new FormData();
      formData.append("metadata", JSON.stringify(metadata));
      formData.append("video", videoFile);

      if (videoFile instanceof File) {
        const { data, error }: any = await uploadVideo(formData);
        if (data?.status === "success") {
          toast.success(data?.message);
        } else {
          toast.error(error?.data?.error);
        }
        setOpenDialog(false);
        setVideoFile(null);
        setCurrentVideo(null);
        setEditUploadLoading(false);
      } else {
        const { data, error }: any = await uploadVideoStatus(metadata);
        if (data?.status === "success") {
          toast.success(data?.message);
        } else {
          toast.error(error?.data?.error);
        }
        setOpenDialog(false);
        setVideoFile(null);
        setCurrentVideo(null);
        setEditUploadLoading(false);
      }
    } catch (error: any) {
      handleError(error);
      toast.error(error);
      setEditUploadLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    setUploadLoading(true);
    try {
      if (!videoFile || !selectedVideo) {
        toast.error("Please select a video file and a product code.");
        return;
      }

      // Prepare metadata as an object
      const metadata = {
        product_code: selectedVideo, // Add selected video product code
        demo_video_enabled_to_display: true, // Assuming you're marking it to display
      };

      // Create a FormData instance to append metadata and other data
      const formData = new FormData();
      formData.append("metadata", JSON.stringify(metadata)); // Add metadata as a JSON string
      formData.append("video", videoFile); // Add the video file

      // Call the API with the form data
      const { data, error }: any = await uploadVideo(formData);
      if (data?.status === "success") {
        toast.success(data?.message);
        setSelectedVideo("");
        setVideoFile(null);
        setUploadLoading(false);
      } else {
        toast.error(error?.data?.error);
        setUploadLoading(false);
      }
    } catch (error: any) {
      // Handle any errors
      handleError(error);
      toast.error(error);
      setUploadLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={(e, newVal) => setTabIndex(newVal)}
        sx={{ mb: 4 }}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        <Tab label="Dashboard" />
        <Tab label="Video Table" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          {/* Upload Form */}
          <Box sx={{ mt: 4 }}>
            <TextField
              select
              label="Select Product"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              fullWidth
            >
              {productCodeSata?.map((item) => (
                <MenuItem value={item.key}>{item?.value}</MenuItem>
              ))}
            </TextField>

            {selectedVideo && (
              <Box sx={{ mt: 3 }}>
                {!uploadLoading ? (
                  <UploadBox
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      const allowedFiles = ["video/mp4", "video/mov", "video/avi"];
                      if (!allowedFiles.includes(file?.type)) {
                        setError("Please select a valid file.");
                        toast.error("Invalid file type");
                      } else {
                        setError(null);
                        setVideoFile(file);
                        toast.success("Video selected: " + file.name);
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="video/mp4,video/mov,video/avi"
                      style={{ display: "none" }}
                      id="video-upload"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="video-upload">
                      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                        <Typography variant="h6">
                          Drag and drop your video file here or click to browse
                        </Typography>
                        <Button variant="outlined" component="span">
                          Select Video
                        </Button>
                      </Box>
                    </label>
                  </UploadBox>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                  </Box>
                )}

                {videoFile && (
                  <div>
                    <Typography sx={{ display: "inline-block" }} variant="body1">
                      {videoFile.name}
                    </Typography>
                    {videoFile && (
                      <IconButton onClick={() => setVideoFile(null)}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </div>
                )}

                {error && (
                  <Typography color="error" sx={{ my: 1 }}>
                    {error}
                  </Typography>
                )}

                <Box mt={2}>
                  <Button
                    onClick={handleVideoUpload}
                    variant="contained"
                    disabled={!!error || !videoFile}
                  >
                    Upload Video
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Videos
          </Typography>
          <Typography sx={{ mb: 2 }}>Manage your video content. Upload or edit videos.</Typography>
          <Box>
            <DataTableV2
              totalPages={totalPages}
              columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
              data={clientData || []}
              actualFilters={actualFilters}
              setActualFilters={setActualFilters}
              dates={["upload_date"]}
              id="product_code"
              reset={() => {
                setActualFilters({
                  page_number: 1,
                  no_of_records: 10,
                });
                setCurrentFilters({
                  page_number: 1,
                  no_of_records: 10,
                });
              }}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
              initialColumns={initialColumns}
              isLoading={isLoading}
              isError={isError}
              setHitBottom={setHitBottom}
              customColumns={[
                {
                  position: "end",
                  label: "Actions",
                  RenderHeadCell: () => {
                    return <div></div>;
                  },
                  RenderBodyCell({ row }, index) {
                    return (
                      <>
                        <IconButton onClick={() => handleView(row)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </>
                    );
                  },
                },
              ]}
            />
          </Box>
        </Box>
      )}
      <Dialog
        open={openViewDialog}
        onClose={() => {
          videoRef.current?.pause();
          setOpenViewDialog(false);
        }}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "50%", // Set the width to 50% of the screen width
            minHeight: "50%", // Set the height to 50% of the screen height
            margin: "auto", // Center the dialog in the middle of the screen
          },
        }}
      >
        <DialogTitle>View Video</DialogTitle>
        <DialogContent>
          {currentVideo ? (
            <>
              <Typography variant="h6">{currentVideo.product_code}</Typography>
              <Box sx={{ mt: 2 }}>
                <video ref={videoRef} width="100%" controls key={currentVideo?.demo_video_s3_url}>
                  <source src={currentVideo.demo_video_s3_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </>
          ) : (
            <Typography>No video data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Video Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "50%", // Set the width to 50% of the screen width
            minHeight: "50%", // Set the height to 50% of the screen height
            margin: "auto", // Center the dialog in the middle of the screen
          },
        }}
      >
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          {editUploadLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : currentVideo ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Editing video for: <strong>{currentVideo.product_code}</strong>
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Active Status
                </Typography>
                <Switch
                  checked={currentVideo.demo_video_enabled_to_display ?? false}
                  onChange={(e) =>
                    setCurrentVideo((prev: any) => ({
                      ...prev,
                      demo_video_enabled_to_display: e.target.checked,
                    }))
                  }
                />
              </Box>
              {/* Upload New Video */}
              <Box mt={3}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Replace Video
                </Typography>
                <Button variant="outlined" component="label">
                  Upload New Video
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi"
                    hidden
                    onChange={(e) => {
                      const allowedFiles = ["video/mp4", "video/mov", "video/avi"];
                      const file: any = e.target.files?.[0] || null;
                      if (!allowedFiles.includes(file?.type)) {
                        setError("Please select valid file.");
                      } else {
                        setError(null);
                      }
                      setVideoFile(file);
                      if (file) {
                        toast.success("New video selected: " + file.name);
                      }
                    }}
                  />
                </Button>
                {videoFile && (
                  <>
                    <Typography padding="5px" display="inline-block" variant="caption">
                      {videoFile.name}
                    </Typography>
                    {videoFile.name && (
                      <IconButton onClick={() => setVideoFile(null)}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
            </>
          ) : (
            <Typography>No video selected for editing</Typography>
          )}
          {error && (
            <Typography color="error" sx={{ my: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {!editUploadLoading && (
            <>
              <Button onClick={() => setOpenDialog(false)} color="primary" variant="contained">
                Cancel
              </Button>
              <Button
                disabled={!!error}
                onClick={() => {
                  handleVideoEditUpload();
                }}
                color="primary"
                variant="contained"
              >
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

VideoPage.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default VideoPage;
