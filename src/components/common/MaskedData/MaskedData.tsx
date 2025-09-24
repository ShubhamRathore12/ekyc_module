import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MaskType, maskData, autoMaskData } from '@utils/maskingUtils';

interface MaskedDataProps {
  data: string;
  type?: MaskType;
  autoDetect?: boolean;
  showIcon?: boolean;
  variant?: 'body1' | 'body2' | 'caption' | 'h6' | 'subtitle1' | 'subtitle2';
  color?: string;
  sx?: any;
}

const MaskedData: React.FC<MaskedDataProps> = ({
  data,
  type,
  autoDetect = true,
  showIcon = true,
  variant = 'body2',
  color,
  sx = {}
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!data) {
    return <Typography variant={variant} color={color} sx={sx}>-</Typography>;
  }

  // Determine masking approach
  let maskedValue: string;
  let detectedType: MaskType | null = null;

  if (autoDetect) {
    const result = autoMaskData(data);
    maskedValue = result.masked;
    detectedType = result.type;
  } else if (type) {
    maskedValue = maskData(data, type);
    detectedType = type;
  } else {
    maskedValue = data;
  }

  // Don't show masking if no sensitive data detected
  const shouldMask = detectedType !== null;
  const displayValue = shouldMask && !isRevealed ? maskedValue : data;

  const handleToggleVisibility = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
        ...sx 
      }}
    >
      <Typography 
        variant={variant} 
        color={color}
        sx={{ 
          fontFamily: shouldMask && !isRevealed ? 'monospace' : 'inherit',
          letterSpacing: shouldMask && !isRevealed ? '0.5px' : 'normal'
        }}
      >
        {displayValue}
      </Typography>
      
      {shouldMask && showIcon && (
        <Tooltip title={isRevealed ? 'Hide' : 'Show'}>
          <IconButton
            size="small"
            onClick={handleToggleVisibility}
            sx={{ 
              p: 0.25,
              ml: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {isRevealed ? (
              <VisibilityOff sx={{ fontSize: 16 }} />
            ) : (
              <Visibility sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default MaskedData;