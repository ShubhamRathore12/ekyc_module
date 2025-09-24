// // import { CandlestickChart, CloseSharp, Search } from "@mui/icons-material";
// // import {
// //   Box,
// //   FormControlLabel,
// //   IconButton,
// //   InputAdornment,
// //   Menu,
// //   MenuItem,
// //   Radio,
// //   RadioGroup,
// //   Select,
// //   Stack,
// //   TableCell,
// //   TextField,
// //   TextFieldProps,
// //   Typography,
// //   styled,
// // } from "@mui/material";
// // import { DatePicker } from "@mui/x-date-pickers";
// // import { formatDate } from "@utils/formatDate";
// // import kebabToCapitalize from "@utils/kebabToCapitalize";
// // import trimObject from "@utils/trimObject";
// // import React from "react";

// // import { useConfig } from "../hooks/config";
// // import { getStickyStyles } from "../utils/get-sticky-styles";
// // import { handleStickiness } from "../utils/handleStickyness";

// // const StyledTextField = styled(TextField)(({ theme }) => ({
// //   input: { py: 1 },
// //   "& .MuiInputBase-root": {
// //     height: "40px",
// //   },
// //   "& .MuiInputAdornment-root": {
// //     marginLeft: "-10px",
// //   },
// //   "& .MuiInputBase-root.MuiOutlinedInput-root": {
// //     borderRadius: "unset",
// //   },
// //   "& .MuiOutlinedInput-notchedOutline": {
// //     border: "none",
// //     borderTop: "1px solid",
// //     borderColor: theme.palette.divider,
// //   },
// //   "&:hover .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// //   "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// //   "&:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// // }));

// // const StyledSelect = styled(Select)(({ theme }) => ({
// //   "&.MuiInputBase-root.MuiOutlinedInput-root": {
// //     borderRadius: "unset",
// //   },
// //   "& .MuiOutlinedInput-notchedOutline": {
// //     border: "none",
// //     borderTop: "1px solid",
// //     borderColor: theme.palette.divider,
// //   },
// //   "&:hover .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// //   "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// //   "&.Mui-focused.MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
// //     borderColor: theme.palette.divider,
// //   },
// // }));

// // interface Props<T> {
// //   column: {
// //     key: string;
// //     RenderHeadCell?: React.FC;
// //   };
// //   dates?: string[];
// //   filterDropdowns?: string[];
// //   currentFilters: T;
// //   setCurrentFilters: React.Dispatch<React.SetStateAction<T>>;
// //   actualFilters: T;
// //   setActualFilters: React.Dispatch<React.SetStateAction<T>>;
// //   valueMap?: Record<string, Record<string, unknown>>;
// //   labelMap?: Record<string, string>;
// //   fontSize?: number;
// //   hideFilters?: boolean;
// // }

// // export const TableColumnCell = <T extends Record<string, any>>({
// //   column,
// //   currentFilters,
// //   dates,
// //   filterDropdowns,
// //   actualFilters,
// //   setCurrentFilters,
// //   setActualFilters,
// //   valueMap,
// //   hideFilters,
// //   labelMap,
// // }: Props<T>) => {
// //   const { config, setConfig } = useConfig();

// //   const frozenKeys = config.frozenKeys;
// //   const maxStickyColumns = config.maxStickyColumns;

// //   const [anchorElSticky, setAnchorElSticky] = React.useState<null | HTMLElement>(null);
// //   const [stickyColumnKey, setStickyColumnKey] = React.useState<string>("");

// //   const handleCloseSticky = () => {
// //     setAnchorElSticky(null);
// //   };
// //   const openSticky = Boolean(anchorElSticky);

// //   if (!column) return null;

