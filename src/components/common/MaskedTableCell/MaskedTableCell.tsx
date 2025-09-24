import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import MaskedData from '../MaskedData';
import { MaskType } from '@utils/maskingUtils';

interface MaskedTableCellProps extends Omit<TableCellProps, 'children'> {
  data: string;
  type?: MaskType;
  autoDetect?: boolean;
  showIcon?: boolean;
}

const MaskedTableCell: React.FC<MaskedTableCellProps> = ({
  data,
  type,
  autoDetect = true,
  showIcon = true,
  ...tableCellProps
}) => {
  return (
    <TableCell {...tableCellProps}>
      <MaskedData
        data={data}
        type={type}
        autoDetect={autoDetect}
        showIcon={showIcon}
        variant="body2"
      />
    </TableCell>
  );
};

export default MaskedTableCell;