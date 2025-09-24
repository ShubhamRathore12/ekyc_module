/**
 * Input Sanitization Utility for XSS Protection
 * 
 * This utility provides comprehensive input sanitization to prevent
 * Cross-Site Scripting (XSS) attacks and ensure data integrity.
 */

// HTML entities map for encoding
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '\\': '&#x5C;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param input - The string to escape
 * @returns The escaped string
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input.replace(/[&<>"'\/\\`=]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Removes potentially dangerous script tags and their content
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export function removeScriptTags(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove script tags and their content (case insensitive)
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Removes potentially dangerous HTML attributes that can execute JavaScript
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export function removeDangerousAttributes(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove dangerous event handlers and javascript: links
  const dangerousPatterns = [
    /\s*on\w+\s*=\s*[^>]*/gi, // onload, onclick, etc.
    /javascript\s*:/gi,        // javascript: links
    /data\s*:/gi,              // data: URLs
    /vbscript\s*:/gi,          // vbscript: links
  ];
  
  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

/**
 * Comprehensive input sanitization function
 * @param input - The string to sanitize
 * @param options - Sanitization options
 * @returns The sanitized string
 */
export function sanitizeInput(
  input: string,
  options: {
    escapeHtml?: boolean;
    removeScripts?: boolean;
    removeDangerousAttrs?: boolean;
    trimWhitespace?: boolean;
  } = {}
): string {
  if (!input || typeof input !== 'string') return '';
  
  const {
    escapeHtml: shouldEscapeHtml = true,
    removeScripts = true,
    removeDangerousAttrs = true,
    trimWhitespace = true,
  } = options;
  
  let sanitized = input;
  
  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Remove script tags
  if (removeScripts) {
    sanitized = removeScriptTags(sanitized);
  }
  
  // Remove dangerous attributes
  if (removeDangerousAttrs) {
    sanitized = removeDangerousAttributes(sanitized);
  }
  
  // Escape HTML entities
  if (shouldEscapeHtml) {
    sanitized = escapeHtml(sanitized);
  }
  
  return sanitized;
}

/**
 * Validates and sanitizes specific field types
 */
export const fieldSanitizers = {
  /**
   * Sanitizes email input
   */
  email: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Remove any characters that shouldn't be in an email
    return sanitized.replace(/[<>()[\]\\,;:\s@"]/g, '').toLowerCase();
  },

  /**
   * Sanitizes phone number input
   */
  phone: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Keep only digits, +, -, (, ), and spaces
    return sanitized.replace(/[^\d+\-().\s]/g, '');
  },

  /**
   * Sanitizes PAN number input
   */
  pan: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Keep only alphanumeric characters and convert to uppercase
    return sanitized.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  },

  /**
   * Sanitizes alphanumeric input (like user codes)
   */
  alphanumeric: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Keep only alphanumeric characters
    return sanitized.replace(/[^A-Za-z0-9]/g, '');
  },

  /**
   * Sanitizes name input
   */
  name: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Keep only letters, spaces, dots, and hyphens
    return sanitized.replace(/[^A-Za-z\s.\-]/g, '');
  },

  /**
   * Sanitizes general text input
   */
  text: (input: string): string => {
    return sanitizeInput(input, { 
      escapeHtml: true, 
      removeScripts: true, 
      removeDangerousAttrs: true 
    });
  },

  /**
   * Sanitizes username input
   */
  username: (input: string): string => {
    const sanitized = sanitizeInput(input, { escapeHtml: true });
    // Keep only alphanumeric, dots, underscores, and hyphens
    return sanitized.replace(/[^A-Za-z0-9._-]/g, '').toLowerCase();
  },
};

/**
 * Validates input length constraints
 */
export function validateLength(
  input: string,
  minLength: number = 0,
  maxLength: number = 1000
): { isValid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length < minLength) {
    return { isValid: false, error: `Minimum length is ${minLength} characters` };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Maximum length is ${maxLength} characters` };
  }
  
  return { isValid: true };
}


class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 300000) { // 5 attempts per 5 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return false;
    }

    // Increment count
    record.count++;
    record.lastAttempt = now;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const remaining = this.windowMs - (Date.now() - record.lastAttempt);
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Sanitizes object properties recursively
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== 'object') return {};

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}