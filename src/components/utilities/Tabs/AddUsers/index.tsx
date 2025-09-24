import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import TabHeader from "@components/utilities/layouts/TabHeader";
import UtlitiesLayout from "@components/utilities/layouts/UtlitiesLayout";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import BlockIcon from "@mui/icons-material/Block";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import { useGetAdminsQuery, useLazySearchAdminsQuery } from "services/admin.service";
import {
  AdminEntity,
  GetAdminRequest,
  GetAdminResponse,
  orderedAdminKeys,
  SearchAdminRequest,
} from "types/admin";
import BlockUserModal from "./BlockUserModal";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const AddUsers = () => {
  const { login } = useAuth();
  const username = login?.data?.username;

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string>("");

  const [triggerSearch, { data: searchData, isLoading: isSearching, error: searchApiError }] =
    useLazySearchAdminsQuery();

  const [currentFilters, setCurrentFilters] = React.useState<GetAdminRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GetAdminRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);


  const classifySearchQuery = (query: string): keyof SearchAdminRequest | null => {
  const trimmed = query.trim();

  if (!trimmed) return null;

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return "email";

  // Admin ID (e.g., UUID or long hyphenated string)
  const adminIdRegex = /^[\w-]{20,}$/;
  if (adminIdRegex.test(trimmed)) return "admin_id";

  // Phone Number (10 digits starting with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (phoneRegex.test(trimmed)) return "phone_number";

  

  // Name (letters and spaces, 2–3 words)
  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  if (nameRegex.test(trimmed)) return "name";

  // Username (alphanumeric + optional dots or underscores)
  const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;
  if (usernameRegex.test(trimmed)) return "username";

  return null;
};


  const { data, isError, isLoading } = useGetAdminsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  // Convert search data to array format if it's a single object
  const searchDataArray = React.useMemo(() => {
    if (!searchData?.data) return [];
    return Array.isArray(searchData.data) ? searchData.data : [searchData.data];
  }, [searchData]);

  // Use search data for columns when showing search results
  const dataForColumns = showSearchResults ? searchDataArray : data?.data.admin;
  const initialColumns = useInitialColumns(dataForColumns, orderedAdminKeys);
  const reorderedObj = reorderObject(
    showSearchResults ? searchDataArray?.[0] : data?.data?.admin[0],
    orderedAdminKeys
  );
  const isFilters = checkFilters(actualFilters, currentFilters);

  const { clientData } = useClientData<AdminEntity, "admin", GetAdminResponse, GetAdminRequest>({
    data: data,
    keyname: "admin",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term");
      return;
    }

    setSearchError("");
   const searchParams: SearchAdminRequest = {};
const field = classifySearchQuery(searchQuery);

if (field) {
  searchParams[field] = searchQuery.trim();
} else {
  setSearchError("Unrecognized input format. Try using username, email, phone, etc.");
  return;
}


    try {
      await triggerSearch(searchParams).unwrap();
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Search failed. Please try again.");
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setSearchError("");
    if (!value.trim()) {
      setShowSearchResults(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchError("");
  };

  return (
    <>
      <UtlitiesLayout>
        <TabHeader
          leftText="Add or Modify User"
          // leftContent={
          //   <Grid container spacing={2} alignItems="center">
          //     <Grid item xs={12} md={8}>
          //       <TextField
          //         fullWidth
          //         placeholder="Search by Admin ID, Username, Email, or Name"
          //         value={searchQuery}
          //         onChange={handleSearchInputChange}
          //         onKeyPress={handleKeyPress}
          //         error={!!searchError}
          //         helperText={searchError}
          //         InputProps={{
          //           startAdornment: (
          //             <InputAdornment position="start">
          //               <SearchIcon />
          //             </InputAdornment>
          //           ),
          //           endAdornment: searchQuery && (
          //             <InputAdornment position="end">
          //               <IconButton onClick={clearSearch} size="small">
          //                 <ClearIcon />
          //               </IconButton>
          //             </InputAdornment>
          //           ),
          //         }}
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={4}>
          //       <Button
          //         variant="contained"
          //         onClick={handleSearch}
          //         disabled={!searchQuery.trim() || isSearching}
          //         fullWidth
          //         startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
          //       >
          //         {isSearching ? "Searching..." : "Search"}
          //       </Button>
          //     </Grid>
          //   </Grid>
          // }
          rightButton1="Create New User"
        />
      </UtlitiesLayout>
      <Box sx={{ width: "100%", mt: 2 }}>
        <DataTableV2
          hideFilters={true}
          dataTableOptions={{ export: true }}
          reset={() => {
            setActualFilters({
              page_number: 1,
              no_of_records: 10,
            });
            setCurrentFilters({
              page_number: 1,
              no_of_records: 10,
            });
            setShowSearchResults(false);
            setSearchQuery("");
          }}
          initialColumns={initialColumns}
          isError={showSearchResults ? !!searchApiError : isError}
          isLoading={showSearchResults ? isSearching : isLoading}
          totalPages={showSearchResults ? 1 : totalPages}
          columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
          data={showSearchResults ? searchDataArray : clientData || []}
          actualFilters={actualFilters}
          setActualFilters={setActualFilters}
          valueMap={{
            is_blocked: {
              true: "✅",
              false: "❌",
            },
          }}
          labelMap={{ admin_id: "Admin Id" }}
          dates={["updated_at", "created_at", "date_of_birth"]}
          id="admin_id"
          copyFields={["email", "username"]}
          hide={[]}
          setHitBottom={setHitBottom}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          customColumns={[
            {
              position: "end",
              label: "Block",
              RenderHeadCell: () => {
                return <></>;
              },
              RenderBodyCell({ row }) {
                const [blockUserModalopen, setBlockUserModalOpen] = React.useState(false);
                const handleBlockUserModalOpen = () => setBlockUserModalOpen(true);
                const handleBlockUserModalClose = () => setBlockUserModalOpen(false);
                return (
                  <>
                    <Button
                      sx={{
                        width: "110px",
                        bgcolor: row?.is_blocked ? "info.main" : "primary.main",
                        "&:hover": {
                          bgcolor: row?.is_blocked ? "info.main" : "primary.main ",
                        },
                      }}
                      startIcon={
                        username === row?.username ? (
                          <></>
                        ) : row.is_blocked ? (
                          <RemoveCircleOutlineIcon />
                        ) : (
                          <BlockIcon />
                        )
                      }
                      variant="contained"
                      onClick={handleBlockUserModalOpen}
                      disabled={username === row?.username}
                    >
                      {username === row?.username ? "NA" : row?.is_blocked ? "Unblock" : "Block"}
                    </Button>
                    <BlockUserModal
                      open={blockUserModalopen}
                      handleClose={handleBlockUserModalClose}
                      row={row as AdminEntity}
                      reload={() => {
                        setActualFilters((prev) => ({ ...prev, page_number: 1 }));
                        setShowSearchResults(false);
                      }}
                    />
                  </>
                );
              },
            },
          ]}
        />
      </Box>
    </>
  );
};

export default AddUsers;
