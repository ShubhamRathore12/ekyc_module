/**
 * Security Middleware for API Requests
 * 
 * This middleware provides comprehensive security features for API calls
 * including input sanitization, validation, and anti-automation measures.
 */

import { sanitizeObject } from './inputSanitizer';
import { AutomationDetector, VALIDATION_PATTERNS } from './inputValidation';

export interface SecurityConfig {
  enableSanitization?: boolean;
  enableAutomationDetection?: boolean;
  enableRequestValidation?: boolean;
  maxRequestSize?: number; // in bytes
  allowedContentTypes?: string[];
  sanitizeResponse?: boolean;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableSanitization: true,
  enableAutomationDetection: true,
  enableRequestValidation: true,
  maxRequestSize: 1024 * 1024, // 1MB
  allowedContentTypes: [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
  ],
  sanitizeResponse: false, // Usually server responses are trusted
};

/**
 * Security middleware for API requests
 */
export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  /**
   * Validates and sanitizes request data before sending to API
   */
  async processRequest(
    url: string,
    method: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<{
    isAllowed: boolean;
    sanitizedData?: any;
    error?: string;
  }> {
    try {
      // Automation detection
      if (this.config.enableAutomationDetection && typeof navigator !== 'undefined') {
        const userAgent = navigator.userAgent;
        if (AutomationDetector.isSuspiciousUserAgent(userAgent)) {
          return {
            isAllowed: false,
            error: 'Automated requests are not allowed.',
          };
        }
      }

      // Request size validation
      if (data && this.config.maxRequestSize) {
        const dataSize = JSON.stringify(data).length;
        if (dataSize > this.config.maxRequestSize) {
          return {
            isAllowed: false,
            error: 'Request size exceeds allowed limit.',
          };
        }
      }

      // Content type validation
      if (headers && this.config.allowedContentTypes) {
        const contentType = headers['Content-Type'] || headers['content-type'];
        if (contentType && !this.config.allowedContentTypes.some(type => 
          contentType.includes(type)
        )) {
          return {
            isAllowed: false,
            error: 'Invalid content type.',
          };
        }
      }

      // Request validation
      if (this.config.enableRequestValidation && data) {
        const validationResult = this.validateRequestData(data);
        if (!validationResult.isValid) {
          return {
            isAllowed: false,
            error: validationResult.error,
          };
        }
      }

      // Data sanitization
      let sanitizedData = data;
      if (this.config.enableSanitization && data) {
        sanitizedData = sanitizeObject(data);
      }

      return {
        isAllowed: true,
        sanitizedData,
      };
    } catch (error) {
      console.error('Security middleware error:', error);
      return {
        isAllowed: false,
        error: 'Security validation failed.',
      };
    }
  }

  /**
   * Processes API response for security
   */
  async processResponse(
    response: any,
    originalRequest?: any
  ): Promise<{
    sanitizedResponse: any;
    warnings?: string[];
  }> {
    const warnings: string[] = [];

    if (!this.config.sanitizeResponse) {
      return { sanitizedResponse: response };
    }

    try {
      let sanitizedResponse = response;

      if (typeof response === 'object' && response !== null) {
        sanitizedResponse = sanitizeObject(response);
        
        // Check if response was modified during sanitization
        if (JSON.stringify(response) !== JSON.stringify(sanitizedResponse)) {
          warnings.push('Response data was sanitized for security');
        }
      }

      return { sanitizedResponse, warnings };
    } catch (error) {
      console.error('Response processing error:', error);
      return { sanitizedResponse: response, warnings: ['Response processing failed'] };
    }
  }

  /**
   * Validates request data for security issues
   */
  private validateRequestData(data: any): { isValid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: true };
    }

    // Check for malicious patterns in all string values
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return !VALIDATION_PATTERNS.maliciousPattern.test(value);
      }
      if (Array.isArray(value)) {
        return value.every(item => checkValue(item));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).every(item => checkValue(item));
      }
      return true;
    };

    if (!checkValue(data)) {
      return {
        isValid: false,
        error: 'Potentially malicious content detected in request data.',
      };
    }

    return { isValid: true };
  }

  /**
   * Logs security events for monitoring
   */
  private logSecurityEvent(event: {
    type: 'automation' | 'malicious_content' | 'validation_error';
    url: string;
    method: string;
    severity: 'low' | 'medium' | 'high';
    details?: any;
  }) {
    // In production, this should send to a security monitoring service
    console.warn('Security Event:', {
      timestamp: new Date().toISOString(),
      ...event,
    });
  }
}

/**
 * Default security middleware instance
 */
export const defaultSecurityMiddleware = new SecurityMiddleware();

/**
 * Higher-order function to wrap API calls with security middleware
 */
export function withSecurity<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  config?: Partial<SecurityConfig>
): T {
  const middleware = new SecurityMiddleware(config);

  return (async (...args: Parameters<T>) => {
    // Extract request details (this may need adjustment based on your API structure)
    const [url, options = {}] = args;
    const { method = 'GET', body, headers } = options;

    // Process request
    const requestResult = await middleware.processRequest(url, method, body, headers);
    
    if (!requestResult.isAllowed) {
      throw new Error(requestResult.error || 'Request blocked by security middleware');
    }

    // Update request with sanitized data
    if (requestResult.sanitizedData && body) {
      options.body = requestResult.sanitizedData;
    }

    // Call original API function
    const response = await apiFunction(url, options, ...args.slice(2));

    // Process response
    const responseResult = await middleware.processResponse(response);
    
    if (responseResult.warnings && responseResult.warnings.length > 0) {
      console.warn('Security warnings:', responseResult.warnings);
    }

    return responseResult.sanitizedResponse;
  }) as T;
}

/**
 * Security headers for enhanced protection
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};

/**
 * Utility to add security headers to requests
 */
export function addSecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    ...SECURITY_HEADERS,
  };
}

export default SecurityMiddleware;