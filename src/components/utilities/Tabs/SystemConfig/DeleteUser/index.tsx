import { Box, Button, Card, MenuItem, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import DeleteUserModal from "./DeleteUserModal";

const DeleteUser = () => {
  const [phone, setPhone] = React.useState("");
  const [panNumber, setPanNumber] = React.useState("");
  const [userType, setUserType] = React.useState("");
  const [open, setOpen] = React.useState(false);
  
  function handleOpen() {
    setOpen(true);
  }
  
  function handleClose() {
    setOpen(false);
  }
  
  return (
    <Card sx={{ width: "100%", minHeight: "100px", p: 2, display: "flex", alignItems: "center" }}>
      <Stack
        direction="row"
        sx={{ gap: 3, alignItems: "center", justifyContent: "space-between", flex: 1 }}
      >
        <Stack gap={1} flex={1}>
          <Typography variant="h5">Delete User</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            You can enter the details of user to delete the user.
          </Typography>
          <Stack direction="row" gap={3} justifyContent="center" alignItems="center">
            <TextField
              name="user_type"
              sx={{ width: "50%" }}
              select
              onChange={(e) => {
                setUserType(e.target.value)
              }}
              value={userType}
              placeholder="Select User Type"
            >
              <MenuItem value="REGULAR"> REGULAR</MenuItem>
              <MenuItem value="MUTUAL_FUND_CLIENT"> MUTUAL_FUND_CLIENT</MenuItem>
              <MenuItem value="MUTUAL_FUND_DISTRIBUTOR"> MUTUAL_FUND_DISTRIBUTOR</MenuItem>
              <MenuItem value="SUBSCRIPTION_CLIENT"> SUBSCRIPTION_CLIENT</MenuItem>
              <MenuItem value="STX_SUBSCRIPTION_CLIENT"> STX_SUBSCRIPTION_CLIENT</MenuItem>
            </TextField>
            <TextField
              sx={{ width: "50%" }}
              placeholder="123455"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 10) {
                  setPhone(value);
                }
              }}
              inputProps={{ 
                maxLength: 10,
                pattern: "[0-9]{10}",
                autoComplete: 'tel'
              }}
            />

            {userType && 
             userType !== "REGULAR" && 
             userType !== "SUBSCRIPTION_CLIENT" && 
             userType !== "STX_SUBSCRIPTION_CLIENT" && (
              <TextField
                sx={{ width: "50%" }}
                value={panNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  if (value.length <= 10) {
                    setPanNumber(value);
                  }
                }}
                placeholder="Enter PAN No."
                error={panNumber !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)}
                inputProps={{ 
                  maxLength: 10,
                  pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                  autoComplete: 'off'
                }}
              />
            )}

            <Button
              variant="contained"
              color="error"
              disabled={
                !phone ||
                !userType ||
                (
                  userType !== "REGULAR" &&
                  userType !== "SUBSCRIPTION_CLIENT" &&
                  userType !== "STX_SUBSCRIPTION_CLIENT" &&
                  (
                    !panNumber ||
                    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)
                  )
                )
              }
              sx={{
                "&:hover": {
                  bgcolor: "error.main",
                },
              }}
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <DeleteUserModal handleClose={handleClose} open={open} phone={phone} userType={userType} panNumber={panNumber} />
    </Card>
  );
};

export default DeleteUser;