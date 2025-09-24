import { CloseOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import handleError from "@utils/handleError";
import prettyPrintDate from "@utils/prettyPrintDate";
import React from "react";
import { toast } from "react-hot-toast";
import {
  useDeleteRejectionTemplateMutation,
  useGetRejectionTemplateQuery,
} from "services/ekyc.service";
import { RejectionTemplate } from "types/ekyc";
import AddRejectionTemplateModal from "../AddRejectionTemplateModal";

interface TemplateProps {
  template: RejectionTemplate;
}

const TemplateRow = (props: TemplateProps) => {
  const { template: t } = props;
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [deleteRejectionTemplate] = useDeleteRejectionTemplateMutation();

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return (
    <TableRow>
      <TableCell>{t.rejection_reason}</TableCell>
      <TableCell>{prettyPrintDate(t.created_at)}</TableCell>
      <TableCell align="right">
        <Button
          onClick={handleOpen}
          variant="contained"
          color="error"
          sx={{
            "&:hover": {
              bgcolor: "error.main",
            },
          }}
        >
          Delete
        </Button>
      </TableCell>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: "500px",
            p: 3,
          },
        }}
      >
        <Stack sx={{ width: "100%", gap: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">Delete Rejection Template</Typography>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Typography variant="h6">Are you sure want to delete this template?</Typography>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={() => {
                setIsSubmitting(true);
                deleteRejectionTemplate({
                  rejection_reason_id: t.rejection_template_id,
                })
                  .unwrap()
                  .then((res) => toast.success(res.message))
                  .catch((err) => handleError(err))
                  .finally(() => setIsSubmitting(false));
              }}
            >
              {isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </TableRow>
  );
};

const RejectionTemplate = () => {
  const { data, isLoading, isError, error } = useGetRejectionTemplateQuery();
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return (
    <Card
      sx={{
        width: "100%",
        minHeight: "100px",
        p: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack sx={{ width: "100%", gap: 3 }}>
        <Stack
          direction="row"
          sx={{ gap: 3, alignItems: "center", justifyContent: "space-between", flex: 1 }}
        >
          <Stack gap={1} flex={1}>
            <Typography variant="h5">Rejection Templates</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              You can Add or Delete rejection templates here
            </Typography>
          </Stack>
          <Button variant="contained" onClick={handleOpen}>
            Add{" "}
          </Button>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reject Reason</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    something went wrong
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data && data?.data?.rejection_templates?.length > 0 ? (
                data?.data?.rejection_templates?.map((t) => (
                  <TemplateRow template={t} key={t.rejection_template_id} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <AddRejectionTemplateModal open={open} handleClose={handleClose} />
    </Card>
  );
};

export default RejectionTemplate;
