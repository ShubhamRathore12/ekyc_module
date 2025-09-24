/* eslint-disable react-hooks/rules-of-hooks */
import LaunchIcon from "@mui/icons-material/Launch";

import { LinkComponent, ShowIcon } from "@components/DataGrid";
import AuthGuard from "@components/auth/AuthGuard";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { IconButton, SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PendingApllicantAsset from "@public/assets/dashboard/PendingApplicantsAssets.png";
import RejectedApplicantsAsset from "@public/assets/dashboard/RejectedApplicantsAsset.png";
import TotalApplicantsAsset from "@public/assets/dashboard/TotalApplicantsAsset.png";
import VerifiedApplicantsAsset from "@public/assets/dashboard/VerifiedApplicantsAsset.png";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import { reorderObject } from "@utils/reorderObject";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "react-hot-toast";
import {
  useGetEKycCountQuery,
  useGetEkycQuery,
  useGetSTXProductsQuery,
} from "services/ekyc.service";

import { GetEkycResponse, STXProductDetail, adminKeys } from "types/ekyc";

import AgentDashboard from "@components/Dashboard/AgentDashboard";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import {
  AOCPlanType,
  ApplicationType,
  Ekyc,
  GetEkycRequest,
  KYCStatus,
  Scheme,
  VerifyStatus,
  ProductCode,
} from "types/ekyc";

import { useDispatch } from "react-redux";
import appSlice from "slices/app.slice";
import { useRouter } from "next/router";
import MaskedData from "@components/common/MaskedData";
import { MaskType } from "@utils/maskingUtils";

const Card = dynamic(() => import("../../components/Dashboard/DashboardCard"), {
  ssr: false,
});

const initialFilters: Record<keyof GetEkycRequest, any> = {
  applicant_name: "",
  date_of_birth: null,
  email: "",
  from_date: null,
  kyc_status: undefined,
  mobile_number: "",
  no_of_records: 10,
  page_number: 1,
  pan_number: "",
  to_date: null,
  verifier: undefined,
};

const Dashboard: NextPage = () => {
  const { login } = useAuth();
  const type = login?.data.admin_type;
  const dispatch = useDispatch();

  const router = useRouter();

  // Define sensitive fields that need masking
  const MASKED_FIELDS = {
    pan_number: MaskType.PAN,
    mobile_number: MaskType.MOBILE,
    email: MaskType.EMAIL,
    aadhaar_number: MaskType.AADHAAR,
  };

  // Create columns with masking for sensitive fields
  const createMaskedColumns = (obj: Record<string, any>) => {
    return Object.keys(obj || {}).map((key) => {
      const maskType = MASKED_FIELDS[key as keyof typeof MASKED_FIELDS];

      if (maskType) {
        return {
          key,
          RenderBodyCell: ({ row }: { row: any }) => {
            if (row === null) return <div>--</div>;
            return (
              <MaskedData
                data={row[key] || ''}
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
            );
          },
        };
      }

      return { key };
    });
  };

  React.useEffect(() => {
    if (
      login?.data.admin_type === "mf_user" ||
      login?.data.admin_type === "sub_user" ||
      login?.data?.admin_type === "stx_user"
    ) {
      router.replace("/backoffice");
    }
  }, [login?.data?.admin_type]);

  const [currentFilters, setCurrentFilters] = React.useState<GetEkycRequest>({
    page_number: 1,
    no_of_records: 10,
  });
  const { data: stxProductsData, isLoading: stxProductsLoading } = useGetSTXProductsQuery();
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
  const [actualFilters, setActualFilters] = React.useState<GetEkycRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data, isError, isLoading, isFetching } = useGetEkycQuery(
    {
      ...actualFilters,
    },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 300000,
      skip:
        login?.data?.admin_type === "mf_user" ||
        login?.data?.admin_type === "sub_user" ||
        login?.data?.admin_type === "stx_user",
    }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.ekycs, adminKeys);

  const reorderedObj = reorderObject(data?.data?.ekycs[0], adminKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

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
  //   if (hitBottom) {
  //     setActualFilters((prev) => ({
  //       ...prev,
  //       page_number: prev.page_number + 1,
  //     }));
  //   }
  // }, [hitBottom]);

  const { clientData } = useClientData<Ekyc, "ekycs", GetEkycResponse, GetEkycRequest>({
    data: data,
    keyname: "ekycs",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "client_id",
  });

  // const maxStickyColumns = useSelector((state) => state.config.maxStickyColumns);
  // const frozenKeys = useSelector((state) => state.config.frozenKeys);
  // const columnPositions = useSelector((state) => state.config.columnPositions);
  // states
  const [period, setPeriod] = React.useState<string>("all");
  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  // hooks
  // const { data, isLoading } = useGetInfoQuery();

  // handlers
  // derived states

  const [count, setCount] = React.useState<number>(0);

  const { data: KycCountData, isLoading: kycCountLoading } = useGetEKycCountQuery(
    { time: period },
    {
      skip:
        login?.data?.admin_type === "mf_user" ||
        login?.data?.admin_type === "sub_user" ||
        login?.data?.admin_type === "stx_user",
    }
  );
  const kycCount = KycCountData?.data;
  const cards = [
    {
      title: "TOTAL APPLICANTS",
      numberOfApplicants: kycCount?.total_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(215, 98%, 56%, 0.38)",
      iconColor: "hsla(215, 74%, 64%, 1)",
      illustration: TotalApplicantsAsset,
    },
    {
      title: "PENDING APPLICANTS",
      numberOfApplicants: kycCount?.total_pending_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(45, 100%, 74%, 1)",
      iconColor: "hsla(45, 33%, 45%, 1)",
      illustration: PendingApllicantAsset,
    },
    {
      title: "VERIFIED APPLICANTS",
      numberOfApplicants: kycCount?.total_verified_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(160, 68%, 65%, 1)",
      iconColor: "hsla(160, 100%, 34%, 1)",
      illustration: VerifiedApplicantsAsset,
    },
    {
      title: "REJECTED APPLICANTS",
      numberOfApplicants: kycCount?.total_rejected_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(350, 100%, 81%, 1)",
      iconColor: "hsla(354, 99%, 68%, 1)",
      illustration: RejectedApplicantsAsset,
    },
  ];

  return (
    <Box
      sx={{
        ...(isFetching && {
          pointerEvents: "none",
          opacity: 0.7,
        }),
      }}
    >
      <Grid container spacing={2} sx={{ width: "auto" }}>
        {cards.map((item) => {
          return (
            <Card
              key={item.title}
              {...item}
              loading={kycCountLoading}
              period={period}
              handleChange={handleChange}
            />
          );
        })}
      </Grid>
      <Box sx={{ mt: 3 }}>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#FFFF",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Button variant="outlined" sx={{ height: "50px" }} onClick={handleClick}>
              Hide Columns
            </Button>
            <FilterDorpDownMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
              hideColumns={getColumnKeys(currentResult?.data?.data?.ekycs?.[0])}
            />
          </Box>
          <Box sx={{ p: 2 }}>
            <Button variant="outlined" sx={{ height: "50px" }} onClick={handleClickOne}>
              Sticky Options
            </Button>
            <FilterDorpDownMenu
              anchorEl={anchorElOne}
              open={openOne}
              handleClose={handleCloseOne}
              stickyOptions
            />
          </Box>
        </Box> */}
        <Box>
          {type === "telecaller" || type === "grootsupport" || type === "lms_user" ? (
            <AgentDashboard />
          ) : (
            <DataTableV2
              totalPages={totalPages}
              dataTableOptions={{
                export:
                  login?.data?.admin_type === "super_admin" || login?.data?.admin_type === "kra",
                localExport: true,
              }}
              columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
              data={clientData || []}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
              actualFilters={actualFilters}
              setActualFilters={setActualFilters}
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
              filterDropdowns={[
                "kyc_status",
                "verify_status",
                 "product_code"
              ]}
              valueMap={{
                kyc_status: KYCStatus,
                application_type: ApplicationType,
                scheme: Scheme,
                // referral_code: ReferralCode,
                aoc_plan_type: AOCPlanType,
                verify_status: VerifyStatus,
                product_code: productOptionsMap,
              }}
              labelMap={{
                client_id: "Client ID",
                pan_number: "PAN",
                locked_by_admin_username: "Verifier",
                full_name: "Applicant name",
                mobile_number: "Mobile",
                date_of_birth: "DOB",
              }}
              dates={["updated_at", "created_at", "date_of_birth"]}
              copyFields={["locked_by_admin_username", "full_name", "referral_code"]}
              id="client_id"
              hide={["app_status"]}
              customColumns={
                clientData?.length > 0
                  ? [
                      // Add masked columns for sensitive data
                      ...createMaskedColumns(reorderedObj)
                        .filter(col => MASKED_FIELDS[col.key as keyof typeof MASKED_FIELDS])
                        .map(col => ({
                          position: "start" as const,
                          label: col.key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                          RenderHeadCell: () => <div></div>,
                          RenderBodyCell: col.RenderBodyCell!,
                        })),
                      {
                        position: "start",
                        label: "Show",
                        RenderHeadCell: () => {
                          return <></>;
                        },
                        RenderBodyCell({ row }: { row: Ekyc }) {
                          if (row === null) return <ShowIcon />;

                          if (
                            row.locked_by_admin_username &&
                            login?.data.username !== row.locked_by_admin_username
                          )
                            return (
                              <IconButton
                                onClick={() => {
                                  toast.error(`Locked by ${row.locked_by_admin_username}`);
                                }}
                              >
                                <LaunchIcon color="primary" />
                              </IconButton>
                            );
                          return (
                            <LinkComponent
                              id={row.client_id}
                              full_name={row.full_name}
                              pan_number={row.pan_number}
                              product_code={row.product_code}
                              // disabled={row.verify_status === "" ? true : false}
                            />
                          );
                        },
                      },
                    ]
                  : []
              }
              initialColumns={initialColumns}
              setHitBottom={setHitBottom}
              isError={isError}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default Dashboard;

interface IProps {
  open: boolean;
  handleClose: () => void;
  clientID: string;
  appStage: string;
}
