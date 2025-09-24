import { RefreshOutlined, SearchOutlined } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";

interface IProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  setPlaceHolder: React.Dispatch<React.SetStateAction<string>>;
}

const SearchDropdown = (props: IProps) => {
  const { anchorEl, open, handleClose, setPlaceHolder } = props;
  return (
    <Menu anchorEl={anchorEl} keepMounted open={Boolean(open)} onClose={handleClose}>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Contains");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Contains
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Does Not Contain");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Does Not Contain{" "}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Starts With");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Starts With
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Equals");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Equals
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Ends With");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Ends With
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("Does Not Equal");
          handleClose();
        }}
      >
        <SearchOutlined sx={{ pr: 0.5 }} /> Does Not Equal
      </MenuItem>
      <MenuItem
        onClick={() => {
          setPlaceHolder("");
          handleClose();
        }}
      >
        <RefreshOutlined sx={{ pr: 0.5 }} /> Reset
      </MenuItem>
    </Menu>
  );
};

export default SearchDropdown;
