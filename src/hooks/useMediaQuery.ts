import { Breakpoint, Theme, useMediaQuery as useMuiMediaQuery } from "@mui/material";

export const useMediaQuery = (breakpoint: Breakpoint, down?: boolean) =>
  useMuiMediaQuery((theme: Theme) =>
    down ? theme.breakpoints.down(breakpoint) : theme.breakpoints.up(breakpoint)
  );
