// import FilterDorpDownMenu from "@components/common/Dropdowns/FilterDorpDownMenu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { CloseSharp, Filter1Outlined, Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

import ExportToExcel from "@components/common/ExportToExcelButton";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import prettyPrintDate from "@utils/prettyPrintDate";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "store";
import { formatDate } from "utils/formatDate";
import { ConfigProvider } from "./contexts/config";
import { useConfig } from "./hooks/config";
import capitalizeKey from "./utils/capitalizeKey";
import removeDuplicates from "./utils/removeDuplicates";
import trimObject from "./utils/trimObject";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableProps<T = any, F = Record<string, unknown>> {
  setHitBottom?: React.Dispatch<React.SetStateAction<boolean>>;
  fetching?: boolean;
  error?: boolean;
  rows: T[];
  columns: { key: string }[];
  initialColumns?: { key: string }[];
  filters?: F;
  initialFilters?: F;
  currentFilters?: F;
  setFilters?: React.Dispatch<React.SetStateAction<F>>;
  setCurrentFilters?: React.Dispatch<React.SetStateAction<F>>;
  reset?: () => void;
  id?: string;
  valueMap?: Record<string, Record<string, unknown>>;
  labelMap?: Record<string, string>;
  dates?: string[];
  filterDropdowns?: string[];
  hide?: string[];
  showExport?: boolean;
  showResetFilters?: boolean;
  pagination?: {
    page: number;
    perPage: number;
    count: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
  };
  customColumns?: {
    position: "start" | "end";
    label: string;
    RenderCell: React.FC<{ row: T | null }>;
  }[];
  copyFields?: string[];
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  hideFilters?: boolean;
  downloadLinks?: string[];
}

