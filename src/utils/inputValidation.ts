/**
 * Comprehensive Input Validation Utility
 * 
 * This utility provides robust validation rules for all form fields
 * with appropriate length limits and security measures.
 */

import * as Yup from 'yup';

// Field length constraints based on business requirements
export const FIELD_CONSTRAINTS = {
  // User credentials
  username: { min: 3, max: 50 },
  password: { min: 8, max: 128 },
  email: { min: 5, max: 254 },
  
  // Personal information
  name: { min: 2, max: 100 },
  firstName: { min: 1, max: 50 },
  lastName: { min: 1, max: 50 },
  
  // Phone numbers
  mobileNumber: { min: 10, max: 15 },
  phoneNumber: { min: 10, max: 15 },
  
  // Identity documents
  panNumber: { min: 10, max: 10 },
  aadharNumber: { min: 12, max: 12 },
  passportNumber: { min: 8, max: 20 },
  drivingLicense: { min: 10, max: 20 },
  
  // Financial information
  accountNumber: { min: 9, max: 18 },
  ifscCode: { min: 11, max: 11 },
  micrCode: { min: 9, max: 9 },
  
  // Address fields
  address: { min: 10, max: 500 },
  city: { min: 2, max: 50 },
  state: { min: 2, max: 50 },
  pincode: { min: 6, max: 6 },
  country: { min: 2, max: 50 },
  
  // General text fields
  shortText: { min: 1, max: 100 },
  mediumText: { min: 1, max: 255 },
  longText: { min: 1, max: 1000 },
  
  // Codes and IDs
  userCode: { min: 3, max: 20 },
  clientId: { min: 5, max: 30 },
  promoCode: { min: 3, max: 50 },
  
  // Remarks and comments
  remarks: { min: 0, max: 500 },
  comments: { min: 0, max: 1000 },
  reason: { min: 5, max: 255 },
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[+]?[\d\s\-()]{10,15}$/,
  mobileNumber: /^[6-9]\d{9}$/,
  panNumber: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadharNumber: /^\d{12}$/,
  ifscCode: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  micrCode: /^[0-9]{9}$/,
  pincode: /^[1-9][0-9]{5}$/,
  username: /^[a-zA-Z0-9._-]{3,50}$/,
  alphanumeric: /^[A-Za-z0-9]+$/,
  alphabetic: /^[A-Za-z\s.-]+$/,
  numeric: /^\d+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  // Security pattern to detect potentially malicious input
  maliciousPattern: /(<script|javascript:|data:|vbscript:|on\w+\s*=)/i,
};

/**
 * Custom validation functions
 */
export const customValidators = {
  /**
   * Validates that input doesn't contain malicious patterns
   */
  noMaliciousContent: (value: string | undefined): boolean => {
    if (!value) return true;
    return !VALIDATION_PATTERNS.maliciousPattern.test(value);
  },

  /**
   * Validates PAN number format and checksum
   */
  validPAN: (value: string | undefined): boolean => {
    if (!value) return true;
    return VALIDATION_PATTERNS.panNumber.test(value.toUpperCase());
  },

  /**
   * Validates mobile number for Indian format
   */
  validMobileNumber: (value: string | undefined): boolean => {
    if (!value) return true;
    return VALIDATION_PATTERNS.mobileNumber.test(value);
  },

  /**
   * Validates IFSC code format
   */
  validIFSC: (value: string | undefined): boolean => {
    if (!value) return true;
    return VALIDATION_PATTERNS.ifscCode.test(value.toUpperCase());
  },

  /**
   * Validates that password meets security requirements
   */
  strongPassword: (value: string | undefined): boolean => {
    if (!value) return true;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },
};

/**
 * Common Yup validation schemas
 */
