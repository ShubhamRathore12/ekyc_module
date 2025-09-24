import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate } from "@utils/formatDate";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import { useGetDPIdDetailsQuery } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  DPIDDetail,
  GetDPIdDetailsRequest,
  GetDPIdDetailsResponse,
  KYCStatus,
  PromoCode,
  ReferralCode,
  Scheme,
  orderedDPIdDetails,
} from "types/ekyc";
import { ApplicationStatus, ReportsTab } from "types/reports";

const DPIdDetails = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GetDPIdDetailsRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GetDPIdDetailsRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data, isError, isLoading } = useGetDPIdDetailsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.dp_id_detail, orderedDPIdDetails);

  const reorderedObj = reorderObject(data?.data?.dp_id_detail[0], orderedDPIdDetails);

  const isFilters = checkFilters(actualFilters, currentFilters);

  // React.useEffect(() => {
  //   if (data && !isFilters.actualFiltersApplied) {
  //     setDpIdDetails((prevData) => removeDuplicates(prevData, data?.data.dp_id_detail));
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 1) {
  //     setDpIdDetails(data?.data.dp_id_detail);
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages > 1) {
  //     setDpIdDetails((prevData) => {
  //       if (actualFilters.page_number === 1) {
  //         prevData = [];
  //       }
  //       return removeDuplicates(prevData, data?.data.dp_id_detail);
  //     });
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 0) {
  //     setDpIdDetails([]);
  //   }
  // }, [data]);

  // React.useEffect(() => {
  //   if (hitBottom && actualFilters.page_number < totalPages) {
  //     setActualFilters((prev) => ({
  //       ...prev,
  //       page_number: prev.page_number + 1,
  //     }));
  //   }
  // }, [hitBottom]);

  const { clientData } = useClientData<
    DPIDDetail,
    "dp_id_detail",
    GetDPIdDetailsResponse,
    GetDPIdDetailsRequest
  >({
    data: data,
    keyname: "dp_id_detail",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
  });

  function handleSubmit() {
    if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
      const { from_date, from_created_date, to_created_date, to_date, ...rest } = currentFilters;
      setActualFilters(() => ({
        ...rest,
        ...(from_date &&
          to_date &&
          from_date !== "Invalid Date" &&
          to_date !== "Invalid Date" && {
            from_date: formatDate(from_date),
            to_date: formatDate(to_date),
          }),
        ...(from_created_date &&
          to_created_date &&
          from_created_date !== "Invalid Date" &&
          to_created_date !== "Invalid Date" && {
            from_created_date: formatDate(from_created_date),
            to_created_date: formatDate(to_created_date),
          }),
        page_number: 1,
      }));
    }
  }

  return (
    <>
      <Box sx={{ bgcolor: "#FFFF", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">DP Id Details</Typography>
          {/* <IconButton onClick={() => exportToExcelSheet(rows, "UCC Reports", "UCC Reports")}>
            <UploadIcon />
          </IconButton> */}
        </Box>
        <Box
          sx={{
            // width: { xs: "100%", md: "60%" },
            display: "flex",
            gap: 3,
            alignItems: "center",
            flexWrap: { xs: "wrap", xl: "nowrap" },
            pt: 2,
          }}
        >
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px" }}>From Date</Typography>
            <DatePicker
              value={currentFilters.from_created_date || null}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => {
                if (newValue && newValue !== "Invalid Date")
                  setCurrentFilters((prev) => ({
                    ...prev,
                    from_created_date: newValue,
                  }));
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px" }}>To Date</Typography>
            <DatePicker
              value={currentFilters.to_created_date || null}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => {
                if (newValue && newValue !== "Invalid Date")
                  setCurrentFilters((prev) => ({
                    ...prev,
                    to_created_date: newValue,
                  }));
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Stack>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Search
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              if (isFilters.actualFiltersApplied) {
                setCurrentFilters({
                  page_number: 1,
                  no_of_records: 10,
                });
                setActualFilters({
                  page_number: 1,
                  no_of_records: 10,
                });
              }
            }}
          >
            Reset Filters
          </Button>
          {/* <Input name="to_date" type="date" label="To Date" /> */}
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box>
          <DataTableV2
            isError={isError}
            isLoading={isLoading}
            totalPages={totalPages}
            columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
            data={clientData || []}
            actualFilters={actualFilters}
            setActualFilters={setActualFilters}
            valueMap={{
              kyc_status: KYCStatus,
              application_type: ApplicationType,
              promo_code: PromoCode,
              scheme: Scheme,
              referral_code: ReferralCode,
              aoc_plan_type: AOCPlanType,
              status: ApplicationStatus,
            }}
            labelMap={{ client_id: "Client ID" }}
            dates={["updated_at", "created_at"]}
            copyFields={["client_id", "dp_id", "pan_number"]}
            id="dp_id"
            hide={[]}
            reset={() => {
              setActualFilters({
                page_number: 1,
                no_of_records: 10,
              });
              setCurrentFilters({
                page_number: 1,
                no_of_records: 10,
              });
            }}
            currentFilters={currentFilters as unknown as any}
            setCurrentFilters={setCurrentFilters as unknown as any}
            initialColumns={initialColumns}
            dataTableOptions={{
              export: true,
              reportName: ReportsTab.DP_ID_DETAILS,
              fromDate: formatDate(currentFilters.from_created_date),
              toDate: formatDate(currentFilters.to_created_date),
            }}
            setHitBottom={setHitBottom}
          />
        </Box>
      </Box>
    </>
  );
};

export default DPIdDetails;
