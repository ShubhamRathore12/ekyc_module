import FilterDorpDownMenu from "@components/common/Dropdowns/FilterDorpDownMenu";
import { ShowIcon } from "@components/DataGrid";
import MoreOptionsIcon from "@components/lib/DataTable/icons/MoreOptionsIcon";
import capitalizeKey from "@components/lib/DataTable/utils/capitalizeKey";
import { Search } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import exportXLSX from "@utils/exportToXlsx";
import trimObject from "@utils/trimObject";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import EmailLog from "../dialogues/EmailLog";
import MobileLog from "../dialogues/MobileLog";
export interface DataTableProps {
  rows: any[];
  columns: { key: string }[];
  filters?: Record<string, string>;
  setFilters?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  id?: string;
  valueMap?: Record<string, any>;
  labelMap?: Record<string, any>;
  dates?: string[];
  hide?: string[];
  pagination?: {
    page: number;
    perPage: number;
    count: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
  };
  showExport?: boolean;
  showOption?: boolean;
  bank?: boolean;
  segment?: boolean;
}

const CDURequestsDataTable = (props: DataTableProps) => {
  const {
    showOption = false,
    showExport,
    rows,
    columns,
    filters = null,
    setFilters = () => void 0,
    id = "id",
    hide = [],
    dates = [],
    valueMap = null,
    labelMap = null,
    pagination = null,
    bank = false,
    segment = false,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuValues, setMenuValues] = useState<Record<string, string>>();
  const [frozenKey, setFrozenKey] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = React.useState(filters);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setAnchorEl(event.currentTarget);
    setMenuValues(valueMap?.[key]);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStickyness = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setFrozenKey((current) => [...current, key]);
  };
  const shiftToFront = (_columns: any[], key: string[]) => {
    const columns = [..._columns];
    for (let i = 0; i < key.length; i++) {
      const index = columns.findIndex((column) => column.key === key[i]);
      columns.unshift(columns.splice(index, 1)[0]);
    }
    return columns;
  };
  // console.log("frozenkey", frozenKey);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const getRowCell = React.useCallback(
    (row: DataTableProps["rows"][number], key: string) => {
      if (valueMap?.[key]) {
        return valueMap[key][row[key]];
      } else if (dates.some((date) => date === key)) {
        return new Date(row[key]).toDateString();
      } else {
        return row[key];
      }
    },
    [valueMap, dates, rows, frozenKey]
  );

  const stickyColumsRef = useRef<HTMLTableCellElement[]>([]);

  React.useEffect(() => {
    const el = containerRef.current;
    const handleScroll = (ev: Event) => {
      if (containerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
        // console.log({ scrollTop, clientHeight, scrollHeight, add: scrollTop + clientHeight });
        const hitBottom = Math.round(scrollTop + clientHeight) === scrollHeight;
        if (hitBottom && pagination) {
          if (
            pagination?.count > pagination?.perPage ||
            pagination?.page < pagination?.totalPages - 1
          )
            pagination?.onPageChange(pagination.page + 1);
        }
      }
    };
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [pagination]);

  const filteredColumns = shiftToFront(
    columns.filter((column) => !hide.some((key) => key === column.key)),
    frozenKey
  );
  const router = useRouter();
  // const styles = React.useCallback(() => {
  //   const widthMap: Record<string, number> = {};
  //   frozenKey.forEach((key) => {
  //     const cell = document.querySelector<HTMLTableCellElement>(`[data-column-key=${key}]`);
  //     widthMap[key] = cell?.getBoundingClientRect().width || -1;
  //   });
  //   filteredColumns.forEach((column, index) => {
  //     if (index === 0 || !frozenKey.some((_key) => _key === column.key)) return;
  //     const previousKey = filteredColumns[index - 1].key;
  //     const currentKey = column.key;
  //     const previousWidth = widthMap[previousKey];
  //     console.log({ previousWidth, previousKey, currentKey });
  //   });
  //   return {};
  // }, [filteredColumns, frozenKey, columns]);
  // styles();
  // rows.map((row) => {
  //   console.log(row.user_code);
  // });
  const [emailLog, setEmailLog] = useState(false);
  const [mobileLog, setMobileLog] = useState(false);
  const [currentUserCode, setCurrentUserCode] = useState<string>("");
  const handleLogs = (userCode: string) => {
    if (router.query.stage === CDURequestsTab.EMAIL) {
      setEmailLog(true);
      setCurrentUserCode(userCode);
    } else if (router.query.stage === CDURequestsTab.MOBILE) {
      setMobileLog(true);
      setCurrentUserCode(userCode);
    }
  };
  return (
    <>
      {!showExport && (
        <Button
          size="large"
          onClick={() => {
            exportXLSX(rows, "exported data");
          }}
          sx={{ float: "right", mb: 2.5, alignItems: "center" }}
          variant="contained"
          startIcon={<ExitToAppIcon />}
        >
          Export to Excel
        </Button>
      )}
      <TableContainer sx={{ maxHeight: 696, bgcolor: "#FFFF" }} ref={containerRef}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ bgcolor: "#FFFF", position: "sticky", top: 0, zIndex: 1 }}>
            <TableRow>
              {showOption && (
                <TableCell
                  sx={{
                    bgcolor: "#FFFF",
                    border: "1px solid",
                    borderColor: "divider",
                    whiteSpace: "nowrap",
                    py: 1,
                  }}
                >
                  Show
                </TableCell>
              )}
              {filteredColumns.map((column, i) => (
                <TableCell
                  data-column-key={i}
                  sx={{
                    bgcolor: "#FFFF",
                    border: "1px solid",
                    borderColor: "divider",
                    whiteSpace: "nowrap",
                    py: 0.5,
                    ...(frozenKey.some((key) => {
                      return key === column.key;
                    }) && {
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      bgcolor: "rgb(248, 248, 248)",
                    }),
                    "&.MuiTableCell-root": {
                      paddingRight: 0,
                    },
                  }}
                  key={i}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <IconButton
                      sx={{ position: "absolute", left: 0 }}
                      onClick={(e) => {
                        handleStickyness(e, column.key);
                      }}
                    >
                      <MoreOptionsIcon />
                    </IconButton>
                    <Typography noWrap sx={{ ml: 4 }}>
                      {labelMap?.[column.key] || capitalizeKey(column.key)}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        handleClick(e, column.key);
                      }}
                    >
                      <FilterAltIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
              {!showOption && (
                <>
                  <TableCell
                    sx={{
                      bgcolor: "#FFFF",
                      border: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      py: 1,
                    }}
                  >
                    <Typography>Action</Typography>
                  </TableCell>
                </>
              )}
              <Box>
                <FilterDorpDownMenu
                  anchorEl={anchorEl}
                  open={open}
                  handleClose={handleClose}
                  menuValues={menuValues}
                />
              </Box>
            </TableRow>
            <TableRow sx={{ zIndex: 1 }}>
              {showOption && (
                <TableCell
                  sx={{
                    bgcolor: "#FFFF",
                    border: "1px solid",
                    borderColor: "divider",
                    whiteSpace: "nowrap",
                    py: 1,
                  }}
                >
                  <ShowIcon />
                </TableCell>
              )}
              {filteredColumns.map((column, i) => (
                <TableCell
                  key={i}
                  sx={{
                    bgcolor: "#FFFF",
                    p: 0,
                    minWidth: 100,
                    ...(frozenKey.some((key) => {
                      return key === column.key;
                    }) && {
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      bgcolor: "rgb(248, 248, 248)",
                    }),
                  }}
                >
                  <TextField
                    sx={{ input: { py: 1 } }}
                    name={column.key}
                    fullWidth
                    value={currentFilters?.[column.key]}
                    onChange={(e) => {
                      setCurrentFilters((prev) => ({ ...prev, [column.key]: e.target.value }));
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && currentFilters)
                        setFilters(trimObject(currentFilters));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
              ))}
              {!showOption && (
                <>
                  <TableCell
                    sx={{
                      bgcolor: "#FFFF",
                      border: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      py: 1,
                    }}
                  >
                    <ShowIcon />
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {showOption && (
                  <TableCell
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      py: 1,
                    }}
                  >
                    <Typography>
                      <CDURequestsLinkComponent id={row.user_code} bank={bank} segment={segment} />
                    </Typography>
                  </TableCell>
                )}
                {filteredColumns.map((column, i) => (
                  <TableCell
                    sx={{
                      bgcolor: "#FFFF",
                      border: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      py: 1,
                      ...(frozenKey.some((key) => {
                        return key === column.key;
                      }) && {
                        position: "sticky",
                        left: 0,
                        bgcolor: "rgb(248, 248, 248)",
                      }),
                    }}
                    key={i}
                  >
                    {getRowCell(row, column.key)}
                  </TableCell>
                ))}
                {!showOption && (
                  <>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                        py: 1,
                      }}
                    >
                      <Button
                        onClick={(e) => {
                          handleLogs(row.user_code);
                        }}
                        sx={{ textTransform: "none" }}
                        startIcon={<LaunchIcon color="primary" />}
                      >
                        View Log
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {emailLog && (
              <EmailLog
                open={emailLog}
                closeHandle={() => setEmailLog(false)}
                userCode={currentUserCode}
              />
            )}
            {mobileLog && (
              <MobileLog
                open={mobileLog}
                closeHandle={() => setMobileLog(false)}
                userCode={currentUserCode}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CDURequestsDataTable;

import { CDURequestsTab } from "@components/cdu-requests/utils/cdu-request";

interface IProps {
  id?: string;
  bank?: boolean;
  segment?: boolean;
}

export const CDURequestsLinkComponent = ({ id, segment, bank }: IProps) => {
  const router = useRouter();
  return (
    <IconButton>
      {segment && (
        <Link
          href={{
            pathname: "/cdu-request/segment/[usercode]",
            query: { usercode: id },
          }}
        >
          <LaunchIcon color="primary" />
        </Link>
      )}
      {bank && (
        <>
          <Link
            href={{
              pathname: "/cdu-request/bank-details/[usercode]",
              query: { usercode: id },
            }}
          >
            <LaunchIcon color="primary" />
          </Link>
        </>
      )}
    </IconButton>
  );
};
