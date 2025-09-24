import { NextComponentType, NextPageContext } from "next";
import { ReactElement, ReactNode } from "react";

declare module "next" {
  export declare type NextPage<P = Record<string, unknown>, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    getLayout?: (page: ReactElement) => ReactNode;
    theme?: "light" | "dark";
  };
}
