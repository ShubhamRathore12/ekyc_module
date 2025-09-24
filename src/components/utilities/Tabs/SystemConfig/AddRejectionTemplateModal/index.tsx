import { CloseOutlined } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import handleError from "@utils/handleError";
import React from "react";
import { toast } from "react-hot-toast";
import { useAddRejectionTemplateMutation } from "services/ekyc.service";
interface DialogProps {
  open: boolean;
  handleClose: () => void;
}
const AddRejectionTemplateModal = (props: DialogProps) => {
  const { handleClose, open } = props;
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [addRejectionTemplate] = useAddRejectionTemplateMutation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "min(100%, 500px)",
          p: 3,
        },
      }}
    >
      <Stack sx={{ width: "100%", gap: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Add Rejection Template</Typography>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <TextField
          label="Reject Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={3}
          maxRows={5}
        />
        <Stack direction="row" justifyContent="end" gap={2}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!reason || isSubmitting}
            onClick={() => {
              setIsSubmitting(true);
              addRejectionTemplate({
                rejection_reason: reason,
              })
                .unwrap()
                .then((res) => toast.success(res.message))
                .catch((err) => handleError(err))
                .finally(() => {
                  setIsSubmitting(false);
                  handleClose();
                });
            }}
          >
            {isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddRejectionTemplateModal;
