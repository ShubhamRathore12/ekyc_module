import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import BanksCard from "./utils/BanksCard";
import OtherBanks from "./utils/OtherBanks";
const BankReport = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFF",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Typography variant="h5">Bank List</Typography>
        <TextField
          placeholder="Enter your bank name"
          fullWidth
          type="text"
          sx={{
            "& .MuiInputBase-root": {
              height: "50px",
              border: "1px solid hsla(0, 0%, 26%, 0.1)",
              borderRadius: 1,
              bgcolor: "hsla(0, 0%, 98%, 1)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 2 }}>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </Box>
      <BanksCard />
      <OtherBanks />
    </Box>
  );
};

export default BankReport;
