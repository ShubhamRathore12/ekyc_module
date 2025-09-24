import DataTableV2 from "@components/lib/DataTableV2";

import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import MaskedData from "@components/common/MaskedData";
import { MaskType } from "@utils/maskingUtils";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate } from "@utils/formatDate";
import { reorderObject } from "@utils/reorderObject";
import React from "react";
import { useGetMasterReportsQuery, useGetSTXProductsQuery } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  GetMasterReportsRequest,
  GetMasterReportsResponse,
  KYCStatus,
  MasterReports,
  NomineeUploadStatus,
  Scheme,
  orderedMasterKeys,
  ProductCode,
  STXProductDetail,
} from "types/ekyc";
import { ApplicationStatus, ReportsTab } from "types/reports";
import { useSelector } from "react-redux";
import { RootState } from "store";

const options = [
  {
    label: "Mobile Number",
    value: "mobile_number" as const,
  },
  {
    label: "Pan Number",
    value: "pan_number" as const,
  },
];

const MasterReports = () => {
  const { login } = useAuth();

  const [currentFilters, setCurrentFilters] = React.useState<GetMasterReportsRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const { data: stxProductsData, isLoading: stxProductsLoading } = useGetSTXProductsQuery();

  const [actualFilters, setActualFilters] = React.useState<GetMasterReportsRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);
  const loginmf = useSelector((state: RootState) => state.auth.login);

  const { data, isError, isLoading } = useGetMasterReportsQuery(
    {
      ...(loginmf?.data?.admin_type === "mf_user" && { referral_code: "mf_admin" }),
      ...(loginmf?.data?.admin_type === "sub_user" && { referral_code: "sub_admin" }),
      ...(loginmf?.data?.admin_type === "stx_user" && { referral_code: "stx_admin" }),

      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.ekycs, orderedMasterKeys);

  const reorderedObj = reorderObject(data?.data?.ekycs[0], orderedMasterKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  // Define sensitive fields that need masking
  const MASKED_FIELDS = {
    pan_number: MaskType.PAN,
    mobile_number: MaskType.MOBILE,
    email: MaskType.EMAIL,
    aadhaar_number: MaskType.AADHAAR,
  };


  const createMaskedColumns = (obj: Record<string, any>, adminType: string) => {
    return Object.keys(obj || {}).map((key) => {
      const maskType = MASKED_FIELDS[key as keyof typeof MASKED_FIELDS];

      if (maskType) {
        return {
          key,
          renderCell: (params: any) => (
            <MaskedData
              data={params.value || ''}
              type={maskType}
              variant="body2"
              showIcon={true}
              sx={{ 
                minWidth: '120px',
                '& .MuiIconButton-root': {
                  color: 'primary.main'
                }
              }}
            />
          ),
        };
      }

      return { key };
    });
  };

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

  // React.useEffect(() => {
  //   if (data && !isFilters.actualFiltersApplied) {
  //     setEkycs((prevData) => removeDuplicates(prevData, data?.data.ekycs));
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 1) {
  //     setEkycs(data?.data.ekycs);
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages > 1) {
  //     setEkycs((prevData) => {
  //       if (actualFilters.page_number === 1) {
  //         prevData = [];
  //       }
  //       return removeDuplicates(prevData, data?.data.ekycs);
  //     });
  //   }
  //   if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 0) {
  //     setEkycs([]);
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
    MasterReports,
    "ekycs",
    GetMasterReportsResponse,
    GetMasterReportsRequest
  >({
    data: data,
    keyname: "ekycs",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
  });

  // Dashboard

  const [selectType, setSelectType] =
    React.useState<typeof options[number]["value"]>("mobile_number");

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

  React.useEffect(() => {
    setCurrentFilters((prev) => {
      const newFilters = {
        ...prev,
      };
      options.forEach((opt) => {
        newFilters[opt.value] = "";
      });
      return newFilters;
    });
  }, [selectType]);

  return (
    <>
      <Box
        sx={{
          bgcolor: "#FFFF",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Master Reports</Typography>
          {/* <IconButton
            onClick={() => {
              exportToExcelSheet(rows, "master reports", "master reports");
            }}
          >
            <UploadIcon />
          </IconButton> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              mb: 2,
              width: "min(100%, 732px)",
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "100px" } }}>
              <Typography variant="subtitle2">Select Type</Typography>
            </Box>
            <Box sx={{ flex: 1, width: "100%" }}>
              <TextField
                fullWidth
                select
                sx={{
                  height: "40px",
                  "& .MuiInputBase-input": {
                    bgcolor: "hsla(0, 0%, 98%, 1)",
                  },
                }}
                value={selectType}
                onChange={(e) => {
                  setSelectType(e.target.value as typeof options[number]["value"]);
                }}
              >
                {options.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>
            <Box sx={{ flex: 1, width: "100%" }}>
              <TextField
                sx={{
                  height: "40px",
                  "& .MuiInputBase-input": {
                    bgcolor: "hsla(0, 0%, 98%, 1)",
                  },
                }}
                fullWidth
                value={currentFilters[selectType] ?? ""}
                onChange={(e) => {
                  setCurrentFilters((prev) => ({
                    ...prev,
                    [selectType]: e.target.value,
                  }));
                }}
                placeholder="Enter PAN or Mobile"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              width: "min(100%, 732px)",
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "100px" } }}>
              <Typography variant="subtitle2">To Date</Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                width: "100%",
                " .MuiFormControl-root": {
                  backgroundColor: "hsla(0, 0%, 98%, 1)",
                },
              }}
            >
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
            </Box>
            <Box
              sx={{
                flex: 1,
                width: "100%",
                " .MuiFormControl-root": {
                  backgroundColor: "hsla(0, 0%, 98%, 1)",
                },
              }}
            >
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
            </Box>
          </Box>
          <Stack
            direction="row"
            gap={1}
            sx={{ width: { xs: "unset", md: "732px" }, justifyContent: "end" }}
          >
            <Button size="large" variant="contained" onClick={() => handleSubmit()}>
              Search
            </Button>

            <Button
              size="large"
              variant="contained"
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
              Reset filters
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box>
          <DataTableV2
            totalPages={totalPages}
            columns={createMaskedColumns(reorderedObj, login?.data.admin_type as string)}
            data={clientData || []}
            actualFilters={actualFilters}
            setActualFilters={setActualFilters}
            valueMap={{
              status: KYCStatus,
              application_type: ApplicationType,
              scheme: Scheme,
              aoc_plan_type: AOCPlanType,
              app_status: ApplicationStatus,
              nominee_upload: NomineeUploadStatus,
              product_code: productOptionsMap,
            }}
            labelMap={{ client_id: "Client ID" }}
            filterDropdowns={[
              "app_status",
              "product_code"
            ]}
            dates={["updated_at", "created_at", "date_of_birth"]}
            id="id"
            copyFields={["pan_number", "mobile_number", "email", "referral_code"]}
            isLoading={isLoading}
            isError={isError}
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
            dataTableOptions={{
              export: login?.data?.admin_type === "super_admin" || login?.data?.admin_type === "sub_user",

              reportName: ReportsTab.MASTER_REPORT,
              fromDate: formatDate(currentFilters.from_date),
              toDate: formatDate(currentFilters.to_date),
            }}
            setHitBottom={setHitBottom}
            currentFilters={currentFilters}
            setCurrentFilters={setCurrentFilters}
            initialColumns={initialColumns}
          />
        </Box>
      </Box>
    </>
  );
};

export default MasterReports;
