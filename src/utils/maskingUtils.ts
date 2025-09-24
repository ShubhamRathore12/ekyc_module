/**
 * Utility functions for masking sensitive data like PAN, mobile numbers, and emails
 */
export enum MaskType {
  PAN = 'PAN',
  MOBILE = 'MOBILE',
  EMAIL = 'EMAIL',
  AADHAAR = 'AADHAAR'
}


/**
 * Masks PAN number - shows first 3 and last 1 characters
 * Example: ABCDE1234F -> ABC****34F
 */
export const maskPAN = (pan: string): string => {
  if (!pan || pan.length < 4) return pan;
  const cleanPAN = pan.replace(/\s/g, '').toUpperCase();
  if (cleanPAN.length !== 10) return pan;
  
  return `${cleanPAN.slice(0, 3)}****${cleanPAN.slice(-1)}`;
};

/**
 * Masks mobile number - shows first 2 and last 2 digits
 * Example: 9876543210 -> 98******10
 */
export const maskMobile = (mobile: string): string => {
  if (!mobile || mobile.length < 4) return mobile;
  const cleanMobile = mobile.replace(/\D/g, '');
  if (cleanMobile.length < 10) return mobile;
  
  return `${cleanMobile.slice(0, 2)}${'*'.repeat(cleanMobile.length - 4)}${cleanMobile.slice(-2)}`;
};

/**
 * Masks email - shows first 2 characters and domain
 * Example: john.doe@example.com -> jo****@example.com
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length < 2) return email;
  
  const maskedLocal = `${localPart.slice(0, 2)}${'*'.repeat(Math.max(localPart.length - 2, 4))}`;
  return `${maskedLocal}@${domain}`;
};

/**
 * Generic masking function that determines the type and applies appropriate masking
 */
export const maskData = (data: string, type: MaskType): string => {
  switch (type) {
    case MaskType.PAN:
      return maskPAN(data);
    case MaskType.MOBILE:
      return maskMobile(data);
    case MaskType.EMAIL:
      return maskEmail(data);
    case MaskType.AADHAAR:
      return maskAadhaar(data);
    default:
      return data;
  }
};

export const maskAadhaar = (aadhaar: string): string => {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  
  // Mask middle 4 digits: 1234 5678 9012 → 1234 **** 9012
  return aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 **** $3');
};

/**
 * Auto-detect data type and apply appropriate masking
 */
export const autoMaskData = (data: string) => {
  // Aadhaar detection (12 digits)
  if (/^\d{12}$/.test(data.replace(/\s/g, ''))) {
    return {
      masked: maskAadhaar(data),
      type: MaskType.AADHAAR
    };
  }
  
  // Existing PAN detection
  if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data)) {
    return {
      masked: maskPAN(data),
      type: MaskType.PAN
    };
  }
  
  // Existing mobile detection
  if (/^\d{10}$/.test(data)) {
    return {
      masked: maskMobile(data),
      type: MaskType.MOBILE
    };
  }
  
  // Existing email detection
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
    return {
      masked: maskEmail(data),
      type: MaskType.EMAIL
    };
  }
  
  return { masked: data, type: null };
};