export const validationSchemas = {
  // Basic text field with length constraints
  text: (min: number = 1, max: number = 255, required: boolean = true) => {
    let schema = Yup.string()
      .min(min, `Minimum ${min} characters required`)
      .max(max, `Maximum ${max} characters allowed`)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('This field is required') : schema;
  },

  // Email validation
  email: (required: boolean = true) => {
    let schema = Yup.string()
      .email('Please enter a valid email address')
      .min(FIELD_CONSTRAINTS.email.min, `Minimum ${FIELD_CONSTRAINTS.email.min} characters required`)
      .max(FIELD_CONSTRAINTS.email.max, `Maximum ${FIELD_CONSTRAINTS.email.max} characters allowed`)
      .matches(VALIDATION_PATTERNS.email, 'Please enter a valid email address')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Email is required') : schema;
  },

  // Mobile number validation
  mobileNumber: (required: boolean = true) => {
    let schema = Yup.string()
      .length(FIELD_CONSTRAINTS.mobileNumber.max, 'Mobile number must be 10 digits')
      .matches(VALIDATION_PATTERNS.mobileNumber, 'Please enter a valid mobile number')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Mobile number is required') : schema;
  },

  // PAN number validation
  panNumber: (required: boolean = true) => {
    let schema = Yup.string()
      .length(FIELD_CONSTRAINTS.panNumber.max, 'PAN number must be 10 characters')
      .matches(VALIDATION_PATTERNS.panNumber, 'Please enter a valid PAN number (e.g., ABCDE1234F)')
      .test('valid-pan', 'Please enter a valid PAN number', customValidators.validPAN)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('PAN number is required') : schema;
  },

  // Username validation
  username: (required: boolean = true) => {
    let schema = Yup.string()
      .min(FIELD_CONSTRAINTS.username.min, `Minimum ${FIELD_CONSTRAINTS.username.min} characters required`)
      .max(FIELD_CONSTRAINTS.username.max, `Maximum ${FIELD_CONSTRAINTS.username.max} characters allowed`)
      .matches(VALIDATION_PATTERNS.username, 'Username can only contain letters, numbers, dots, underscores, and hyphens')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Username is required') : schema;
  },

  // Password validation
  password: (required: boolean = true) => {
    let schema = Yup.string()
      .min(FIELD_CONSTRAINTS.password.min, `Password must be at least ${FIELD_CONSTRAINTS.password.min} characters`)
      .max(FIELD_CONSTRAINTS.password.max, `Password must not exceed ${FIELD_CONSTRAINTS.password.max} characters`)
      .test('strong-password', 'Password must contain uppercase, lowercase, number, and special character', customValidators.strongPassword)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Password is required') : schema;
  },

  // Name validation
  name: (required: boolean = true) => {
    let schema = Yup.string()
      .min(FIELD_CONSTRAINTS.name.min, `Minimum ${FIELD_CONSTRAINTS.name.min} characters required`)
      .max(FIELD_CONSTRAINTS.name.max, `Maximum ${FIELD_CONSTRAINTS.name.max} characters allowed`)
      .matches(VALIDATION_PATTERNS.alphabetic, 'Name can only contain letters, spaces, dots, and hyphens')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Name is required') : schema;
  },

  // IFSC code validation
  ifscCode: (required: boolean = true) => {
    let schema = Yup.string()
      .length(FIELD_CONSTRAINTS.ifscCode.max, 'IFSC code must be 11 characters')
      .matches(VALIDATION_PATTERNS.ifscCode, 'Please enter a valid IFSC code')
      .test('valid-ifsc', 'Please enter a valid IFSC code', customValidators.validIFSC)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('IFSC code is required') : schema;
  },

  // MICR code validation
  micrCode: (required: boolean = true) => {
    let schema = Yup.string()
      .length(FIELD_CONSTRAINTS.micrCode.max, 'MICR code must be 9 digits')
      .matches(VALIDATION_PATTERNS.micrCode, 'MICR code must contain only digits')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('MICR code is required') : schema;
  },

  // Numeric validation
  numeric: (min: number = 0, max: number = 999999999, required: boolean = true) => {
    let schema = Yup.number()
      .min(min, `Minimum value is ${min}`)
      .max(max, `Maximum value is ${max}`)
      .integer('Must be a whole number');
    
    return required ? schema.required('This field is required') : schema;
  },

  // Address validation
  address: (required: boolean = true) => {
    let schema = Yup.string()
      .min(FIELD_CONSTRAINTS.address.min, `Minimum ${FIELD_CONSTRAINTS.address.min} characters required`)
      .max(FIELD_CONSTRAINTS.address.max, `Maximum ${FIELD_CONSTRAINTS.address.max} characters allowed`)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Address is required') : schema;
  },

  // Pincode validation
  pincode: (required: boolean = true) => {
    let schema = Yup.string()
      .length(FIELD_CONSTRAINTS.pincode.max, 'Pincode must be 6 digits')
      .matches(VALIDATION_PATTERNS.pincode, 'Please enter a valid pincode')
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Pincode is required') : schema;
  },

  // Remarks/Comments validation
  remarks: (required: boolean = false) => {
    let schema = Yup.string()
      .max(FIELD_CONSTRAINTS.remarks.max, `Maximum ${FIELD_CONSTRAINTS.remarks.max} characters allowed`)
      .test('no-malicious', 'Invalid characters detected', customValidators.noMaliciousContent);
    
    return required ? schema.required('Remarks are required') : schema;
  },
};

/**
 * Input field configurations with appropriate constraints
 */
export const inputFieldConfigs = {
  username: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.username.max,
    validation: validationSchemas.username(),
    sanitizer: 'username',
  },
  email: {
    type: 'email',
    maxLength: FIELD_CONSTRAINTS.email.max,
    validation: validationSchemas.email(),
    sanitizer: 'email',
  },
  mobileNumber: {
    type: 'tel',
    maxLength: FIELD_CONSTRAINTS.mobileNumber.max,
    validation: validationSchemas.mobileNumber(),
    sanitizer: 'phone',
  },
  panNumber: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.panNumber.max,
    validation: validationSchemas.panNumber(),
    sanitizer: 'pan',
  },
  name: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.name.max,
    validation: validationSchemas.name(),
    sanitizer: 'name',
  },
  ifscCode: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.ifscCode.max,
    validation: validationSchemas.ifscCode(),
    sanitizer: 'alphanumeric',
  },
  micrCode: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.micrCode.max,
    validation: validationSchemas.micrCode(),
    sanitizer: 'alphanumeric',
  },
  address: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.address.max,
    validation: validationSchemas.address(),
    sanitizer: 'text',
  },
  pincode: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.pincode.max,
    validation: validationSchemas.pincode(),
    sanitizer: 'alphanumeric',
  },
  remarks: {
    type: 'text',
    maxLength: FIELD_CONSTRAINTS.remarks.max,
    validation: validationSchemas.remarks(),
    sanitizer: 'text',
  },
};

/**
 * Anti-automation detection utility
 */
export class AutomationDetector {
  private static suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /automated|script|selenium|puppeteer/i,
    /curl|wget|httpclient|python-requests/i,
  ];

  static isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent) return true; // No user agent is suspicious
    
    return this.suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  static detectRapidSubmission(timestamps: number[], windowMs: number = 5000): boolean {
    if (timestamps.length < 2) return false;
    
    const recentTimestamps = timestamps.filter(ts => Date.now() - ts < windowMs);
    return recentTimestamps.length > 3; // More than 3 submissions in window
  }
}

export default {
  FIELD_CONSTRAINTS,
  VALIDATION_PATTERNS,
  customValidators,
  validationSchemas,
  inputFieldConfigs,
  AutomationDetector,
};