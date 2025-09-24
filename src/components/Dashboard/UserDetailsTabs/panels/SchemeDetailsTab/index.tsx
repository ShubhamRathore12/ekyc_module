import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetSchemeDetailsQuery } from "services/ekyc.service";
import TabFromLayout from "../../TabFromLayout";
import { RejectionTemplate } from "types/ekyc";

interface IProps {
  rejectionTemplates: RejectionTemplate[];
}

const capitalizeWords = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const SchemeDetailsTab = (props: IProps) => {
  const { rejectionTemplates } = props;
  const [files, setFiles] = useState<any>([]);

  const router = useRouter();
  const client_id = router.query.userid as string;

  const { data, error, isError, isLoading } = useGetSchemeDetailsQuery(
    { client_id },
    { skip: !client_id }
  );

  const errorMessage = (error as any)?.error;

  return (
    <>
      <TabFromLayout formHeading="Scheme Details" subtext="">
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError || !data?.data?.scheme_detail ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data.data.scheme_detail.map((detail, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {Object.entries(detail)
                  .filter(([key]) => !["client_id", "created_at", "updated_at"].includes(key))
                  .map(([key, value]) => {
                    if (key === "status") return null;

                    return (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { sm: "center" },
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ width: { sm: "50%" }, mb: { xs: 1, sm: 0 } }}
                        >
                          {capitalizeWords(key)}
                        </Typography>
                        <TextField
                          disabled
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={
                            typeof value === "string" || typeof value === "number"
                              ? value
                              : ""
                          }
                          InputProps={{ readOnly: true }}
                        />
                      </Box>
                    );
                  })}
              </Box>
            ))}
          </Box>
        )}
        <Grid container alignItems="center" sx={{ pb: 1 }}>
  <Box sx={{ minWidth: 160 }}>
    <Typography noWrap variant="subtitle2">
      Status
    </Typography>
  </Box>
  <Grid item md={8}>
    <RadioGroup row value="2">
      <FormControlLabel
        value="0"
        control={<Radio disabled/>}
        label="Pending"
      />
      <FormControlLabel
        value="2"
        control={<Radio disabled/>}
        label="Verified"
      />
      <FormControlLabel
        value="3"
        control={<Radio disabled/>}
        label="Rejected"
      />
    </RadioGroup>
  </Grid>
</Grid>
      </TabFromLayout>
    </>
  );
};

export default SchemeDetailsTab;