// //   return (
// //     <TableCell
// //       data-column-key={column.key}
// //       sx={{ p: 0, minWidth: "150px", ...getStickyStyles(column?.key, frozenKeys) }}
// //     >
// //       <Stack>
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //           }}
// //         >
// //           <Typography sx={{ px: 2, py: 1, whiteSpace: "nowrap" }}>
// //             {labelMap?.[column.key] || kebabToCapitalize(column?.key)}
// //           </Typography>
// //           {!column.RenderHeadCell && (
// //             <IconButton
// //               sx={{ left: 0 }}
// //               onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
// //                 setAnchorElSticky(event.currentTarget);
// //                 setStickyColumnKey(column.key);
// //               }}
// //             >
// //               <CandlestickChart />
// //             </IconButton>
// //           )}
// //         </Box>
// //         {!hideFilters && (
// //           <>
// //             <Menu
// //               sx={{ maxHeight: "200px" }}
// //               id="basic-menu"
// //               anchorEl={anchorElSticky}
// //               open={openSticky}
// //               onClose={handleCloseSticky}
// //               MenuListProps={{
// //                 "aria-labelledby": "basic-button",
// //               }}
// //             >
// //               <Box sx={{ display: "flex", flexDirection: "column", px: 2 }}>
// //                 <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Sticky</Typography>
// //                 <RadioGroup
// //                   sx={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     flexDirection: "row",
// //                     gap: 1,
// //                     "& .MuiFormControlLabel-root": {
// //                       m: 0,
// //                     },
// //                     "& .MuiButtonBase-root ": {
// //                       pl: 0,
// //                     },
// //                   }}
// //                 >
// //                   <FormControlLabel
// //                     // value="left"
// //                     checked={frozenKeys.some((f) => f.key === column.key && f.pos === "left")}
// //                     onChange={() =>
// //                       handleStickiness(
// //                         stickyColumnKey,
// //                         "left",
// //                         frozenKeys,
// //                         setConfig,
// //                         maxStickyColumns
// //                       )
// //                     }
// //                     control={<Radio />}
// //                     label="Left"
// //                     onClick={handleCloseSticky}
// //                     disabled={
// //                       config.maxStickyColumns.left ===
// //                       frozenKeys.filter((f) => f.pos === "left").length
// //                     }
// //                   />
// //                   <FormControlLabel
// //                     // value="right"
// //                     checked={frozenKeys.some((f) => f.key === column.key && f.pos === "right")}
// //                     control={<Radio />}
// //                     label="Right"
// //                     onClick={handleCloseSticky}
// //                     onChange={() =>
// //                       handleStickiness(
// //                         stickyColumnKey,
// //                         "right",
// //                         frozenKeys,
// //                         setConfig,
// //                         maxStickyColumns
// //                       )
// //                     }
// //                     disabled={
// //                       config.maxStickyColumns.right ===
// //                       frozenKeys.filter((f) => f.pos === "right").length
// //                     }
// //                   />
// //                   <FormControlLabel
// //                     checked={!frozenKeys.some((f) => f.key === column.key)}
// //                     // value="none"
// //                     control={<Radio />}
// //                     label="None"
// //                     onClick={handleCloseSticky}
// //                     onChange={() =>
// //                       handleStickiness(
// //                         stickyColumnKey,
// //                         "none",
// //                         frozenKeys,
// //                         setConfig,
// //                         maxStickyColumns
// //                       )
// //                     }
// //                   />
// //                 </RadioGroup>
// //               </Box>
// //             </Menu>
// //             {column.RenderHeadCell ? (
// //               <>
// //                 <column.RenderHeadCell />
// //               </>
// //             ) : filterDropdowns?.some((col) => col === column?.key) ? (
// //               <StyledSelect
// //                 fullWidth
// //                 sx={{ height: 40 }}
// //                 defaultValue="all"
// //                 value={currentFilters?.[column?.key] ?? "all"}
// //                 onChange={(e) => {
// //                   const value = e.target.value === "all" ? undefined : e.target.value;

// //                   setCurrentFilters?.((prev: any) => ({
                       
// //                     ...prev,
// //                     [column?.key]: value,
// //                      page_number: 1,
// //       current_page: 1,
// //       offset: 0,
          
// //                   }));

// //                   setActualFilters?.((prev) => ({
                   
// //                     ...prev,
// //                     [column?.key]: value,
// //                      page_number: 1,
// //       current_page: 1,
// //       offset: 0,
                  
