import { OptionsType } from "@components/common/lib";
import capitalizeKey from "@components/lib/DataTable/utils/capitalizeKey";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import configSlice from "slices/config.slice";
import { useDispatch, useSelector } from "store";

interface IProps {
  anchorEl: null | HTMLElement;
  menuValues?: Record<string, string>;
  something?: OptionsType[];
  hideColumns?: { key: string }[];
  open: boolean;
  handleClose?: () => void;
  handleClick?: () => void;
  checkedList?: string[];
  setCheckList?: any;
  labelMap?: Record<string, string> | null;
  stickyOptions?: boolean;
}

const FilterDorpDownMenu = ({
  anchorEl,
  open,
  handleClose,
  handleClick,
  menuValues,
  something,
  hideColumns,
  checkedList,
  setCheckList,
  labelMap = null,
  stickyOptions = false,
}: IProps) => {
  const paperRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { dataTableHiddenColumns } = useSelector((state) => state.config);
  const left = useSelector((state) => state.config.maxStickyColumns.left);
  const right = useSelector((state) => state.config.maxStickyColumns.right);

  function handleLeftStickiness(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(configSlice.actions.setMaxStickyLeft(+e.target.value));
  }
  function handleRightStickiness(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(configSlice.actions.setMaxStickyRight(+e.target.value));
  }

  return (
    <>
      {stickyOptions && (
        <Menu
          sx={{ maxHeight: "200px" }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem sx={{ display: "flex", gap: 2 }}>
            <Typography sx={{ width: "50px" }}>Left</Typography>
            <TextField type="number" onChange={handleLeftStickiness} value={left} />
          </MenuItem>
          <MenuItem sx={{ display: "flex", gap: 2 }}>
            <Typography sx={{ width: "50px" }}>Right</Typography>
            <TextField onChange={handleRightStickiness} type="number" value={right} />
          </MenuItem>
        </Menu>
      )}

      {menuValues && (
        <Menu
          sx={{ maxHeight: "200px" }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Box>
            <MenuItem>
              <FormControlLabel control={<Checkbox />} label="Select All" />
            </MenuItem>
            <MenuItem>
              <FormControlLabel control={<Checkbox />} label="(Blanks)" />
            </MenuItem>
            {Object.keys(menuValues).map(
              (key, i) =>
                typeof menuValues[key] !== "number" && (
                  <MenuItem key={key}>
                    <FormControlLabel control={<Checkbox />} label={menuValues[key]} />
                  </MenuItem>
                )
            )}
            <Box
              sx={{
                m: 2,
                bgcolor: "#FFFF",
                display: "flex",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Ok
              </Button>
            </Box>
          </Box>
        </Menu>
      )}
      {something && (
        <Menu
          // sx={{ maxHeight: "200px" }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {something.map((menu, i) => {
            return (
              <MenuItem key={i} onClick={handleClick}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography>{menu.label}</Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      )}
      {hideColumns && (
        <Popover
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          sx={{ maxHeight: "500px" }}
          onClose={handleClose}
        >
          {hideColumns.map(
            (
              column: {
                key: string;
              },
              i: number
            ) => {
              return (
                <>
                  <MenuItem key={i}>
                    <FormControlLabel
                      checked={dataTableHiddenColumns?.includes(column.key)}
                      value={column.key}
                      control={
                        <Checkbox
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // if (e.target.checked) {
                            //   // setCheckList((current: string[]) => [...current, column.key]);
                            //   dispatch(
                            //     appSlice.actions.setHiddenColumns({ key: column.key, hide: true })
                            //   );
                            // } else {
                            //   dispatch(
                            //     appSlice.actions.setHiddenColumns({ key: column.key, hide: false })
                            //   );
                            // }
                          }}
                        />
                      }
                      label={capitalizeKey(column.key)}
                    />
                  </MenuItem>
                </>
              );
            }
          )}
          {/* </Menu> */}
        </Popover>
      )}
    </>
  );
};

export default FilterDorpDownMenu;
function useStateSetStateAction<T>(arg0: never[]): [any, any] {
  throw new Error("Function not implemented.");
}
