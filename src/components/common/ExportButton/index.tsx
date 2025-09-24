import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Button } from "@mui/material";
import handleError from "@utils/handleError";
import toast from "react-hot-toast";
import { ekycApi } from "services/ekyc.service";
import { ReportRequest } from "types/reports";

type Props = ReportRequest;

const ExportButton = (props: Props) => {
  const [getReport, { isLoading }] = ekycApi.useGetReportMutation();

  const handleExport = async () => {
    try {
      if (!props.fromDate || !props.toDate) throw new Error("Please select from date and to date");
      const response = await getReport(props).unwrap();
      toast.success(response.message);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button
      variant="outlined"
      size="large"
      disabled={isLoading}
      startIcon={<ExitToAppIcon />}
      onClick={handleExport}
    >
      Export
    </Button>
  );
};

export default ExportButton;
