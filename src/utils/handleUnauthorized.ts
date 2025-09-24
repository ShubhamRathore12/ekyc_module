import { userAgentFromString } from "next/server";

declare global {
  interface Window {
    webkit: any;
    androidApp: any;
  }
}

export const handleUnauthorized = () => {
  if (typeof window !== undefined && "navigator" in window) {
    const ua = userAgentFromString(window.navigator.userAgent);
    if (ua.device.type === "mobile") {
      const pathname = encodeURIComponent(window.location.pathname);
      window?.webkit?.messageHandlers.handleUnauthorized.postMessage(pathname);
      window?.androidApp?.handleUnauthorized(pathname);
    }
  }
};