// //                   }));
// //                 }}
// //               >
// //                 <MenuItem value="all">All</MenuItem>
// //                 {Object.entries(valueMap?.[column?.key] || {}).map(([key, value]) => (
// //                   <MenuItem key={key} value={valueMap?.[column?.key]?.[value as any] as string}>
// //                     {valueMap?.[column?.key]?.[key] as string}
// //                   </MenuItem>
// //                 ))}
// //               </StyledSelect>
// //             ) : dates?.includes(column?.key) ? (
// //               <DatePicker
// //                 inputFormat="dd/MM/yyyy"
// //                 value={
// //                   actualFilters?.[column.key === "created_at" ? "from_date" : column.key] || null
// //                 }
// //                 onChange={(newValue) => {
// //                   if (column.key === "created_at") {
// //                     setCurrentFilters?.((prev) => ({
// //                       ...prev,
// //                       from_date: newValue,
// //                       to_date: newValue,
// //                       page_number: 1,
// //                       no_of_records: 10,
// //                     }));
// //                     setActualFilters?.((prev) => ({
// //                       ...prev,
// //                       from_date: formatDate(newValue as string),
// //                       to_date: formatDate(newValue as string),
// //                       page_number: 1,
// //                       no_of_records: 10,
// //                     }));
// //                   } else {
// //                     setCurrentFilters?.((prev) => ({
// //                       ...prev,
// //                       [column.key]: newValue,
// //                       page_number: 1,
// //                       no_of_records: 10,
// //                     }));
// //                     setActualFilters?.((prev) => ({
// //                       ...prev,
// //                       [column.key]: formatDate(newValue as string),
// //                       page_number: 1,
// //                       no_of_records: 10,
// //                     }));
// //                   }
// //                 }}
// //                 renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
// //                   <StyledTextField
// //                     fullWidth
// //                     // inputProps={{ ...params.inputProps, readOnly: true }}
// //                     onKeyDown={(e) => e.preventDefault()}
// //                     {...params}
// //                   />
// //                 )}
// //               />
// //             ) : (
// //               <StyledTextField
// //                 sx={{ input: { py: 1, px: 0 } }}
// //                 name={column.key}
// //                 value={currentFilters?.[column.key] || ""}
// //                 onChange={(e) => {
// //                   setCurrentFilters?.((prev) => ({
// //                     ...prev,
// //                     [column.key]: e.target.value,
// //                   }));
// //                 }}
// //                 onKeyUp={(e) => {
// //                   if (e.key === "Enter" && currentFilters && currentFilters?.[column.key]) {
// //                     setActualFilters?.(trimObject(currentFilters) as any);
// //                   }
// //                 }}
// //                 InputProps={{
// //                   startAdornment: (
// //                     <InputAdornment
// //                       position="start"
// //                       sx={{
// //                         "&:hover": {
// //                           cursor: "pointer",
// //                         },
// //                       }}
// //                     >
// //                       <Search fontSize="small" />
// //                     </InputAdornment>
// //                   ),
// //                   endAdornment: currentFilters?.[column.key] && (
// //                     <InputAdornment
// //                       position="end"
// //                       sx={{
// //                         "&:hover": {
// //                           cursor: "pointer",
// //                         },
// //                       }}
// //                     >
// //                       <IconButton
// //                         sx={{ px: 0 }}
// //                         onClick={() => {
// //                           setCurrentFilters?.((prev) => ({
// //                             ...prev,
// //                             [column.key]: "",
// //                           }));
// //                           setActualFilters?.((prev) => ({
// //                             ...prev,
// //                             [column.key]: "",
// //                           }));
// //                         }}
// //                       >
// //                         <CloseSharp fontSize="small" />
// //                       </IconButton>
// //                     </InputAdornment>
// //                   ),
// //                 }}
// //               />
// //             )}
// //           </>
// //         )}
// //       </Stack>
// //     </TableCell>
// //   );
// // };


// import { CandlestickChart, CloseSharp, Search } from "@mui/icons-material";
// import {
//   Box,
//   FormControlLabel,
//   IconButton,
//   InputAdornment,
//   Menu,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   Stack,
//   TableCell,
//   TextField,
//   TextFieldProps,
//   Typography,
//   styled,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import { formatDate } from "@utils/formatDate";
// import kebabToCapitalize from "@utils/kebabToCapitalize";
// import trimObject from "@utils/trimObject";
// import React from "react";

// import { useConfig } from "../hooks/config";
// import { getStickyStyles } from "../utils/get-sticky-styles";
// import { handleStickiness } from "../utils/handleStickyness";
// import { useSelector } from "react-redux";
// import { RootState } from "store";

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   input: { py: 1 },
//   "& .MuiInputBase-root": {
//     height: "40px",
//   },
//   "& .MuiInputAdornment-root": {
//     marginLeft: "-10px",
//   },
//   "& .MuiInputBase-root.MuiOutlinedInput-root": {
//     borderRadius: "unset",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     border: "none",
//     borderTop: "1px solid",
//     borderColor: theme.palette.divider,
//   },
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
//   "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
//   "&:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
// }));

// const StyledSelect = styled(Select)(({ theme }) => ({
//   "&.MuiInputBase-root.MuiOutlinedInput-root": {
//     borderRadius: "unset",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     border: "none",
//     borderTop: "1px solid",
//     borderColor: theme.palette.divider,
//   },
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
//   "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
//   "&.Mui-focused.MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
// }));

