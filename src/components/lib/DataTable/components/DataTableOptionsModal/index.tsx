import { handleStickiness } from "@components/lib/DataTableV2/utils/handleStickyness";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import close from "@public/assets/close.svg";

import Image from "next/image";
import React from "react";
import { initialConfig } from "../../contexts/config";
import { useConfig } from "../../hooks/config";
import capitalizeKey from "../../utils/capitalizeKey";
import { options } from "../../utils/lib";

interface IProps {
  open: boolean;
  onClose: () => void;
  columns: { key: string }[];
  hide?: string[];
}

const DataTableOptionsModal = ({ open, onClose, columns, hide: hidden }: IProps) => {
  const { config, setConfig } = useConfig();

  const sortedColumns = [...columns];
  sortedColumns.sort((a, b) => a.key.localeCompare(b.key));

  const frozenKeys = config.frozenKeys;
  const maxStickyColumns = config.maxStickyColumns;
  const positions = config.positions;
  const hide = config.hide;
  const [searchColumnKey, setSearchColumnKey] = React.useState<string>("");
  const { left } = maxStickyColumns;
  const { right } = maxStickyColumns;
  function handleLeftStickiness(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.target.value > 0)
      setConfig((prev) => ({
        ...prev,
        maxStickyColumns: { left: +e.target.value, right: prev.maxStickyColumns.right },
      }));
  }
  function handleRightStickiness(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.target.value > 0)
      setConfig((prev) => ({
        ...prev,
        maxStickyColumns: { right: +e.target.value, left: prev.maxStickyColumns.left },
      }));
  }
  function handleResetOptions() {
    setConfig(initialConfig);
  }
  const { rememberMe, setRememberMe } = useConfig();
  const frozenRightCount = frozenKeys.filter((f) => f.pos === "right");
  const frozenLeftCount = frozenKeys.filter((f) => f.pos === "left");

  return (
    <>
      <Dialog open={open} onClose={onClose} fullScreen>
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 2,
          }}
        >
          <Image src={close} alt="close" />
        </Button>
        <DialogTitle>Data Table Options</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Checkbox
              checked={rememberMe}
              size="medium"
              onChange={(e, checked) => {
                setRememberMe(checked);
              }}
              aria-label="remember settings"
            />
            <Typography variant="h6">Remember your settings</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <TextField
              placeholder="Search Column"
              fullWidth
              value={searchColumnKey}
              onChange={(e) => setSearchColumnKey(e.target.value)}
            />
          </Box>
          <TableContainer sx={{ maxHeight: 586, bgcolor: "#FFFF" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ bgcolor: "#FFFF", position: "sticky", top: 0, left: 10, zIndex: 1 }}>
                <TableRow>
                  <TableCell>Column</TableCell>
                  {options.map((opt: string, i: number) => (
                    <TableCell key={i}>{opt}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedColumns.map(
                  (column) =>
                    column.key.includes(searchColumnKey) && (
                      <TableRow key={column.key}>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {capitalizeKey(column.key)}
                        </TableCell>
                        <TableCell>
                          <RadioGroup sx={{ flexDirection: "row", width: "250px" }}>
                            <FormControlLabel
                              disabled={
                                positions?.findIndex((key) => key.key === column.key) !== -1 ||
                                frozenLeftCount.length === maxStickyColumns["left"]
                              }
                              value="left"
                              control={<Radio />}
                              label="Left"
                              checked={frozenKeys?.some(
                                ({ key, pos }) => key === column.key && pos === "left"
                              )}
                              onChange={() => {
                                handleStickiness(
                                  column.key,
                                  "left",
                                  frozenKeys,
                                  setConfig,
                                  maxStickyColumns
                                );
                              }}
                            />
                            <FormControlLabel
                              disabled={
                                positions?.findIndex((key) => key.key === column.key) !== -1 ||
                                frozenRightCount.length === maxStickyColumns["right"]
                              }
                              value="right"
                              control={<Radio />}
                              label="Right"
                              checked={frozenKeys?.some(
                                ({ key, pos }) => key === column.key && pos === "right"
                              )}
                              onChange={() => {
                                handleStickiness(
                                  column.key,
                                  "right",
                                  frozenKeys,
                                  setConfig,
                                  maxStickyColumns
                                );
                              }}
                            />
                            <FormControlLabel
                              disabled={
                                positions?.findIndex((key) => key.key === column.key) !== -1
                              }
                              control={<Radio />}
                              label="None"
                              checked={
                                frozenKeys?.findIndex((key) => key.key === column.key) === -1 ||
                                !frozenKeys?.find((key) => key.key === column.key)?.pos
                              }
                              onChange={() => {
                                handleStickiness(
                                  column.key,
                                  "none",
                                  frozenKeys,
                                  setConfig,
                                  maxStickyColumns
                                );
                              }}
                            />
                          </RadioGroup>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={hide.includes(column.key)}
                            aria-label="hide"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>, checked) => {
                              if (checked) {
                                setConfig((prev) => ({
                                  ...prev,
                                  hide: prev.hide.concat(column.key),
                                }));
                              } else {
                                setConfig((prev) => ({
                                  ...prev,
                                  hide: prev.hide.filter((c) => c !== column.key),
                                }));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RadioGroup sx={{ flexDirection: "row", width: "250px" }}>
                            <FormControlLabel
                              disabled={
                                frozenKeys?.findIndex((key) => key.key === column.key) !== -1
                              }
                              control={<Radio />}
                              label="Left"
                              value="left"
                              checked={positions?.some(
                                ({ key, pos }) => key === column.key && pos === "left"
                              )}
                              onChange={() => {
                                const index = positions?.findIndex((k) => k.key === column.key);
                                if (index !== -1) {
                                  const updated = [...positions];
                                  updated[index].pos = "left";
                                  setConfig((prev) => ({
                                    ...prev,
                                    positions: updated,
                                  }));
                                } else {
                                  setConfig((prev) => ({
                                    ...prev,
                                    positions: prev.positions.concat({
                                      key: column.key,
                                      pos: "left",
                                    }),
                                  }));
                                }
                              }}
                            />
                            <FormControlLabel
                              disabled={
                                frozenKeys?.findIndex((key) => key.key === column.key) !== -1
                              }
                              control={<Radio />}
                              label="Right"
                              value="right"
                              checked={positions?.some(
                                ({ key, pos }) => key === column.key && pos === "right"
                              )}
                              onChange={() => {
                                const index = positions?.findIndex((k) => k.key === column.key);
                                if (index !== -1) {
                                  const updated = [...positions];
                                  updated[index].pos = "right";
                                  setConfig((prev) => ({
                                    ...prev,
                                    positions: updated,
                                  }));
                                } else {
                                  setConfig((prev) => ({
                                    ...prev,
                                    positions: prev.positions.concat({
                                      key: column.key,
                                      pos: "right",
                                    }),
                                  }));
                                }
                              }}
                            />
                            <FormControlLabel
                              disabled={
                                frozenKeys?.findIndex((key) => key.key === column.key) !== -1
                              }
                              control={<Radio />}
                              label="None"
                              value="none"
                              checked={
                                positions?.findIndex((key) => key.key === column.key) === -1 ||
                                !positions?.find((key) => key.key === column.key)?.pos
                              }
                              onChange={() => {
                                setConfig((prev) => ({
                                  ...prev,
                                  positions: prev.positions?.filter((c) => c.key !== column.key),
                                }));
                              }}
                            />
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ my: 2 }}>Maximum Sticky Options</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ width: "50px" }}>Left</Typography>
                  <TextField
                    type="number"
                    onChange={handleLeftStickiness}
                    value={left}
                    disabled={frozenLeftCount.length === left}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ width: "50px" }}>Right</Typography>
                  <TextField
                    type="number"
                    onChange={handleRightStickiness}
                    value={right}
                    disabled={frozenRightCount.length === right}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
              <Button variant="outlined" size="large" onClick={handleResetOptions}>
                Reset
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTableOptionsModal;
