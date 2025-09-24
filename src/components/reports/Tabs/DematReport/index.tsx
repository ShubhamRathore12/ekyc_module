import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { DownloadOutlined } from "@mui/icons-material";
import { Button, Tooltip, Typography, CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate } from "@utils/formatDate";
import { formatXml } from "@utils/formatXML";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { useGetDematDetailsQuery, useSendToNsdlMutation } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  NsdlDetail,
  GetCvlkraRequest,
  GetCvlkraResponse,
  KYCStatus,
  PromoCode,
  ReferralCode,
  Scheme,
  orderCvlkraKeys,
  GetDematResponse,
} from "types/ekyc";
import { ReportsTab } from "types/reports";
import toast from "react-hot-toast";
import handleError from "@utils/handleError";
import { useSelector } from "react-redux";

const initialFilters: Record<keyof GetCvlkraRequest, any> = {
  from_date: null,
  is_record_send_to_kra: undefined,
  no_of_records: 10,
  page_number: 1,
  pan_number: "",
  to_date: null,
};

const DEMATReports = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GetCvlkraRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GetCvlkraRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data, isError, isLoading } = useGetDematDetailsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );
  const updatedRequest = useSelector(
    (state: { app: { updatedReportRequest: any } }) => state.app.updatedReportRequest
  );

  const [sendToNSDL] = useSendToNsdlMutation();
  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.nsdl_details, orderCvlkraKeys);

  const reorderedObj = reorderObject(data?.data?.nsdl_details[0], orderCvlkraKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  // React.useEffect(() => {
  //   if (data && !isFilters.actualFiltersApplied) {
  //     setCvlkraDetails((prevData) => removeDuplicates(prevData, data?.data.cvlkra_details));
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 1) {
  //     setCvlkraDetails(data?.data.cvlkra_details);
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages > 1) {
  //     setCvlkraDetails((prevData) => {
  //       if (actualFilters.page_number === 1) {
  //         prevData = [];
  //       }
  //       return removeDuplicates(prevData, data?.data.cvlkra_details);
  //     });
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 0) {
  //     setCvlkraDetails([]);
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
    NsdlDetail,
    "nsdl_details",
    GetDematResponse,
    GetCvlkraRequest
  >({
    data: data,
    keyname: "nsdl_details",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
  });

  const updatedClientData = clientData?.map((row) => {
    // Find the updated request for this client_id
    const updatedRow = updatedRequest?.find((item: any) => item.clientId === row.client_id);

    return updatedRow
      ? { ...row, request: updatedRow.request } // Update the request field
      : row; // Keep row unchanged if no match found
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">DEMAT Report</Typography>
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
          {/* <Input name="to_date" type="date" label="To Date" /> */}
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box>
          <DataTableV2
            totalPages={totalPages}
            columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
            data={updatedClientData || []}
            // data={clientData || []}
            actualFilters={actualFilters}
            setActualFilters={setActualFilters}
            valueMap={{
              kyc_status: KYCStatus,
              application_type: ApplicationType,
              promo_code: PromoCode,
              scheme: Scheme,
              referral_code: ReferralCode,
              aoc_plan_type: AOCPlanType,
            }}
            labelMap={{ client_id: "Client ID" }}
            dates={["updated_at", "created_at", "date_of_birth"]}
            id="client_id"
            copyFields={["client_id", "pan_number", "request", "response"]}
            editableColumns={login?.data?.admin_type === "super_admin" ? ["request"] : []}
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
            currentFilters={currentFilters}
            setCurrentFilters={setCurrentFilters}
            initialColumns={initialColumns}
            dataTableOptions={{
              export: true,
              reportName: ReportsTab.DEMAT_REPORT,
              fromDate: formatDate(currentFilters.from_date),
              toDate: formatDate(currentFilters.to_date),
            }}
            setHitBottom={setHitBottom}
            customColumns={
              clientData?.length > 0
                ? [
                    // {
                    //   position: "end",
                    //   label: "Request",
                    //   RenderHeadCell: () => {
                    //     return <div></div>;
                    //   },
                    //   RenderBodyCell({ row }) {
                    //     if (row === null) return <DownloadOutlined />;
                    //     return (
                    //       <Tooltip
                    //         placement="top"
                    //         arrow
                    //         title={
                    //           <Typography variant="body2" textAlign="left">
                    //             {formatXml(row.request)}
                    //           </Typography>
                    //         }
                    //       >
                    //         <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                    //           {row.request}
                    //         </Typography>
                    //       </Tooltip>
                    //     );
                    //   },
                    // },
                    // {
                    //   position: "end",
                    //   label: "Response",
                    //   RenderHeadCell: () => {
                    //     return <div></div>;
                    //   },
                    //   RenderBodyCell({ row }) {
                    //     if (row === null) return <DownloadOutlined />;
                    //     return (
                    //       <Tooltip
                    //         placement="top"
                    //         arrow
                    //         title={
                    //           <Typography variant="body2" textAlign="left">
                    //             {formatXml(row.response)}
                    //           </Typography>
                    //         }
                    //       >
                    //         <Typography sx={{ width: "500px" }} variant="body2" noWrap>
                    //           {row.response}
                    //         </Typography>
                    //       </Tooltip>
                    //     );
                    //   },
                    // },
                    ...(login?.data?.admin_type === "super_admin"
                      ? [
                          {
                            position: "end" as "start" | "end",
                            label: "Send to NSDL",
                            RenderHeadCell: () => {
                              return <div></div>;
                            },
                            RenderBodyCell({ row }: any) {
                              const [isSending, setIsSending] = React.useState<boolean>(false);
                              const record = updatedRequest?.filter(
                                (item: any) => item?.clientId === row?.client_id
                              );
                              if (row === null) return <SendIcon />;
                              return (
                                <Button
                                  disabled={!record?.length}
                                  fullWidth
                                  startIcon={<SendIcon />}
                                  component="text"
                                  sx={{ color: "primary.main" }}
                                  onClick={async () => {
                                    const record = updatedRequest?.filter(
                                      (item: any) => item?.clientId === row?.client_id
                                    );
                                    setIsSending(true);
                                    try {
                                      const res = await sendToNSDL({
                                        client_id: row?.client_id,
                                        nsdl_request: record[0]?.request,
                                      }).unwrap();
                                      const data = res.message;
                                      toast.success(data);
                                    } catch (error) {
                                      handleError(error);
                                    } finally {
                                      setIsSending(false);
                                    }
                                  }}
                                >
                                  {isSending ? <CircularProgress /> : "Send"}
                                </Button>
                              );
                            },
                          },
                        ]
                      : []),
                  ]
                : []
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default DEMATReports;