// interface Props<T> {
//   column: {
//     key: string;
//     RenderHeadCell?: React.FC;
//   };
//   dates?: string[];
//   filterDropdowns?: string[];
//   currentFilters: T;
//   setCurrentFilters: React.Dispatch<React.SetStateAction<T>>;
//   actualFilters: T;
//   setActualFilters: React.Dispatch<React.SetStateAction<T>>;
//   valueMap?: Record<string, Record<string, unknown>>;
//   labelMap?: Record<string, string>;
//   fontSize?: number;
//   hideFilters?: boolean;

// }

// export const TableColumnCell = <T extends Record<string, any>>({
//   column,
//   currentFilters,
//   dates,
//   filterDropdowns,
//   actualFilters,
//   setCurrentFilters,
//   setActualFilters,
//   valueMap,
//   hideFilters,
//   labelMap,

// }: Props<T>) => {
//   const { config, setConfig } = useConfig();

//   const frozenKeys = config.frozenKeys;
//   const maxStickyColumns = config.maxStickyColumns;

//   const [anchorElSticky, setAnchorElSticky] = React.useState<null | HTMLElement>(null);
//   const [stickyColumnKey, setStickyColumnKey] = React.useState<string>("");

//   const loginmf = useSelector((state: RootState) => state.auth.login);


//   const handleCloseSticky = () => {
//     setAnchorElSticky(null);
//   };
//   const openSticky = Boolean(anchorElSticky);

//   // Check if current column should show dropdown filter
//   const shouldShowDropdownFilter = () => {
//     if (!filterDropdowns?.some((col) => col === column?.key)) {
//       return false;
//     }
    
//     // If column is product_code, only show for super_admin
//     if (column?.key === 'product_code') {
//       return loginmf?.data?.admin_type  === 'super_admin' || loginmf?.data?.admin_type  === 'kra' || loginmf?.data?.admin_type  === 'backoffice'
//     }
    
//     // For other columns, show normally
//     return true;
//   };

//   if (!column) return null;

//   return (
//     <TableCell
//       data-column-key={column.key}
//       sx={{ p: 0, minWidth: "150px", ...getStickyStyles(column?.key, frozenKeys) }}
//     >
//       <Stack>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography sx={{ px: 2, py: 1, whiteSpace: "nowrap" }}>
//             {labelMap?.[column.key] || kebabToCapitalize(column?.key)}
//           </Typography>
//           {!column.RenderHeadCell && (
//             <IconButton
//               sx={{ left: 0 }}
//               onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
//                 setAnchorElSticky(event.currentTarget);
//                 setStickyColumnKey(column.key);
//               }}
//             >
//               <CandlestickChart />
//             </IconButton>
//           )}
//         </Box>
//         {!hideFilters && (
//           <>
//             <Menu
//               sx={{ maxHeight: "200px" }}
//               id="basic-menu"
//               anchorEl={anchorElSticky}
//               open={openSticky}
//               onClose={handleCloseSticky}
//               MenuListProps={{
//                 "aria-labelledby": "basic-button",
//               }}
//             >
//               <Box sx={{ display: "flex", flexDirection: "column", px: 2 }}>
//                 <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Sticky</Typography>
//                 <RadioGroup
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     flexDirection: "row",
//                     gap: 1,
//                     "& .MuiFormControlLabel-root": {
//                       m: 0,
//                     },
//                     "& .MuiButtonBase-root ": {
//                       pl: 0,
//                     },
//                   }}
//                 >
//                   <FormControlLabel
//                     checked={frozenKeys.some((f) => f.key === column.key && f.pos === "left")}
//                     onChange={() =>
//                       handleStickiness(
//                         stickyColumnKey,
//                         "left",
//                         frozenKeys,
//                         setConfig,
//                         maxStickyColumns
//                       )
//                     }
//                     control={<Radio />}
//                     label="Left"
//                     onClick={handleCloseSticky}
//                     disabled={
//                       config.maxStickyColumns.left ===
//                       frozenKeys.filter((f) => f.pos === "left").length
//                     }
//                   />
//                   <FormControlLabel
//                     checked={frozenKeys.some((f) => f.key === column.key && f.pos === "right")}
//                     control={<Radio />}
//                     label="Right"
//                     onClick={handleCloseSticky}
//                     onChange={() =>
//                       handleStickiness(
//                         stickyColumnKey,
//                         "right",
//                         frozenKeys,
//                         setConfig,
//                         maxStickyColumns
//                       )
//                     }
//                     disabled={
//                       config.maxStickyColumns.right ===
//                       frozenKeys.filter((f) => f.pos === "right").length
//                     }
//                   />
//                   <FormControlLabel
//                     checked={!frozenKeys.some((f) => f.key === column.key)}
//                     control={<Radio />}
//                     label="None"
//                     onClick={handleCloseSticky}
//                     onChange={() =>
//                       handleStickiness(
//                         stickyColumnKey,
//                         "none",
//                         frozenKeys,
//                         setConfig,
//                         maxStickyColumns
//                       )
//                     }
//                   />
//                 </RadioGroup>
//               </Box>
//             </Menu>
//             {column.RenderHeadCell ? (
//               <>
//                 <column.RenderHeadCell />
//               </>
//             ) : shouldShowDropdownFilter() ? (
//               <StyledSelect
//                 fullWidth
//                 sx={{ height: 40 }}
//                 defaultValue="all"
//                 value={currentFilters?.[column?.key] ?? "all"}
//                 onChange={(e) => {
//                   const value = e.target.value === "all" ? undefined : e.target.value;

