import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import type { LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";
import React from "react";

type LinkProps = Omit<ButtonProps<"a">, "href"> & NextLinkProps;

export const Link: React.FC<LinkProps> = (props) => {
  const { href, variant = "text", children, sx, ...other } = props;
  return (
    <Button
      component={NextLink}
      href={href as string}
      variant={variant}
      sx={{ minWidth: 0, ...sx }}
      {...other}
    >
      {children}
    </Button>
  );
};
