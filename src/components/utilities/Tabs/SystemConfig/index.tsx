import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import handleError from "@utils/handleError";
import React from "react";
import { toast } from "react-hot-toast";
import {
  useGetCVLKRAConfigQuery,
  useGetWhatsappConfigQuery,
  useUpdateCVLKRAConfigMutation,
  useUpdateWhatsappConfigMutation,
} from "services/ekyc.service";
import DeleteUser from "./DeleteUser";
import RejectionTemplate from "./RejectionTemplate";

const SystemConfig = () => {
  const { data: wconfig } = useGetWhatsappConfigQuery();
  const { data: cconfig } = useGetCVLKRAConfigQuery();

  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState(
    cconfig?.data?.feature_configuration?.password || ""
  );
  const [edit, setEdit] = React.useState(false);

  const [updateWhatsapp] = useUpdateWhatsappConfigMutation();
  const [updateCVLKRA] = useUpdateCVLKRAConfigMutation();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword1 = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword1 = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    setPassword(cconfig?.data?.feature_configuration?.password || "");
  }, [cconfig]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ width: "100%", minHeight: "100px", p: 2, display: "flex", alignItems: "center" }}>
        <Stack
          direction="row"
          sx={{ gap: 3, alignItems: "center", justifyContent: "space-between", flex: 1 }}
        >
          <Stack gap={1} flex={1}>
            <Typography variant="h5">Whatsapp Notifications</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Enable/Disable whatsapp notifications to the user
            </Typography>
          </Stack>
          <Switch
            disabled={isLoading}
            checked={wconfig?.data?.feature_configuration?.status}
            onChange={(e, checked) => {
              setIsLoading(true);
              updateWhatsapp({
                feature: "whatsapp",
                status: checked,
              })
                .unwrap()
                .then((res) => toast.success(res?.message))
                .catch((err) => handleError(err))
                .finally(() => setIsLoading(false));
            }}
          />
        </Stack>
      </Card>
      <Card sx={{ width: "100%", minHeight: "100px", p: 2, display: "flex", alignItems: "center" }}>
        <Stack
          direction="row"
          sx={{ gap: 3, alignItems: "center", justifyContent: "space-between", flex: 1 }}
        >
          <Stack gap={1} flex={1}>
            <Typography variant="h5">CVLKRA Password</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Change the password of the CVLKRA config
            </Typography>
            <Stack direction="row" gap={3} alignItems="center">
              <TextField
                fullWidth
                placeholder="*****"
                disabled={!edit}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  setEdit((prev) => !prev);
                  if (edit) {
                    setIsLoading(true);
                    updateCVLKRA({ feature: "cvlkra", password: password })
                      .unwrap()
                      .then((res) => toast.success(res.message))
                      .catch((err) => handleError(err))
                      .finally(() => setIsLoading(false));
                  }
                }}
              >
                {edit ? "Save" : "Edit"}
              </Button>
              {edit && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPassword(cconfig?.data?.feature_configuration?.password || "");
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <DeleteUser />
      <RejectionTemplate />
    </Box>
  );
};

export default SystemConfig;