//                   setCurrentFilters?.((prev: any) => ({
//                     ...prev,
//                     [column?.key]: value,
//                     page_number: 1,
//                     current_page: 1,
//                     offset: 0,
//                   }));

//                   setActualFilters?.((prev) => ({
//                     ...prev,
//                     [column?.key]: value,
//                     page_number: 1,
//                     current_page: 1,
//                     offset: 0,
//                   }));
//                 }}
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 {Object.entries(valueMap?.[column?.key] || {}).map(([key, value]) => (
//                   <MenuItem key={key} value={valueMap?.[column?.key]?.[value as any] as string}>
//                     {valueMap?.[column?.key]?.[key] as string}
//                   </MenuItem>
//                 ))}
//               </StyledSelect>
//             ) : dates?.includes(column?.key) ? (
//               <DatePicker
//                 inputFormat="dd/MM/yyyy"
//                 value={
//                   actualFilters?.[column.key === "created_at" ? "from_date" : column.key] || null
//                 }
//                 onChange={(newValue) => {
//                   if (column.key === "created_at") {
//                     setCurrentFilters?.((prev) => ({
//                       ...prev,
//                       from_date: newValue,
//                       to_date: newValue,
//                       page_number: 1,
//                       no_of_records: 10,
//                     }));
//                     setActualFilters?.((prev) => ({
//                       ...prev,
//                       from_date: formatDate(newValue as string),
//                       to_date: formatDate(newValue as string),
//                       page_number: 1,
//                       no_of_records: 10,
//                     }));
//                   } else {
//                     setCurrentFilters?.((prev) => ({
//                       ...prev,
//                       [column.key]: newValue,
//                       page_number: 1,
//                       no_of_records: 10,
//                     }));
//                     setActualFilters?.((prev) => ({
//                       ...prev,
//                       [column.key]: formatDate(newValue as string),
//                       page_number: 1,
//                       no_of_records: 10,
//                     }));
//                   }
//                 }}
//                 renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
//                   <StyledTextField
//                     fullWidth
//                     onKeyDown={(e) => e.preventDefault()}
//                     {...params}
//                   />
//                 )}
//               />
//             ) : (
//               <StyledTextField
//                 sx={{ input: { py: 1, px: 0 } }}
//                 name={column.key}
//                 value={currentFilters?.[column.key] || ""}
//                 onChange={(e) => {
//                   setCurrentFilters?.((prev) => ({
//                     ...prev,
//                     [column.key]: e.target.value,
//                   }));
//                 }}
//                 onKeyUp={(e) => {
//                   if (e.key === "Enter" && currentFilters && currentFilters?.[column.key]) {
//                     setActualFilters?.(trimObject(currentFilters) as any);
//                   }
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment
//                       position="start"
//                       sx={{
//                         "&:hover": {
//                           cursor: "pointer",
//                         },
//                       }}
//                     >
//                       <Search fontSize="small" />
//                     </InputAdornment>
//                   ),
//                   endAdornment: currentFilters?.[column.key] && (
//                     <InputAdornment
//                       position="end"
//                       sx={{
//                         "&:hover": {
//                           cursor: "pointer",
//                         },
//                       }}
//                     >
//                       <IconButton
//                         sx={{ px: 0 }}
//                         onClick={() => {
//                           setCurrentFilters?.((prev) => ({
//                             ...prev,
//                             [column.key]: "",
//                           }));
//                           setActualFilters?.((prev) => ({
//                             ...prev,
//                             [column.key]: "",
//                           }));
//                         }}
//                       >
//                         <CloseSharp fontSize="small" />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           </>
//         )}
//       </Stack>
//     </TableCell>
//   );
// };


import { CandlestickChart, CloseSharp, Search } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TableCell,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { formatDate } from "@utils/formatDate";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import trimObject from "@utils/trimObject";
import React from "react";

import { useConfig } from "../hooks/config";
import { getStickyStyles } from "../utils/get-sticky-styles";
import { handleStickiness } from "../utils/handleStickyness";
import { useSelector } from "react-redux";
import { RootState } from "store";

const StyledTextField = styled(TextField)(({ theme }) => ({
  input: { py: 1 },
  "& .MuiInputBase-root": {
    height: "40px",
  },
  "& .MuiInputAdornment-root": {
    marginLeft: "-10px",
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: "unset",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    borderTop: "1px solid",
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "&.MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: "unset",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    borderTop: "1px solid",
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&.Mui-focused.MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
}));

interface Props<T> {
  column: {
    key: string;
    RenderHeadCell?: React.FC;
  };
  dates?: string[];
  filterDropdowns?: string[];
  currentFilters: T;
  setCurrentFilters: React.Dispatch<React.SetStateAction<T>>;
  actualFilters: T;
  setActualFilters: React.Dispatch<React.SetStateAction<T>>;
  valueMap?: Record<string, Record<string, unknown>>;
  labelMap?: Record<string, string>;
  fontSize?: number;
  hideFilters?: boolean;
}

export const TableColumnCell = <T extends Record<string, any>>({
  column,
  currentFilters,
  dates,
  filterDropdowns,
  actualFilters,
  setCurrentFilters,
  setActualFilters,
  valueMap,
  hideFilters,
  labelMap,
}: Props<T>) => {
  const { config, setConfig } = useConfig();

  const frozenKeys = config.frozenKeys;
  const maxStickyColumns = config.maxStickyColumns;

  const [anchorElSticky, setAnchorElSticky] = React.useState<null | HTMLElement>(null);
  const [stickyColumnKey, setStickyColumnKey] = React.useState<string>("");

  const loginmf = useSelector((state: RootState) => state.auth.login);

  const handleCloseSticky = () => {
    setAnchorElSticky(null);
  };
  const openSticky = Boolean(anchorElSticky);

  // Check if current column should show dropdown filter
  const shouldShowDropdownFilter = () => {
    if (!filterDropdowns?.some((col) => col === column?.key)) {
      return false;
    }
    
    // If column is product_code, only show for super_admin
    if (column?.key === 'product_code') {
      return loginmf?.data?.admin_type === 'super_admin' || loginmf?.data?.admin_type === 'kra' || loginmf?.data?.admin_type === 'backoffice'
    }
    
    // For other columns, show normally
    return true;
  };

  // Check if product_code column for multiple selection
  const isProductCodeColumn = column?.key === 'product_code';

  // Get current value for the select
  const getCurrentSelectValue = () => {
    if (isProductCodeColumn) {
      const value = currentFilters?.[column?.key];
      return value ? (Array.isArray(value) ? value : [value]) : [];
    }
    return currentFilters?.[column?.key] ?? "all";
  };

  // Create options array for product_code
  const getProductCodeOptions = () => {
    const options = Object.entries(valueMap?.[column?.key] || {}).map(([key, value]) => ({
      value: valueMap?.[column?.key]?.[value as any] as string,
      label: valueMap?.[column?.key]?.[key] as string
    }));
    return options;
  };

  if (!column) return null;

  return (
    <TableCell
      data-column-key={column.key}
      sx={{ p: 0, minWidth: "150px", ...getStickyStyles(column?.key, frozenKeys) }}
    >
      <Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ px: 2, py: 1, whiteSpace: "nowrap" }}>
            {labelMap?.[column.key] || kebabToCapitalize(column?.key)}
          </Typography>
          {!column.RenderHeadCell && (
            <IconButton
              sx={{ left: 0 }}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorElSticky(event.currentTarget);
                setStickyColumnKey(column.key);
              }}
            >
              <CandlestickChart />
            </IconButton>
          )}
        </Box>
        {!hideFilters && (
          <>
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
              <Box sx={{ display: "flex", flexDirection: "column", px: 2 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Sticky</Typography>
                <RadioGroup
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 1,
                    "& .MuiFormControlLabel-root": {
                      m: 0,
                    },
                    "& .MuiButtonBase-root ": {
                      pl: 0,
                    },
                  }}
                >
                  <FormControlLabel
                    checked={frozenKeys.some((f) => f.key === column.key && f.pos === "left")}
                    onChange={() =>
                      handleStickiness(
                        stickyColumnKey,
                        "left",
                        frozenKeys,
                        setConfig,
                        maxStickyColumns
                      )
                    }
                    control={<Radio />}
                    label="Left"
                    onClick={handleCloseSticky}
                    disabled={
                      config.maxStickyColumns.left ===
                      frozenKeys.filter((f) => f.pos === "left").length
                    }
                  />
                  <FormControlLabel
                    checked={frozenKeys.some((f) => f.key === column.key && f.pos === "right")}
                    control={<Radio />}
                    label="Right"
                    onClick={handleCloseSticky}
                    onChange={() =>
                      handleStickiness(
                        stickyColumnKey,
                        "right",
                        frozenKeys,
                        setConfig,
                        maxStickyColumns
                      )
                    }
                    disabled={
                      config.maxStickyColumns.right ===
                      frozenKeys.filter((f) => f.pos === "right").length
                    }
                  />
                  <FormControlLabel
                    checked={!frozenKeys.some((f) => f.key === column.key)}
                    control={<Radio />}
                    label="None"
                    onClick={handleCloseSticky}
                    onChange={() =>
                      handleStickiness(
                        stickyColumnKey,
                        "none",
                        frozenKeys,
                        setConfig,
                        maxStickyColumns
                      )
                    }
                  />
                </RadioGroup>
              </Box>
            </Menu>
            {column.RenderHeadCell ? (
              <>
                <column.RenderHeadCell />
              </>
            ) : shouldShowDropdownFilter() ? (
              <StyledSelect
                fullWidth
                sx={{ height: 40 }}
                multiple={isProductCodeColumn}
                defaultValue={isProductCodeColumn ? [] : "all"}
                value={getCurrentSelectValue()}
                onChange={(e) => {
                  if (isProductCodeColumn) {
                    const value = e.target.value as string[];
                    const finalValue = value.length === 0 ? undefined : value;

                    setCurrentFilters?.((prev: any) => ({
                      ...prev,
                      [column?.key]: finalValue,
                      page_number: 1,
                      current_page: 1,
                      offset: 0,
                    }));

                    setActualFilters?.((prev) => ({
                      ...prev,
                      [column?.key]: finalValue,
                      page_number: 1,
                      current_page: 1,
                      offset: 0,
                    }));
                  } else {
                    const value = e.target.value === "all" ? undefined : e.target.value;

                    setCurrentFilters?.((prev: any) => ({
                      ...prev,
                      [column?.key]: value,
                      page_number: 1,
                      current_page: 1,
                      offset: 0,
                    }));

                    setActualFilters?.((prev) => ({
                      ...prev,
                      [column?.key]: value,
                      page_number: 1,
                      current_page: 1,
                      offset: 0,
                    }));
                  }
                }}
                renderValue={isProductCodeColumn ? (selected) => {
                  const selectedArray = selected as string[];
                  if (selectedArray.length === 0) {
                    return <Typography variant="body2" color="text.secondary">Select Product Codes</Typography>;
                  }
                  if (selectedArray.length === 1) {
                    const label = getProductCodeOptions().find(option => option.value === selectedArray[0])?.label || selectedArray[0];
                    return <Typography variant="body2">{label}</Typography>;
                  }
                  
                  // Show chips for multiple selections
                  const maxVisible = 2;
                  const visibleItems = selectedArray.slice(0, maxVisible);
                  const remainingCount = selectedArray.length - maxVisible;
                  
                  const getAllSelectedLabels = () => {
                    return selectedArray.map(value => 
                      getProductCodeOptions().find(option => option.value === value)?.label || value
                    ).join(', ');
                  };

                  return (
                    <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 0.5, alignItems: "center", maxWidth: "100%" }}>
                      {visibleItems.map((value) => (
                        <Chip
                          key={value}
                          label={getProductCodeOptions().find((option) => option.value === value)?.label || value}
                          size="small"
                          sx={{ 
                            maxWidth: "80px", 
                            "& .MuiChip-label": { 
                              overflow: "hidden", 
                              textOverflow: "ellipsis" 
                            } 
                          }}
                        />
                      ))}
                      {remainingCount > 0 && (
                        <Tooltip title={getAllSelectedLabels()} arrow>
                          <Chip
                            label={`+${remainingCount} more`}
                            size="small"
                            variant="outlined"
                            sx={{ cursor: "pointer" }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  );
                } : undefined}
              >
                {isProductCodeColumn && (
                  <>
                    <MenuItem 
                      value="select_all" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const allValues = Object.entries(valueMap?.[column?.key] || {}).map(([key, value]) => 
                          valueMap?.[column?.key]?.[value as any] as string
                        );
                        
                        setCurrentFilters?.((prev: any) => ({
                          ...prev,
                          [column?.key]: allValues,
                          page_number: 1,
                          current_page: 1,
                          offset: 0,
                        }));

                        setActualFilters?.((prev) => ({
                          ...prev,
                          [column?.key]: allValues,
                          page_number: 1,
                          current_page: 1,
                          offset: 0,
                        }));
                        
                        // Close the select dropdown
                        setTimeout(() => {
                          const selectElement = document.activeElement as HTMLElement;
                          selectElement?.blur();
                        }, 100);
                      }}
                      sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                      Select All
                    </MenuItem>
                    <MenuItem 
                      value="clear_all" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentFilters?.((prev: any) => ({
                          ...prev,
                          [column?.key]: [],
                          page_number: 1,
                          current_page: 1,
                          offset: 0,
                        }));

                        setActualFilters?.((prev) => ({
                          ...prev,
                          [column?.key]: [],
                          page_number: 1,
                          current_page: 1,
                          offset: 0,
                        }));
                        
                        // Close the select dropdown
                        setTimeout(() => {
                          const selectElement = document.activeElement as HTMLElement;
                          selectElement?.blur();
                        }, 100);
                      }}
                      sx={{ fontWeight: 'bold', color: 'error.main' }}
                    >
                      Clear All
                    </MenuItem>
                    <MenuItem disabled sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
                      ──────────────
                    </MenuItem>
                  </>
                )}
                {!isProductCodeColumn && <MenuItem value="all">All</MenuItem>}
                {Object.entries(valueMap?.[column?.key] || {}).map(([key, value]) => (
                  <MenuItem key={key} value={valueMap?.[column?.key]?.[value as any] as string}>
                    {valueMap?.[column?.key]?.[key] as string}
                  </MenuItem>
                ))}
              </StyledSelect>
            ) : dates?.includes(column?.key) ? (
              <DatePicker
                inputFormat="dd/MM/yyyy"
                value={
                  actualFilters?.[column.key === "created_at" ? "from_date" : column.key] || null
                }
                onChange={(newValue) => {
                  if (column.key === "created_at") {
                    setCurrentFilters?.((prev) => ({
                      ...prev,
                      from_date: newValue,
                      to_date: newValue,
                      page_number: 1,
                      no_of_records: 10,
                    }));
                    setActualFilters?.((prev) => ({
                      ...prev,
                      from_date: formatDate(newValue as string),
                      to_date: formatDate(newValue as string),
                      page_number: 1,
                      no_of_records: 10,
                    }));
                  } else {
                    setCurrentFilters?.((prev) => ({
                      ...prev,
                      [column.key]: newValue,
                      page_number: 1,
                      no_of_records: 10,
                    }));
                    setActualFilters?.((prev) => ({
                      ...prev,
                      [column.key]: formatDate(newValue as string),
                      page_number: 1,
                      no_of_records: 10,
                    }));
                  }
                }}
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                  <StyledTextField
                    fullWidth
                    onKeyDown={(e) => e.preventDefault()}
                    {...params}
                  />
                )}
              />
            ) : (
              <StyledTextField
                sx={{ input: { py: 1, px: 0 } }}
                name={column.key}
                value={currentFilters?.[column.key] || ""}
                onChange={(e) => {
                  setCurrentFilters?.((prev) => ({
                    ...prev,
                    [column.key]: e.target.value,
                  }));
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && currentFilters && currentFilters?.[column.key]) {
                    setActualFilters?.(trimObject(currentFilters) as any);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: currentFilters?.[column.key] && (
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
                          setCurrentFilters?.((prev) => ({
                            ...prev,
                            [column.key]: "",
                          }));
                          setActualFilters?.((prev) => ({
                            ...prev,
                            [column.key]: "",
                          }));
                        }}
                      >
                        <CloseSharp fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </>
        )}
      </Stack>
    </TableCell>
  );
};