const DataTable = (props: DataTableProps) => {
  const {
    rows,
    columns,
    initialColumns = [],
    filters = null,
    currentFilters = null,
    setFilters = () => void 0,
    setCurrentFilters = () => void 0,
    reset = () => void 0,
    id = "id",
    hide = [],
    // positions = [],
    filterDropdowns = [],
    dates = [],
    valueMap = null,
    labelMap = null,
    pagination = null,
    customColumns = [],
    // maxStickyColumns = {},
    fetching = false,
    error = false,
    copyFields,
    showExport = false,
    showResetFilters = false,
    setPage,
    initialFilters,
    hideFilters,
    setHitBottom,
    downloadLinks,
  } = props;

  // hooks
  const dispatch = useDispatch();
  const { config, setConfig } = useConfig();

  // states
  const [value, setValue] = React.useState<Dayjs | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dataTableOptionsModal, setDataTableOptionsModal] = React.useState(false);
  const handleDataTableOptionsModalOpen = () => setDataTableOptionsModal(true);
  const handleDataTableOptionsModalClose = () => setDataTableOptionsModal(false);
  const [stickyColumnKey, setStickyColumnKey] = React.useState<string>("");
  const [anchorElSticky, setAnchorElSticky] = React.useState<null | HTMLElement>(null);
  const [hideColumnAnchorEl, setHideColumnAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuValues, setMenuValues] = React.useState<Record<string, unknown>>();
  // const [frozenKeys, setFrozenKeys] = React.useState<{ key: string; pos?: "left" | "right" }[]>(
  //   config.frozenKeys
  // );
  const frozenKeys = config.frozenKeys;
  const maxStickyColumns = config.maxStickyColumns;
  // const hide = config.hide;
  const positions = config.positions;
  const [checkedList, setCheckedList] = React.useState<string[]>([]);

  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const [placeHolder, setPlaceHolder] = React.useState<string>("");
  const [searchColumn, setSearchColumn] = React.useState<string>("");
  const searchOpen = Boolean(anchorElement);
  const handleSearch = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleSearchClose = () => {
    setAnchorElement(null);
  };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const tableCellStyles = {
    bgcolor: "#FFFF",
    border: "1px solid",
    borderColor: "divider",
    whiteSpace: "nowrap",
    py: 0,
  };

  const handleScroll = () => {
    if (containerRef?.current && rowRef?.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (setHitBottom) {
          if (entry.isIntersecting) {
            setHitBottom(true);
          } else {
            setHitBottom(false);
          }
        }
      });
      observer.observe(rowRef?.current);
      // const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      // const hitBottom = Math.round(scrollTop + clientHeight) === scrollHeight;
      // if (hitBottom && pagination) {
      //   if (pagination.count > pagination.perPage && pagination.page < pagination.totalPages)
      //     pagination.onPageChange(pagination.page + 1);
      // }
    }
  };

  // effects

  React.useEffect(() => {
    handleScroll();
  }, [rows?.length]);
  // React.useEffect(() => {
  //   hide.forEach((c) => {
  //     const f = frozenKeys?.find((f) => f.key === c);
  //     if (f?.pos) {
  //       handleStickyness(c, f.pos);
  //     }
  //   });
  // }, [hide]);

  // handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setAnchorEl(event.currentTarget);
    setMenuValues(valueMap?.[key]);
  };

  const handleColumnHideClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHideColumnAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHideColumnClose = () => {
    setHideColumnAnchorEl(null);
  };

  const handleClickSticky = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSticky(event.currentTarget);
  };

  const handleCloseSticky = () => {
    setAnchorElSticky(null);
  };
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const openSticky = Boolean(anchorElSticky);

  const handleStickyness = (key: string, pos: "left" | "right" | "none") => {
    if (pos !== "none") {
      const index = frozenKeys?.findIndex((k) => k.key === key);
      // if the key already exists in frozenKeys
      if (index !== -1) {
        const updated = [...frozenKeys];
        updated[index].pos = pos;
        setConfig((prev) => ({
          ...prev,
          frozenKeys: updated,
        }));
      }
      // if the max sticky columns limit is reached
      else if (frozenKeys?.filter((f) => f.pos === pos).length === maxStickyColumns[pos]) {
        const updated = [...frozenKeys];
        setConfig((prev) => ({
          ...prev,
          frozenKeys: updated.concat({ key, pos }),
        }));
      }
      // add the key to frozenKeys otherwise
      else {
        setConfig((prev) => ({
          ...prev,
          frozenKeys: prev.frozenKeys?.concat({ key, pos }),
        }));
      }
    } else {
      setConfig((prev) => ({
        ...prev,
        frozenKeys: prev.frozenKeys?.filter((f) => f.key !== key),
      }));
    }
  };

  const getStickyStyles = (key: string, body?: boolean) => {
    const index = frozenKeys?.findIndex((k) => k.key === key);
    const pos = frozenKeys?.at(index)?.pos;

    const idx = frozenKeys?.filter((f) => f.pos === pos).findIndex((k) => k.key === key);

    if (idx === -1) return {} as TableCellProps["sx"];

    let i = idx;
    let width = 0;
    while (i !== 0) {
      const prevEl = document.querySelector(
        `[data-column-key=${frozenKeys?.filter((f) => f.pos === pos)?.at(i-- - 1)?.key}]`
      );
      width += prevEl?.getBoundingClientRect?.()?.width || 0;
    }

    return {
      ...(body
        ? {
            position: "sticky",
            top: 0,
          }
        : {
            zIndex: "appBar",
          }),
      ...(pos && {
        [pos]: width,
      }),
      bgcolor: "rgb(248, 248, 248)",
    } as TableCellProps["sx"];
  };

  const getRowCell = (row: DataTableProps["rows"][number], key: string, noTransform = false) => {
    if (valueMap?.[key]) {
      return valueMap[key][row[key]];
    } else if (dates.some((date) => date === key)) {
      if (key === "date_of_birth") return row[key];
      return prettyPrintDate(row[key]);
    } else {
      return noTransform ? row[key] : kebabToCapitalize(row[key]);
    }
  };

  // derived states
  const open = Boolean(anchorEl);
  const hideColumnOpen = Boolean(hideColumnAnchorEl);

  const frozen = {
    left: frozenKeys?.filter((k) => k.pos === "left"),
    right: frozenKeys?.filter((k) => k.pos === "right").reverse(),
  };

  const position = {
    left: positions?.filter((k) => k.pos === "left"),
    right: positions?.filter((k) => k.pos === "right"),
  };

  let filteredColumns = removeDuplicates(frozen.left, position.left)
    .concat(
      columns
        .filter((col) => !positions?.some((key) => col.key === key.key))
        .filter((col) => !frozenKeys?.some((key) => col.key === key.key))
        .concat(removeDuplicates(position.right, frozen.right))
    )
    .filter((col) => !hide.some((key) => col.key === key));
  if (filteredColumns.length === 0) filteredColumns = initialColumns;
  const exportedRows = rows.map((row) => {
    return filteredColumns.reduce((obj, cur) => {
      return {
        ...obj,
        [kebabToCapitalize(cur.key)]: (getRowCell(row, cur.key, false) as string) ?? "",
      };
    }, {});
  });

  return (
    <TableContainer sx={{ maxHeight: 586 }} ref={containerRef}>
      {!fetching && !error && rows.length > 0 && (
        <>
          {/* <DataTableOptionsModal
              open={dataTableOptionsModal}
              onClose={handleDataTableOptionsModalClose}
              columns={columns}
              handleStickyness={handleStickyness}
              hide={hide}
              frozenKeys={frozenKeys}
              positions={positions}
              setConfig={setConfig}
              maxStickyColumns={maxStickyColumns}
            />
            <Box
              sx={{
                bgcolor: "#FFFF",
                display: "flex",
                pr: 3,
                position: "sticky",
                left: 0,
                top: 0,
                zIndex: 1,
              }}
            >
              <Box sx={{ m: 1 }}>
                <ExportToExcel rows={rows} />
              </Box>
              <Button
                size="large"
                startIcon={<SettingsIcon />}
                variant="outlined"
                sx={{ m: 1 }}
                onClick={handleDataTableOptionsModalOpen}
              >
                Options
              </Button>
              {filters &&
                Object.keys(trimObject(filters)).filter(
                  (key) => key !== "page_number" && key !== "no_of_records"
                ).length !== 0 && (
                  <Button
                    size="large"
                    startIcon={<FilterAltIcon />}
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={() => {
                      reset();
                      setFilters({});
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
            </Box> */}
        </>
      )}
      <Table
        size="small"
        stickyHeader
        sx={{
          "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
            // bgcolor: "background.secondary",
          },
          "& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root": {
            fontSize: 13,
            height: 22,
            paddingY: 0.5,
            paddingX: 1,
          },
          "& .MuiTableBody-root .MuiTableRow-root": { height: 26 },
          // overflow: "hidden",
        }}
      >
        <TableHead sx={{ bgcolor: "#FFFF", position: "sticky", top: 0, left: 10, zIndex: 2 }}>
          <TableRow>
            <TableCell
              colSpan={
                rows.length === 0
                  ? initialColumns.length + customColumns.length
                  : columns.length + customColumns.length
              }
              sx={{ bgcolor: "#FFFF" }}
            >
              <Stack direction="row" sx={{ m: 1, gap: 1, alignItems: "center" }}>
                {showExport && rows.length > 0 && <ExportToExcel rows={exportedRows} />}
                {filters &&
                  Object?.keys(trimObject(filters || {})).filter(
                    (key) => key !== "page_number" && key !== "no_of_records"
                  ).length > 0 && (
                    <Button
                      size="large"
                      startIcon={<Filter1Outlined />}
                      variant="outlined"
                      onClick={() => {
                        if (initialFilters) setCurrentFilters(initialFilters as any);
                        reset();
                      }}
                    >
                      Reset Filters
                    </Button>
                  )}
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            {!error &&
              !fetching &&
              (rows.length > 0 || columns.length === 0) &&
              customColumns
                ?.filter((col) => col.position === "start")
                ?.map((col) => {
                  return (
                    <TableCell sx={tableCellStyles} key={col.label}>
                      {col.label}
                    </TableCell>
                  );
                })}
            {filteredColumns.map((column) => {
              const isColumnCopyField = copyFields?.find((f) => f === column.key);
              return (
                <TableCell
                  data-column-key={column.key}
                  align="left"
                  sx={{
                    bgcolor: "#FFFF",
                    border: "1px solid",
                    borderColor: "divider",
                    whiteSpace: "nowrap",
                    "&.MuiTableCell-root": {
                      py: 1,
                    },
                    ...getStickyStyles(column.key),
                  }}
                  key={column.key}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <IconButton
                          sx={{ position: "absolute", left: 0 }}
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            setAnchorElSticky(event.currentTarget);
                            setStickyColumnKey(column.key);
                          }}
                        >
                          <CandlestickChartIcon />
                        </IconButton> */}
                    <Typography noWrap>
                      {labelMap?.[column.key] || capitalizeKey(column.key)}
                    </Typography>
                    {/* <IconButton
                          onClick={(e) => {
                            handleClick(e, column.key);
                          }}
                        >
                          <FilterAltIcon />
                        </IconButton> */}
                  </Box>
                </TableCell>
              );
            })}
            <Menu
              sx={{ maxHeight: "200px" }}
              id="basic-menu"
              anchorEl={anchorElSticky}
              open={openSticky}
              onClose={handleCloseSticky}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <RadioGroup
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  p: 1,
                }}
              >
                <FormControlLabel
                  // value="left"
                  checked={frozenKeys.some((f) => f.key === stickyColumnKey && f.pos === "left")}
                  onChange={(e) => handleStickyness(stickyColumnKey, "left")}
                  control={<Radio />}
                  label="Sticky Left"
                  onClick={handleCloseSticky}
                />
                <FormControlLabel
                  // value="right"
                  checked={frozenKeys.some((f) => f.key === stickyColumnKey && f.pos === "right")}
                  control={<Radio />}
                  label="Stick Right"
                  onClick={handleCloseSticky}
                  onChange={(e) => handleStickyness(stickyColumnKey, "right")}
                />
                <FormControlLabel
                  checked={!frozenKeys.some((f) => f.key === stickyColumnKey)}
                  // value="none"
                  control={<Radio />}
                  label="none"
                  onClick={handleCloseSticky}
                  onChange={(e) => handleStickyness(stickyColumnKey, "none")}
                />
              </RadioGroup>
            </Menu>
            {!error &&
              !fetching &&
              customColumns
                ?.filter((col) => col.position === "end")
                ?.map((col) => {
                  return (
                    <TableCell
                      rowSpan={2}
                      data-column-key={col.label}
                      sx={tableCellStyles}
                      key={col.label}
                    >
                      {col.label}
                    </TableCell>
                  );
                })}
          </TableRow>
          {!hideFilters && (
            <TableRow>
              {!error &&
                !fetching &&
                customColumns
                  ?.filter((col) => col.position === "start")
                  ?.map((col) => {
                    return (
                      <TableCell sx={{ my: 1, ...tableCellStyles }} key={col.label} align="center">
                        <col.RenderCell row={null} />
                      </TableCell>
                    );
                  })}
              {filteredColumns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    bgcolor: "#FFFF",
                    p: 0,
                    minWidth: 160,
                    ...getStickyStyles(column.key),
                  }}
                >
                  {filterDropdowns.some((col) => col === column.key) ? (
                    <Select
                      fullWidth
                      sx={{ height: 36.13 }}
                      defaultValue="all"
                      value={currentFilters?.[column.key]}
                      onChange={(e) => {
                        setCurrentFilters((prev) => ({
                          ...prev,
                          [column.key]: e.target.value === "all" ? undefined : e.target.value,
                        }));
                        reset();
                        setFilters((prev) => ({
                          ...prev,
                          [column.key]: e.target.value === "all" ? undefined : e.target.value,
                        }));
                      }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      {Object.entries(valueMap?.[column.key] || {})
                        .filter(([v]) => !Number.isNaN(+v))
                        .map(([key, value]) => {
                          return (
                            <MenuItem
                              key={key}
                              value={valueMap?.[column.key]?.[value as any] as string}
                            >
                              {valueMap?.[column.key]?.[key] as string}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  ) : (
                    <>
                      {dates.find((col) => col === column.key) ? (
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          value={filters?.[column.key] || null}
                          onChange={(newValue) => {
                            // reset();
                            if (column.key === "created_at") {
                              setCurrentFilters((prev) => ({
                                ...prev,
                                from_date: newValue,
                                to_date: newValue,
                                page_number: 1,
                                no_of_records: 10,
                              }));
                              setFilters((prev) => ({
                                ...prev,
                                from_date: formatDate(newValue as string),
                                to_date: formatDate(newValue as string),
                                page_number: 1,
                                no_of_records: 10,
                              }));
                            } else {
                              setCurrentFilters((prev) => ({
                                ...prev,
                                [column.key]: newValue,
                                page_number: 1,
                                no_of_records: 10,
                              }));
                              setFilters((prev) => ({
                                ...prev,
                                [column.key]: formatDate(newValue as string),
                                page_number: 1,
                                no_of_records: 10,
                              }));
                            }
                          }}
                          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                            <TextField
                              sx={{
                                input: { py: 1 },
                                "& .MuiInputAdornment-root": {
                                  ml: "unset",
                                },
                              }}
                              fullWidth
                              // inputProps={{ ...params.inputProps, readOnly: true }}
                              onKeyDown={(e) => e.preventDefault()}
                              {...params}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          sx={{ input: { py: 1, px: 0 } }}
                          placeholder={column.key === searchColumn ? placeHolder : ""}
                          name={column.key}
                          fullWidth
                          value={currentFilters?.[column.key] || ""}
                          onChange={(e) => {
                            setCurrentFilters((prev) => ({
                              ...prev,
                              [column.key]: e.target.value,
                            }));
                          }}
                          onKeyUp={(e) => {
                            if (
                              e.key === "Enter" &&
                              currentFilters &&
                              currentFilters?.[column.key]
                            ) {
                              reset();
                              setFilters(trimObject(currentFilters));
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                onClick={(e) => {
                                  setSearchColumn(column.key);
                                  handleSearch(e);
                                }}
                                sx={{
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <Search fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: currentFilters?.[column.key] ? (
                              <InputAdornment
                                position="end"
                                sx={{
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <IconButton
                                  sx={{ px: 0 }}
                                  onClick={() => {
                                    setCurrentFilters((prev) => ({
                                      ...prev,
                                      [column?.key]: "",
                                    }));
                                  }}
                                >
                                  <CloseSharp fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ) : (
                              <></>
                            ),
                          }}
                        />
                      )}
                    </>
                  )}
                </TableCell>
              ))}
              {/* <SearchDropdown
                  anchorEl={anchorElement}
                  open={searchOpen}
                  handleClose={handleSearchClose}
                  setPlaceHolder={setPlaceHolder}
                /> */}
              {/* {customColumns
                ?.filter((col) => col.position === "end")
                ?.map((col) => {
                  return (
                    <TableCell
                      sx={{
                        bgcolor: "#FFFF",
                        border: "1px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                        py: 1,
                      }}
                      key={col.label}
                    >
                      <col.RenderCell row={null} />
                    </TableCell>
                  );
                })} */}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell sx={{ bgcolor: "white" }} colSpan={initialColumns.length}>
                <Typography fontWeight={600} variant="h4" textAlign="center">
                  Something went wrong 💻
                </Typography>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                sx={{ bgcolor: "white" }}
                colSpan={initialColumns.length + customColumns.length}
              >
                <Box
                  sx={{
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <img src="/assets/nodata.svg" alt="data-not-found" />
                  <Typography fontWeight={600} variant="h4" textAlign="center">
                    Data Not Found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row[id]} ref={rowRef}>
                {!error &&
                  customColumns
                    ?.filter((col) => col.position === "start")
                    ?.map((col) => {
                      return (
                        <TableCell
                          sx={{
                            bgcolor: "#FFFF",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                          key={col.label}
                          align="center"
                        >
                          <col.RenderCell row={row} />
                        </TableCell>
                      );
                    })}
                {filteredColumns.map((column) => {
                  const isValueCopyField = copyFields?.includes(column.key);
                  return (
                    <TableCell
                      sx={{
                        bgcolor: "#FFFF",
                        border: "1px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                        py: 1,
                        pr: 1,
                        ...getStickyStyles(column.key, true),
                      }}
                      key={column.key}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          width: isValueCopyField ? "200px" : "unset",
                          minHeight: "45px",
                        }}
                      >
                        <Typography variant="body2" noWrap>
                          {getRowCell(row, column.key, isValueCopyField)}
                        </Typography>
                        {isValueCopyField && getRowCell(row, column.key, isValueCopyField) && (
                          <IconButton
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            onClick={() => {
                              copyToClipboard(
                                getRowCell(row, column.key, isValueCopyField) as string
                              );
                              toast.success(
                                `${getRowCell(row, column.key, isValueCopyField)} copied`
                              );
                            }}
                          >
                            <ContentCopyIcon fontSize="small" color="primary" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  );
                })}
                {!error &&
                  customColumns
                    ?.filter((col) => col.position === "end")
                    ?.map((col) => {
                      return (
                        <TableCell
                          sx={{
                            bgcolor: "#FFFF",
                            border: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "nowrap",
                            py: 1,
                          }}
                          key={col.label}
                        >
                          <col.RenderCell row={row} />
                        </TableCell>
                      );
                    })}
              </TableRow>
            ))
          )}
          {fetching && (
            <TableRow>
              <TableCell sx={{ bgcolor: "white" }} colSpan={initialColumns.length}>
                <Typography fontWeight={600} variant="h4" textAlign="center">
                  <CircularProgress />
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function DataTableWrapper(props: DataTableProps) {
  return (
    <ConfigProvider>
      <DataTable {...props} />
    </ConfigProvider>
  );
}
