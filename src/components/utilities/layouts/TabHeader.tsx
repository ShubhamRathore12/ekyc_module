// import AddSVGSquareIcon from "@components/utilities/assets/svgs/AddSVGSquareIcon";
// import useWindowDimensions from "@hooks/useWindowDimensions";
// import UploadIcon from "@icons/UploadIcon";
// import { IconButton } from "@mui/material";

// import { Button, styled, Typography } from "@mui/material";
// import { Box } from "@mui/system";
// import exportXLSX from "@utils/exportToXlsx";
// import { useState } from "react";
// import { AddSVG, ModifySVG } from "../assets/svgs/Svg";
// import AddUserModal from "../Tabs/AddUsers/AddUserModal";

// interface IProps {
//   leftText: string;
//   rightButton1?: string | any;
//   rightButton2?: string | any;
//   rightButton3?: string | any;
//   rightButton4?: string | any;
//   showExportAndAddIcon?: boolean;
//   rows?: any[];
// }

// const UtlitiesTabHeader = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   padding: 20,
//   flexWrap: "wrap",
// });

// const TabHeader = ({
//   leftText,
//   rightButton1,
//   rightButton2,
//   rightButton3,
//   rightButton4,
//   showExportAndAddIcon,
//   rows,
// }: IProps) => {
//   const [open, setOpen] = useState(false);
//   const [openAddSceme, setOpenAddSCeme] = useState(false);
//   const [openModifyScheme, setOpenModifyScheme] = useState(false);
//   const { height, width } = useWindowDimensions();

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleAddSchemeOpen  = () => setOpenAddSCeme(true);
//   const handleAddSchemeClose = () => setOpenAddSCeme(false);

//   const handleModifySchemeOpen  = () => setOpenModifyScheme(true);
//   const handleModifySchemeClose = () => setOpenModifyScheme(false);
//   return (
//     <UtlitiesTabHeader
//       sx={{
//         textAlign: "center",
//         justifyContent: width > 1210 ? "space-between" : "center",
//         gap: width > 1210 ? 0 : 2,
//         // pr: 4,
//       }}
//     >
//       <Typography variant="h5">{leftText}</Typography>
//       <Box
//         sx={{
//           display: "flex",
//           gap: 2,
//           flexWrap: "wrap",
//           justifyContent: "center",
//         }}
//       >
//         {rightButton1 ? (
//           <Button
//             onClick={handleOpen}
//             variant="contained"
//             startIcon={<AddSVG />}
//             sx={{ width: "226px", height: "45px" }}
//           >
//             {rightButton1}
//           </Button>
//         ) : (
//           <></>
//         )}
//         {rightButton2 ? (
//           <Button
//             variant="outlined"
//             startIcon={<ModifySVG />}
//             sx={{ width: "226px", height: "45px" }}
//           >
//             {rightButton2}{" "}
//           </Button>
//         ) : (
//           <></>
//         )}
//         {rightButton3 ? (
//           <Button
//             onClick={handleAddSchemeOpen}
//             variant="contained"
//             startIcon={<AddSVG />}
//             sx={{ width: "226px", height: "45px" }}
//           >
//             {rightButton3}
//           </Button>
//         ) : (
//           <></>
//         )}
//          {rightButton4 ? (
//           <Button
//             onClick={handleModifySchemeOpen}
//             variant="outlined"
//             startIcon={<ModifySVG />}
//             sx={{ width: "226px", height: "45px" }}
//           >
//             {rightButton4}
//           </Button>
//         ) : (
//           <></>
//         )}
//       </Box>
//       {showExportAndAddIcon && (
//         <Box>
//           <IconButton>
//             <AddSVGSquareIcon />
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               rows && exportXLSX(rows, "exported data");
//             }}
//           >
//             <UploadIcon />
//           </IconButton>
//         </Box>
//       )}
//       {/* <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       > */}
//       <AddUserModal closeHandle={handleClose} open={open} />
//       {/* </Modal> */}
//     </UtlitiesTabHeader>
//   );
// };

// export default TabHeader;
import AddSVGSquareIcon from "@components/utilities/assets/svgs/AddSVGSquareIcon";
import useWindowDimensions from "@hooks/useWindowDimensions";
import UploadIcon from "@icons/UploadIcon";
import { IconButton, Button, styled, Typography, Box } from "@mui/material";
import exportXLSX from "@utils/exportToXlsx";
import { useState } from "react";
import { AddSVG, ModifySVG } from "../assets/svgs/Svg";
import AddUserModal from "../Tabs/AddUsers/AddUserModal";

interface IProps {
  leftText?: string;
  leftContent?: React.ReactNode;
  rightButton1?: string | any;
  rightButton2?: string | any;
  rightButton3?: string | any;
  rightButton4?: string | any;
  showExportAndAddIcon?: boolean;
  rows?: any[];
}

const UtlitiesTabHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: 20,
  flexWrap: "wrap",
});

const TabHeader = ({
  leftText,
  leftContent,
  rightButton1,
  rightButton2,
  rightButton3,
  rightButton4,
  showExportAndAddIcon,
  rows,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const [openAddSceme, setOpenAddSCeme] = useState(false);
  const [openModifyScheme, setOpenModifyScheme] = useState(false);
  const { width } = useWindowDimensions();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddSchemeOpen = () => setOpenAddSCeme(true);
  const handleAddSchemeClose = () => setOpenAddSCeme(false);
  const handleModifySchemeOpen = () => setOpenModifyScheme(true);
  const handleModifySchemeClose = () => setOpenModifyScheme(false);

  return (
    <UtlitiesTabHeader
      sx={{
        textAlign: "center",
        justifyContent: width > 1210 ? "space-between" : "center",
        gap: width > 1210 ? 0 : 2,
        flexDirection: width > 800 ? "row" : "column",
      }}
    >
      {/* Left Content or Fallback to Text */}

      <Typography variant="h5">{leftText}</Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 ,marginLeft:'30rem'}}>
        {leftContent && leftContent}
      </Box>

      {/* Right Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {rightButton1 && (
          <Button
            onClick={handleOpen}
            variant="contained"
            startIcon={<AddSVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton1}
          </Button>
        )}
        {rightButton2 && (
          <Button
            variant="outlined"
            startIcon={<ModifySVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton2}
          </Button>
        )}
        {rightButton3 && (
          <Button
            onClick={handleAddSchemeOpen}
            variant="contained"
            startIcon={<AddSVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton3}
          </Button>
        )}
        {rightButton4 && (
          <Button
            onClick={handleModifySchemeOpen}
            variant="outlined"
            startIcon={<ModifySVG />}
            sx={{ width: "226px", height: "45px" }}
          >
            {rightButton4}
          </Button>
        )}
      </Box>

      {/* Optional Export / Add Icons */}
      {showExportAndAddIcon && (
        <Box>
          <IconButton>
            <AddSVGSquareIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              rows && exportXLSX(rows, "exported data");
            }}
          >
            <UploadIcon />
          </IconButton>
        </Box>
      )}

      {/* Add User Modal */}
      <AddUserModal closeHandle={handleClose} open={open} />
    </UtlitiesTabHeader>
  );
};

export default TabHeader;
