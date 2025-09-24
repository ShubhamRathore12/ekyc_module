import { ShowIcon } from "@components/DataGrid";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import removeDuplicates from "@components/lib/DataTable/utils/removeDuplicates";
import DataTableV2 from "@components/lib/DataTableV2";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button } from "@mui/material";
import handleError from "@utils/handleError";
import { reorderObject } from "@utils/reorderObject";
import React from "react";

import kebabToCapitalize from "@utils/kebabToCapitalize";
import { useGetAgentAccessTokenMutation, useGetAgentEkycQuery } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  Ekyc,
  GetAgentEkycRequest,
  KYCStatus,
  Scheme,
  VerifyStatus,
  telecallerKeys,
} from "types/ekyc";

const AgentDashboard = () => {
  const { login } = useAuth();
  const type = login?.data.admin_type;

  const [ekycs, setEkycs] = React.useState<Ekyc[]>([]);

  const [currentFilters, setCurrentFilters] = React.useState<GetAgentEkycRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] = React.useState<GetAgentEkycRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data, isError, isLoading, isFetching } = useGetAgentEkycQuery(
    {
      ...actualFilters,
    },
    { refetchOnMountOrArgChange: true, pollingInterval: 300000 }
  );

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data.ekycs, telecallerKeys);

  const reorderedObj = reorderObject(data?.data?.ekycs[0], telecallerKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  React.useEffect(() => {
    if (data && !isFilters.actualFiltersApplied) {
      setEkycs((prevData) => removeDuplicates(prevData, data?.data.ekycs));
    }
    if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 1) {
      setEkycs(data?.data.ekycs);
    }
    if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages > 1) {
      setEkycs((prevData) => {
        if (actualFilters.page_number === 1) {
          prevData = [];
        }
        return removeDuplicates(prevData, data?.data.ekycs);
      });
    }
    if (data && isFilters.actualFiltersApplied && data?.data.no_of_pages === 0) {
      setEkycs([]);
    }
  }, [data]);

  React.useEffect(() => {
    if (hitBottom) {
      setActualFilters((prev) => ({
        ...prev,
        page_number: prev.page_number + 1,
      }));
    }
  }, [hitBottom]);
  return (
    <DataTableV2
      totalPages={totalPages}
      dataTableOptions={{ export: false }}
      columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
      data={ekycs || []}
      currentFilters={currentFilters}
      setCurrentFilters={setCurrentFilters}
      actualFilters={actualFilters}
      setActualFilters={setActualFilters}
      reset={() => {
        setEkycs([]);
        setActualFilters({
          page_number: 1,
          no_of_records: 10,
        });
        setCurrentFilters({
          page_number: 1,
          no_of_records: 10,
        });
      }}
      filterDropdowns={["kyc_status", "verify_status"]}
      valueMap={{
        kyc_status: KYCStatus,
        application_type: ApplicationType,
        scheme: Scheme,
        // referral_code: ReferralCode,
        aoc_plan_type: AOCPlanType,
        verify_status: VerifyStatus,
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
      copyFields={["pan_number", "locked_by_admin_username", "full_name", "email", "referral_code"]}
      id="client_id"
      hide={["app_status"]}
      customColumns={
        ekycs?.length > 0
          ? [
              {
                position: "start",
                label: "Application Status",
                RenderHeadCell: () => {
                  return <></>;
                },
                RenderBodyCell({ row }) {
                  const [getToken] = useGetAgentAccessTokenMutation();
                  if (row === null) return <ShowIcon />;
                  return (
                    <Button
                      variant="text"
                      sx={{ color: "primary.main" }}
                      onClick={async () => {
                        try {
                          const data = await getToken({
                            client_id: row?.client_id,
                          }).unwrap();
                          window.open(
                            `${process.env.NEXT_PUBLIC_EKYC_WEB_URL}/e-kyc/assisted?at=${
                              data?.data?.access_token
                            }&step=${row?.app_stage?.replace("_", "-")}`
                          );
                        } catch (error) {
                          handleError(error);
                        }
                      }}
                      endIcon={<ArrowOutwardIcon color="info" />}
                    >
                      {kebabToCapitalize(row?.app_stage?.replace("_", "-"))}
                    </Button>
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
  );
};

export default AgentDashboard;
