/**
 * Secure Form Wrapper Component
 * 
 * This component provides a secure wrapper for forms with built-in
 * XSS protection, input validation, and rate limiting.
 */

import React from 'react';
import { FormikProvider, FormikConfig, FormikValues, useFormik } from 'formik';
import { Box, Alert } from '@mui/material';
import { sanitizeObject, rateLimiter } from '@utils/inputSanitizer';
import { AutomationDetector } from '@utils/inputValidation';
import { toast } from 'react-hot-toast';

interface SecureFormProps<T extends FormikValues> extends Omit<FormikConfig<T>, 'onSubmit'> {
  onSubmit: (values: T, formikHelpers: any) => void | Promise<void>;
  enableAutomationDetection?: boolean;
  sanitizeOnSubmit?: boolean;
  children: React.ReactNode;
  securityLevel?: 'basic' | 'medium' | 'high';
}

export function SecureForm<T extends FormikValues>({
  onSubmit,
  enableAutomationDetection = true,
  sanitizeOnSubmit = true,
  securityLevel = 'medium',
  children,
  ...formikProps
}: SecureFormProps<T>) {
  const [securityWarning, setSecurityWarning] = React.useState<string>('');
  const [submissionTimestamps, setSubmissionTimestamps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (enableAutomationDetection && typeof navigator !== 'undefined') {
      const isSuspicious = AutomationDetector.isSuspiciousUserAgent(navigator.userAgent);
      if (isSuspicious) {
        setSecurityWarning('Suspicious user agent detected. Please use a standard browser.');
      }
    }
  }, [enableAutomationDetection]);

  const handleSecureSubmit = async (values: T, formikHelpers: any) => {
    const now = Date.now();

    // Automation detection
    if (enableAutomationDetection) {
      const newTimestamps = [...submissionTimestamps, now];
      const recentTimestamps = newTimestamps.filter(ts => now - ts < 10000); // 10 seconds window
      
      if (AutomationDetector.detectRapidSubmission(recentTimestamps)) {
        toast.error('Rapid submission detected. Please slow down.');
        setSecurityWarning('Rapid submission detected. This may indicate automated behavior.');
        return;
      }
      
      setSubmissionTimestamps(recentTimestamps);
    }

    // Sanitize form values if enabled
    let sanitizedValues = values;
    if (sanitizeOnSubmit) {
      sanitizedValues = sanitizeObject(values) as T;
      
      const originalJson = JSON.stringify(values);
      const sanitizedJson = JSON.stringify(sanitizedValues);
      
      if (originalJson !== sanitizedJson) {
        if (securityLevel === 'high') {
          setSecurityWarning('Potentially malicious content was detected and removed from your submission.');
        }
      }
    }

    try {
      await onSubmit(sanitizedValues, formikHelpers);
      setSecurityWarning(''); // Clear warnings on successful submission
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  const formik = useFormik({
    ...formikProps,
    onSubmit: handleSecureSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        {securityWarning && (
          <Alert 
            severity={securityLevel === 'high' ? 'error' : 'warning'} 
            sx={{ mb: 2 }}
            onClose={() => setSecurityWarning('')}
          >
            {securityWarning}
          </Alert>
        )}
        
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          {children}
        </fieldset>
      </Box>
    </FormikProvider>
  );
}

export default SecureForm;