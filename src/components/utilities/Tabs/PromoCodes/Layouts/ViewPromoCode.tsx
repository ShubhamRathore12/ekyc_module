import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemText,
  List,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { useAvailablePromoCodesQuery, usePromoCodeDetailQuery } from "services/accountopen.service";

interface Promo {
  group3_mapping: string[];
}

const ViewPromoCode = () => {
  const { data, error, isLoading } = useAvailablePromoCodesQuery({active: true});
  const [open, setOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");

  const typeMapping: Record<string, string> = {
    B: 'Branch',
    F: 'Franchise',
    O: 'OTHER',
    G: 'BRANCH FRANCHISE',
    D: 'BDR'
  };

  const handleViewClick = (promo_code: string) => {
    setSelectedPromoCode(promo_code);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPromoCode("");
  };

  const {
    data: promoCodeDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = usePromoCodeDetailQuery(selectedPromoCode, {
    skip: !selectedPromoCode,
  });

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Typography color="error">Error loading promo codes.</Typography>
      </div>
    );
  }
  return (
    <div>
      <TableContainer style={{ width: "100%" }}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Promo Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
            {data?.data?.promo_codes?.map((promoCodeItem, index) => (
              <TableRow key={index}>
                <TableCell>{promoCodeItem.promo_code}</TableCell>
                <TableCell>{promoCodeItem.desc}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleViewClick(promoCodeItem.promo_code)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableHead>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>Promo Code Details</DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <CircularProgress />
          ) : detailsError ? (
            <Typography color="error">Error loading promo code details.</Typography>
          ) : (
            promoCodeDetails?.data?.promo_codes?.map((promo) => (
              <Box key={promo.promo_code}>
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                  <Box flex={1}>
                    <Typography variant="body1">Promo Code</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.promo_code}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body1">Description</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.desc}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                </Box>
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}
                mt={2}>
                  <Box flex={1}>
                    <Typography variant="body1">From Date</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.from_date}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body1">To Date</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.to_date}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                </Box>
                 <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}
                mt={2}>
                  <Box flex={1}>
                    <Typography variant="body1">Active</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.active}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body1">Promo Code Limit</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.promo_code_limit}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                </Box>
                  <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}
                mt={2}>
                  <Box flex={1}>
                    <Typography variant="body1">Promo Code Remaining</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.promo_code_remaining}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body1">Remarks</Typography>
                    <TextField
                      variant="outlined"
                      value={promo.remarks}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                </Box>

                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}
                mt={2}>
                  <Box flex={1}>
                <Typography variant="body1">Scheme Mapping:</Typography>
                {promo.scheme_mapping.map(
                  (
                    scheme: {
                      account_opening_scheme_code:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined;
                      account_opening_scheme_name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined;
                      brokerage_scheme_codes: any[];
                    },
                    index: React.Key | null | undefined
                  ) => (
                    <Box key={index} style={{ marginLeft: "20px" }}>
                      <Typography variant="body1">
                        Account Opening Scheme Code: {scheme.account_opening_scheme_code}
                      </Typography>
                      <Typography variant="body1">
                        Account Opening Scheme Name: {scheme.account_opening_scheme_name}
                      </Typography>
                      <Typography variant="body1">Brokerage Scheme Codes:</Typography>
                      <List>
                        {scheme.brokerage_scheme_codes.map((brokerage, idx) => (
                          <ListItem key={idx}>
                            <ListItemText
                              primary={`${brokerage.scheme_code} - ${brokerage.scheme_name}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )
                )}</Box>
                
                <Box flex={1}>
                <Typography variant="body1">Group3 Mapping:</Typography>
                <List>
                  {Array.isArray(promo.group3_mapping) ?
                  (promo.group3_mapping.map(
                    (
                      group:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined,
                      idx: React.Key | null | undefined
                    ) => (
                      <ListItem key={idx}>
                        <ListItemText primary={group} />
                      </ListItem>
                    )
                  )): (
                    <ListItem>
                      <ListItemText primary="No group mappings available" />
                    </ListItem>
                  )}
                </List>
                </Box>
                
                </Box>
                <Typography variant="body1">Type Mapping:</Typography>
                <List>
                  {promo.type_mapping.map(
                    (
                      type:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined,
                      idx: React.Key | null | undefined
                    ) => (
                      <ListItem key={idx}>
                        <ListItemText primary={typeMapping[type as string] || 'Unknown'} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewPromoCode;
