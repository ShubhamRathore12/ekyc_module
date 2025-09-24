import React from "react";

interface CDULayoutProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

const CDULayout: React.FC<CDULayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default CDULayout;
