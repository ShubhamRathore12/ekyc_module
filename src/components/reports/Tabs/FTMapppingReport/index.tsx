import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { DownloadOutlined } from "@mui/icons-material";
import { Button, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { convertToReadableFormat } from "@utils/convertToReadableFormat";
import { formatDate } from "@utils/formatDate";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import { useGetFTMappingReportsQuery } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  GetFTMappingReportsRequest,
  GetFTMappingReportsResponse,
  KYCStatus,
  MappingReport,
  PromoCode,
  Scheme,
  orderedFTMapping,
} from "types/ekyc";
import { ApplicationStatus, ReportsTab } from "types/reports";

const FTMappingReport = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GetFTMappingReportsRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] =
    React.useState<GetFTMappingReportsRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data, isError, isLoading } = useGetFTMappingReportsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.mapping_report, orderedFTMapping);

  const reorderedObj = reorderObject(data?.data?.mapping_report[0], orderedFTMapping);

  const isFilters = checkFilters(actualFilters, currentFilters);

  // React.useEffect(() => {
  //   if (data && !isFilters.actualFiltersApplied) {
  //     setMappingReports((prevData) => removeDuplicates(prevData, data?.data.mapping_report));
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 1) {
  //     setMappingReports(data?.data.mapping_report);
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages > 1) {
  //     setMappingReports((prevData) => {
  //       if (actualFilters.page_number === 1) {
  //         prevData = [];
  //       }
  //       return removeDuplicates(prevData, data?.data.mapping_report);
  //     });
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 0) {
  //     setMappingReports([]);
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
    MappingReport,
    "mapping_report",
    GetFTMappingReportsResponse,
    GetFTMappingReportsRequest
  >({
    data: data,
    keyname: "mapping_report",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
  });

  function handleSubmit() {
    if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
      const { from_date, to_date, ...rest } = currentFilters;
      setActualFilters(() => ({
        ...rest,
        ...(from_date &&
          to_date &&
          from_date !== "Invalid Date" &&
          to_date !== "Invalid Date" && {
            from_date: formatDate(from_date),
            to_date: formatDate(to_date),
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
              value={currentFilters.from_date || null}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => {
                if (newValue && newValue !== "Invalid Date")
                  setCurrentFilters((prev) => ({
                    ...prev,
                    from_date: newValue,
                  }));
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px" }}>To Date</Typography>
            <DatePicker
              value={currentFilters.to_date || null}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => {
                if (newValue && newValue !== "Invalid Date")
                  setCurrentFilters((prev) => ({
                    ...prev,
                    to_date: newValue,
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
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box>
          <DataTableV2
            totalPages={totalPages}
            columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
            dataTableOptions={{
              export: true,
              reportName: ReportsTab.FT_MAPPING_REPORT,
              fromDate: formatDate(currentFilters.from_date),
              toDate: formatDate(currentFilters.to_date),
            }}
            data={clientData || []}
            actualFilters={actualFilters}
            setActualFilters={setActualFilters}
            valueMap={{
              status: KYCStatus,
              application_type: ApplicationType,
              promo_code: PromoCode,
              scheme: Scheme,
              // referral_code: ReferralCode
              aoc_plan_type: AOCPlanType,
              app_status: ApplicationStatus,
            }}
            labelMap={{ client_id: "Client ID" }}
            dates={["updated_at", "created_at", "date_of_birth"]}
            id="client_id"
            copyFields={["client_id"]}
            hide={[
              "status",
              "nse_response",
              "rupeeseed_response",
              "rupeeseed_request",
              "rupeeseed_bank_request",
              "rupeeseed_bank_response",
            ]}
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
            isLoading={isLoading}
            isError={isError}
            setHitBottom={setHitBottom}
            currentFilters={currentFilters}
            setCurrentFilters={setCurrentFilters}
            initialColumns={initialColumns}
            customColumns={
              clientData?.length > 0
                ? [
                    {
                      position: "end",
                      label: "Rupeeseed Bank Request",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Tooltip
                            placement="top"
                            arrow
                            title={
                              <Typography variant="body2" textAlign="left">
                                <pre>{convertToReadableFormat(row.rupeeseed_bank_request)}</pre>
                              </Typography>
                            }
                          >
                            <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                              {row.rupeeseed_bank_request}
                            </Typography>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      position: "end",
                      label: "Rupeeseed Bank Response",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Tooltip
                            placement="top"
                            arrow
                            title={
                              <Typography variant="body2" textAlign="left">
                                <pre>{convertToReadableFormat(row.rupeeseed_bank_response)}</pre>
                              </Typography>
                            }
                          >
                            <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                              {row.rupeeseed_bank_response}
                            </Typography>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      position: "end",
                      label: "Nse Response",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Tooltip
                            placement="top"
                            arrow
                            title={
                              <Typography variant="body2" textAlign="left">
                                <pre>{convertToReadableFormat(row.nse_response)}</pre>
                              </Typography>
                            }
                          >
                            <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                              {row.nse_response}
                            </Typography>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      position: "end",
                      label: "Rupeeseed Request",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Tooltip
                            placement="top"
                            arrow
                            title={
                              <Typography variant="body2" textAlign="left">
                                <pre>{convertToReadableFormat(row.rupeeseed_request)}</pre>
                              </Typography>
                            }
                          >
                            <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                              {row.rupeeseed_request}
                            </Typography>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      position: "end",
                      label: "Rupeeseed Response",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Tooltip
                            placement="top"
                            arrow
                            title={
                              <Typography variant="body2" textAlign="left">
                                <pre>{convertToReadableFormat(row.rupeeseed_response)}</pre>
                              </Typography>
                            }
                          >
                            <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                              {row.rupeeseed_response}
                            </Typography>
                          </Tooltip>
                        );
                      },
                    },
                  ]
                : []
            }
            // fetching={isLoading}
          />
        </Box>
      </Box>
    </>
  );
};

export default FTMappingReport;
