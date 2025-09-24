import useWindowDimensions from "@hooks/useWindowDimensions";
import { Button, styled, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { useState } from "react";
import AddUserModal from "../Tabs/AddUsers/AddUserModal";
import { AddSVG, ModifySVG } from "./svgs/Svg";

interface IProps {
  leftText: string;
  rightButton1?: string;
  rightButton2?: string;
  rightButton3?: string;
  rightButton4?: string;
}

const UtlitiesTabHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: 20,
  flexWrap: "wrap",
});

const TabHeader = ({ leftText, rightButton1, rightButton2,rightButton4 }: IProps) => {
  const [open, setOpen] = useState(false);
  const { height, width } = useWindowDimensions();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <UtlitiesTabHeader
      sx={{
        textAlign: "center",
        justifyContent: width > 1210 ? "space-between" : "center",
        gap: width > 1210 ? 0 : 2,
      }}
    >
      <Typography variant="h5">{leftText}</Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {rightButton1 ? (
          <Button
            onClick={handleOpen}
            variant="contained"
            startIcon={<AddSVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton1}
          </Button>
        ) : (
          <></>
        )}
        {rightButton2 ? (
          <Button
            variant="outlined"
            startIcon={<ModifySVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton2}{" "}
          </Button>
        ) : (
          <></>
        )}
        {rightButton4 ? (
          <Button
            // onClick={handleOpen}
            variant="contained"
            startIcon={<AddSVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton4}
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AddUserModal closeHandle={handleClose} />
      </Modal>
    </UtlitiesTabHeader>
  );
};

export default TabHeader;
