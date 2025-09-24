import DataTableV2 from "@components/lib/DataTableV2";

import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { DownloadOutlined } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { Button, CircularProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { downloadFiles } from "@utils/downloadFiles";
import { formatDate } from "@utils/formatDate";
import handleError from "@utils/handleError";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import { toast } from "react-hot-toast";
import {
  useGetUCCReportsQuery,
  useSendToBackOfficeMutation,
  useGetSTXProductsQuery,
} from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  GetUCCReportsRequest,
  GetUCCReportsResponse,
  KYCStatus,
  NomineeUploadStatus,
  ReferralCode,
  Scheme,
  UCCReports,
  orderedUCCKeys,
  STXProductDetail,
} from "types/ekyc";
import { ReportsTab } from "types/reports";
import { useSelector } from "react-redux";
import { RootState } from "store";

const initialFilters: Record<keyof GetUCCReportsRequest, any> = {
  applicant_name: "",
  dp_id: "",
  from_date: null,
  no_of_records: 10,
  page_number: 1,
  pan_number: "",
  referral_code: "",
  to_date: null,
  ucc_code: "",
  verifier: undefined,
};

const ProductOptions = {
  "Sub KRA": "Sub KRA",
  SUBKRA: "SUBKRA",
  EQUITY: "Equity",
  MF: "Mutual Fund",
  MFCK: "MF Check",
};

