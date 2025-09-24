import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  IconButton,
  Input,
  Modal,
  Stack,
  TableCell,
  Tooltip,
  Typography,
} from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import prettyPrintDate from "@utils/prettyPrintDate";
import toast from "react-hot-toast";
import { getStickyStyles } from "../utils/get-sticky-styles";
import { useState } from "react";
import appSlice from "slices/app.slice";
import { useDispatch, useSelector } from "store";

interface Props<T> {
  column: {
    key: string;
    RenderBodyCell?: React.FC<{ row: any }>;
  };
  dates: string[];
  isCopyField?: boolean;
  row: Record<string, any>;
  valueMap: Record<string, Record<string, unknown>> | undefined;
  fontSize?: number;
  maxStickyColumns: {
    left: number;
    right: number;
  };
  frozenKeys: {
    key: string;
    pos?: "right" | "left" | undefined;
  }[];
  editableColumns?: string[];
}

export const TableBodyCell = <T extends Record<string, any>>({
  column,
  dates,
  isCopyField,
  row,
  valueMap,
  maxStickyColumns,
  frozenKeys,
  editableColumns,
}: Props<T>) => {
  const getRowCell = (row: Record<string, any>, key: string, noTransform = false) => {
    if (valueMap?.[key]) {
      return valueMap[key][row[key]];
    } else if (dates?.some((date) => date === key)) {
      if (key === "date_of_birth") return row[key];
      return prettyPrintDate(row[key]);
    } else {
      if (key === "payment_order_id") return row[key];
      return noTransform ? row[key] : kebabToCapitalize(row[key]);
    }
  };

  const dispatch = useDispatch();
  const updatedRequest = useSelector((state) => state.app.updatedReportRequest);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(getRowCell(row, column.key) || "");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsEdit(false);
    setEditValue(getRowCell(row, column.key) || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    dispatch(appSlice.actions.setActivePopoverRow(null));
  };

  const handleSave = () => {
    dispatch(
      appSlice.actions.setUpdatedReportRequest(
        updatedRequest.some((item: any) => item.clientId === row?.client_id)
          ? updatedRequest.map((item: any) =>
              item.clientId === row?.client_id ? { ...item, request: editValue } : item
            )
          : [...updatedRequest, { clientId: row?.client_id, request: editValue }]
      )
    );
    toast.success("Value updated successfully");
    handleCloseModal();
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    value?.length < 50 ? toast.success(`${value} copied`) : toast.success(`Copied to clipboard`);
  };

  if (!column || !row) return null;

  return (
    <TableCell sx={{ p: 0, maxWidth: "400px", ...getStickyStyles(column?.key, frozenKeys, true) }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* {(getRowCell(row, column.key, isCopyField) as string)?.length > 50 ? (
          <Tooltip
            arrow
            title={
              (getRowCell(row, column.key, isCopyField) as string)?.length > 50
                ? getRowCell(row, column.key, isCopyField)
                : ""
            }
          > */}
        <Typography variant="body2" noWrap sx={{ px: 2, py: 1 }}>
          {column.RenderBodyCell ? (
            <column.RenderBodyCell row={row} />
          ) : (
            getRowCell(row, column.key, isCopyField) || "---"
          )}
        </Typography>
        {/* </Tooltip>
        ) : (
          <Typography variant="body2" noWrap sx={{ px: 2, py: 1 }}>
            {column.RenderBodyCell ? (
              <column.RenderBodyCell row={row} />
            ) : (
              getRowCell(row, column.key, isCopyField) || "---"
            )}
          </Typography>
        )} */}
        {isCopyField && getRowCell(row, column.key, isCopyField) && (
          <IconButton
            onClick={() => copyToClipboard(getRowCell(row, column.key, isCopyField) as string)}
          >
            <ContentCopyIcon fontSize="small" color="primary" />
          </IconButton>
        )}
        {((getRowCell(row, column.key, isCopyField) as string)?.length > 50 || editableColumns?.includes(column.key)) && (
          <Stack direction="row" width="100%" justifyContent="flex-end">
            <IconButton onClick={handleOpenModal}>
              <VisibilityIcon fontSize="small" color="primary" />
            </IconButton>
          </Stack>
        )}

        {/* Modal for Editing */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Stack
            spacing={2}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "70vh",
              width: "80vw",
              bgcolor: "white",
              overflowY: "scroll",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            {isEdit ? (
              <>
                <Input
                  multiline
                  fullWidth
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  sx={{ border: "1px solid black", px: 1, py: 1 }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={handleCloseModal} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack spacing={2}>
                {editableColumns?.includes(column.key) && (
                  <Stack direction="row" justifyContent="flex-end">
                    <IconButton onClick={() => setIsEdit(true)}>
                      <EditIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Stack>
                )}
                <Typography variant="body2" sx={{ px: 2, py: 1, wordBreak: "break-word" }}>
                  {getRowCell(row, column.key, isCopyField) as string}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Modal>
      </Stack>
    </TableCell>
  );
};
