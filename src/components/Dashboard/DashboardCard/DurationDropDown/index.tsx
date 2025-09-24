import { MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";

interface IProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose?: () => void;
}

const DurationDropDown = (props: IProps) => {
  const { anchorEl, open, handleClose } = props;
  return (
    <Menu anchorEl={anchorEl} keepMounted open={Boolean(open)} onClose={handleClose}>
      <MenuItem onClick={handleClose}>Since Yesterday</MenuItem>
      <MenuItem onClick={handleClose}>Since Last 7 days</MenuItem>
      <MenuItem onClick={handleClose}>Since MTD</MenuItem>
      <MenuItem onClick={handleClose}>Since Last Month</MenuItem>
    </Menu>
  );
};

export default DurationDropDown;
