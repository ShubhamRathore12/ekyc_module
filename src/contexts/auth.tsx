import { useAuth } from "@hooks/useAuth";
import React from "react";

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const { children } = props;

  useAuth();

  return children;
};
