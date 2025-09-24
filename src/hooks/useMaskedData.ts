import { useState, useMemo } from 'react';
import { MaskType, maskData, autoMaskData } from '@utils/maskingUtils';

interface UseMaskedDataOptions {
  autoDetect?: boolean;
  type?: MaskType;
  initiallyRevealed?: boolean;
}

export const useMaskedData = (
  data: string, 
  options: UseMaskedDataOptions = {}
) => {
  const { autoDetect = true, type, initiallyRevealed = false } = options;
  const [isRevealed, setIsRevealed] = useState(initiallyRevealed);

  const maskedInfo = useMemo(() => {
    if (!data) return { masked: '', original: data, type: null, shouldMask: false };

    if (autoDetect) {
      const result = autoMaskData(data);
      return {
        masked: result.masked,
        original: data,
        type: result.type,
        shouldMask: result.type !== null
      };
    } else if (type) {
      return {
        masked: maskData(data, type),
        original: data,
        type,
        shouldMask: true
      };
    }

    return { masked: data, original: data, type: null, shouldMask: false };
  }, [data, autoDetect, type]);

  const displayValue = maskedInfo.shouldMask && !isRevealed 
    ? maskedInfo.masked 
    : maskedInfo.original;

  const toggleVisibility = () => setIsRevealed(!isRevealed);

  return {
    displayValue,
    maskedValue: maskedInfo.masked,
    originalValue: maskedInfo.original,
    isRevealed,
    shouldMask: maskedInfo.shouldMask,
    detectedType: maskedInfo.type,
    toggleVisibility,
    setIsRevealed
  };
};