const UCCReport = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GetUCCReportsRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GetUCCReportsRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const [sendToBackOffice] = useSendToBackOfficeMutation();


  const { data: stxProductsData, isLoading: stxProductsLoading,refetch } = useGetSTXProductsQuery();

  React.useEffect(() => {
 
  refetch();
}, [refetch]);

  const { data, isError, isLoading } = useGetUCCReportsQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.ekycs, orderedUCCKeys);

  const reorderedObj = reorderObject(data?.data?.ekycs[0], orderedUCCKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  const loginmf = useSelector((state: RootState) => state.auth.login);


  // Create product options map from STX API response
  const productOptionsMap = React.useMemo(() => {
    if (!stxProductsData?.data?.product_details) {
      return {};
    }

    const options: Record<string, string> = {};
    stxProductsData.data.product_details.forEach((product: STXProductDetail) => {
      options[product.product_code] = product.product_code;
    });
    return options;
  }, [stxProductsData]);

  const { clientData } = useClientData<
    UCCReports,
    "ekycs",
    GetUCCReportsResponse,
    GetUCCReportsRequest
  >({
    data: data,
    keyname: "ekycs",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "client_id",
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
          <Typography variant="h5">UCC Report</Typography>
          {/* <IconButton onClick={() => exportToExcelSheet(rows, "UCC Reports", "UCC Reports")}>
            <UploadIcon />
          </IconButton> */}
        </Box>
        <Box
          sx={{
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
            data={clientData || []}
            actualFilters={actualFilters}
            filterDropdowns={[  "product_code"]}
            setActualFilters={setActualFilters}
            valueMap={{
              kyc_status: KYCStatus,
              application_type: ApplicationType,
              scheme: Scheme,
              referral_code: ReferralCode,
              aoc_plan_type: AOCPlanType,
              nominee_upload: NomineeUploadStatus,
              product_code: productOptionsMap,
            }}
            labelMap={{ client_id: "Client ID" }}
            dates={[
              "updated_at",
              "created_at",
              "date_of_birth",
              "esigned_at",
              "sent_to_backoffice_at",
              "send_to_easy_invest_at",
            ]}
            id="client_id"
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
            currentFilters={currentFilters}
            setCurrentFilters={setCurrentFilters}
            initialColumns={initialColumns}
            isLoading={isLoading}
            isError={isError}
            dataTableOptions={{
              export: login?.data?.admin_type === "super_admin",
              reportName: ReportsTab.UCC_REPORT,
              fromDate: formatDate(currentFilters.from_date),
              toDate: formatDate(currentFilters.to_date),
            }}
            copyFields={["pan_number", "esigned_pdf_url"]}
            setHitBottom={setHitBottom}
            customColumns={
              clientData?.length > 0
                ? [
                    {
                      position: "start",
                      label: "Download All Documents",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        else if (
                          (row.verified_by === "KRA Verified" && row?.product_code === "MFCK") ||
                          row?.product_code === "SUBKRA" ||
                          row?.product_code === "STXKRA" ||
                          row?.product_code == "MFDK"
                        )
                          return null;
                        return (
                          <Button
                            startIcon={<DownloadOutlined />}
                            component="text"
                            sx={{ color: "primary.main" }}
                            onClick={async () => {
                              await downloadFiles([
                                row?.esigned_pdf_url,
                                row?.kra_pdf_url,
                                row?.media_xml_url,
                                row?.ddpi_pdf_url,
                              ]);
                            }}
                          >
                            Download here
                          </Button>
                        );
                      },
                    },
                    {
                      position: "start",
                      label: "Download AOF",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Button
                            disabled={row?.esigned_pdf_url.length === 0}
                            startIcon={<DownloadOutlined />}
                            component="text"
                            sx={{ color: "primary.main" }}
                            onClick={() => window.open(row?.esigned_pdf_url)}
                          >
                            AOF PDF
                          </Button>
                        );
                      },
                    },
                    {
                      position: "start",
                      label: "Download KRA",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Button
                            disabled={row?.kra_pdf_url.length === 0}
                            startIcon={<DownloadOutlined />}
                            component="text"
                            sx={{ color: "primary.main" }}
                            onClick={() => window.open(row?.kra_pdf_url)}
                          >
                            KRA PDF
                          </Button>
                        );
                      },
                    },
                    {
                      position: "start",
                      label: "Download Digio",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Button
                            disabled={row?.media_xml_url.length === 0}
                            startIcon={<DownloadOutlined />}
                            component="text"
                            sx={{ color: "primary.main" }}
                            onClick={() => window.open(row?.media_xml_url)}
                          >
                            Digio XML
                          </Button>
                        );
                      },
                    },
                    {
                      position: "start",
                      label: "Download DDPI",
                      RenderHeadCell: () => {
                        return <div></div>;
                      },
                      RenderBodyCell({ row }) {
                        if (row === null) return <DownloadOutlined />;
                        return (
                          <Button
                            disabled={row?.ddpi_pdf_url.length === 0}
                            startIcon={<DownloadOutlined />}
                            component="text"
                            sx={{ color: "primary.main" }}
                            onClick={() => window.open(row?.ddpi_pdf_url)}
                          >
                            DDPI PDF
                          </Button>
                        );
                      },
                    },
                    ...(login?.data?.admin_type === "grootsupport" ||
                    login?.data?.admin_type === "lms_user"
                      ? []
                      : [
                          {
                            position: "end" as "start" | "end",
                            label: "Send to back office",
                            RenderHeadCell: () => {
                              return <div></div>;
                            },
                            RenderBodyCell({ row }: any) {
                              const [isSending, setIsSending] = React.useState<boolean>(false);
                              if (
                                row === null ||
                                row?.product_code?.toLowerCase()?.includes("mf") ||
                                row?.product_code === "SUBNKRA" ||
                                row?.product_code === "SUBKRA" ||
                                row?.product_code === "MFCK" ||
                                row?.product_code === "STXNKRA" ||
                                row?.product_code === "STXKRA"
                              )
                                return null;
                              // if (row === null) return <SendIcon />;
                              return (
                                <Button
                                  disabled={isSending}
                                  fullWidth
                                  startIcon={<SendIcon />}
                                  component="text"
                                  sx={{ color: "primary.main" }}
                                  onClick={async () => {
                                    setIsSending(true);
                                    try {
                                      const res = await sendToBackOffice({
                                        client_id: row?.client_id,
                                      }).unwrap();
                                      const data = JSON.parse(res.data as any);
                                      toast.success(data.Result.FlagMsg);
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
                        ]),
                  ]
                : []
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default UCCReport;
