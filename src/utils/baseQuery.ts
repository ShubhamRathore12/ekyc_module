import { BaseQueryExtraOptions } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import toast from "react-hot-toast";
import authSlice from "slices/auth.slice";
import { store } from "store";
import { defaultSecurityMiddleware, addSecurityHeaders } from "./securityMiddleware";
import { sanitizeObject } from "./inputSanitizer";

const url = process.env.NEXT_PUBLIC_API_URL;

const mutex = new Mutex();

const baseQuery: (
  baseUrl?: string
) => BaseQueryFn<
  any,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions<any>,
  FetchBaseQueryMeta
> = (baseUrl) => async (args: any, api: any, extraOptions: any) => {
  await mutex.waitForUnlock();
  
  // Security middleware processing
  try {
    // Check if sanitization should be skipped
    const skipSanitization = args.headers && args.headers['X-Skip-Sanitization'] === 'true';
    
    if (skipSanitization) {
      // Skip sanitization but still add security headers
      args.headers = addSecurityHeaders(args.headers || {});
      // Remove the skip sanitization header before sending to server
      delete args.headers['X-Skip-Sanitization'];
    } else {
      const securityResult = await defaultSecurityMiddleware.processRequest(
        args.url,
        args.method || 'GET',
        args.body,
        args.headers
      );
      
      if (!securityResult.isAllowed) {
        toast.error(securityResult.error || 'Request blocked for security reasons');
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: securityResult.error || 'Security validation failed',
            data: undefined,
          } as FetchBaseQueryError,
        };
      }
      
      // Update args with sanitized data and security headers
      if (securityResult.sanitizedData && args.body) {
        args.body = securityResult.sanitizedData;
      }
      
      // Add security headers
      args.headers = addSecurityHeaders(args.headers || {});
    }
    
  } catch (securityError) {
    console.error('Security middleware error:', securityError);
    // Continue with request but log the error
  }
  
  const baseQuery = fetchBaseQuery({ 
    baseUrl: baseUrl ?? url, 
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Add additional security headers
      headers.set('X-Requested-With', 'XMLHttpRequest');
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return headers;
    },
  });

  const state = api.getState();

  const isGroot = state.auth?.login?.data?.admin_type === "grootsupport";
  const isLms = state.auth?.login?.data?.admin_type === "lms_user";

  if (isGroot) args.url = args.url.replace("agent", "grootsupport");
  if (isLms) args.url = args.url.replace("agent", "lms");

  if (args.url === "/ekyc/count" && isGroot) {
    args.url = "/grootsupport/ekyc/count";
  }
  if (args.url === "/report/ekyc/master" && isGroot) {
    args.url = "/grootsupport/ekyc/master";
  }
  if (args.url === "/report/ekyc/ucc" && isGroot) {
    args.url = "/grootsupport/ekyc/ucc";
  }

  if (args.url === "/ekyc/count" && isLms) {
    args.url = "/lms/ekyc/count";
  }
  if (args.url === "/report/ekyc/master" && isLms) {
    args.url = "/lms/ekyc/master";
  }
  if (args.url === "/report/ekyc/ucc" && isLms) {
    args.url = "/lms/ekyc/ucc";
  }

  const result = await baseQuery(args, api, extraOptions);
  
  // Security processing for response
  if (result.data) {
    try {
      const responseResult = await defaultSecurityMiddleware.processResponse(result.data);
      result.data = responseResult.sanitizedResponse;
      
      if (responseResult.warnings && responseResult.warnings.length > 0) {
        console.warn('API Response Security Warnings:', responseResult.warnings);
      }
    } catch (responseError) {
      console.error('Response security processing error:', responseError);
      // Continue with original response
    }
  }
  
  if (result.meta?.response?.status === 401) {
    toast.error("Your session is expired! Please login again.", { id: "401" });
    store.dispatch(authSlice.actions.logout());
  }
  
  // Log potential security events
  if (result.error && typeof result.error === 'object' && 'status' in result.error) {
    const status = result.error.status;
    if (status === 403) {
      console.warn('Security: Access forbidden for URL:', args.url);
    } 
  }
  
  return result;
};

export default baseQuery;
