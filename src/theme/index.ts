import { alpha, Breakpoint, BreakpointsOptions } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import { tabsClasses } from "@mui/material/Tabs";

// Create a theme instance.
const primary = {
  main: "#38439A",
  light: "#38439A",
  dark: "#38439A",
  contrastText: "#FFFFFF",
};

const values: BreakpointsOptions["values"] = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1280,
  xl: 1500,
};

const down = (breakpoint: Breakpoint) => `@media (max-width: ${values[breakpoint]}px)`;
const up = (breakpoint: Breakpoint) => `@media (min-width: ${values[breakpoint]}px)`;
const theme = createTheme({
  breakpoints: {
    values,
  },
  palette: {
    background: {
      default: "#F0F2F5",
      paper: "#FFFFFF",
    },
    primary,
    secondary: {
      main: "hsla(0, 0%, 26%, 1)",
      light: "#FFFFFF",
      dark: "#E2E6EE",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#008442",
      light: "#43C6B7",
      dark: "#EAFCF3",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#2196F3",
      light: "#64B6F7",
      dark: "#0B79D0",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFB020",
      light: "#FFBF4C",
      dark: "#B27B16",
      contrastText: "#121828",
    },
    error: {
      main: "#E41616",
      light: "#DA6868",
      dark: "#FEEDED",
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        ".scrollbar": {
          "&::-webkit-scrollbar": {
            width: 8,
            height: 4,
            backgroundColor: theme.palette.background.default,
          },
          "&::-webkit-scrollbar-track": {
            WebkitBoxShadow: "inset 0 0 6px transparent",
            backgroundColor: theme.palette.background.default,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            outline: "1px solid transparent",
            borderRadius: "4px",
            width: 8,
          },
        },
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        ".react-otp-input input": {
          fontSize: 18,
          lineHeight: "32px",
          fontWeight: 400,
          letterSpacing: "0.42px",
          width: "45px !important",
          height: 55,
          borderRadius: "4px",
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          marginRight: theme.spacing(1.5),
          "&:hover, &:focus": {
            border: `1px solid ${theme.palette.primary.main}`,
            outline: "none",
          },
          [theme.breakpoints.down("sm")]: {
            width: "35px !important",
            height: 40,
            marginRight: theme.spacing(0.5),
          },
        },
      }),
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          minWidth: "500px",
          maxHeight: "300px",
          overflow: "auto",
          padding: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.palette.mode === "dark" ? "none" : "0px 8px 15px 0px #9398A833",
          color: theme.palette.text.primary,
          textAlign: "center",
          fontSize: 13,
          border: "1px solid",
          borderColor: theme.palette.divider,
        }),
        arrow: ({ theme }) => ({
          color: theme.palette.background.paper,
          "&:before": {
            border: "1px solid",
            borderColor: theme.palette.divider,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.multiline && {
            padding: 0,
          }),
          "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
            // borderColor: theme.palette.text.secondary,
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            // borderColor: "transparent",
          },
        }),
        input: ({ theme }) => ({
          padding: theme.spacing(1.5, 1.75),
          fontSize: 17,
          "&:not(.Mui-disabled)": {
            backgroundColor: "transparent !important",
          },
          color: alpha(theme.palette.text.primary, 1),
          "&.Mui-disabled": {
            "-webkit-text-fill-color": alpha(theme.palette.text.secondary, 1),
          },
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.palette.text.secondary,
          borderWidth: "2px",
        }),
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          height: "40px",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: 14,
          fontWeight: 400,
        },
        root: ({ ownerState, theme }) => ({
          alignItems: "center",
        }),
      },
    },

    MuiCircularProgress: {
      defaultProps: {
        size: 26,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          fontSize: "14px",
          fontWeight: 400,
          height: 40,
          alignItems: "center",
          ...(ownerState.variant === "text" && {
            textTransform: "none",
            color: "#FFFF",
            py: 1,
          }),

          // styling the form submit buttons
          ...(ownerState.size === "large" && ownerState.type === "submit"
            ? {
                minWidth: 300,
                [theme.breakpoints.down("sm")]: {
                  minWidth: "unset",
                  width: "100%",
                },
              }
            : {}),
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          "& .MuiMenuItem-root": {
            textWrap: "wrap",
            whiteSpace: "inherit",
            height: "auto",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          backgroundColor: "#FFFF",
          borderRadius: "10px",
          padding: theme.spacing(0.3),
          alignItems: "center",
          "& .MuiTabs-flexContainer": {
            display: "flex",
            gap: theme.spacing(2),
          },
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }),
        scroller: {
          "& .MuiTabs-flexContainer": {
            color: "red",
            display: "flex",
            alignItems: "center",
            gap: 2,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          // backgroundColor: "#FFFF",
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: "#FFFF",
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "inherit",
          color: "black",
          fontSize: "14px",
          fontWeight: 400,
          "&.Mui-selected": {
            backgroundColor: primary.main,
            borderRadius: 10,
            paddingY: 1,
            color: "#FFFF",
          },
        }),
      },
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
    },
  },
  typography: {
    h1: {
      fontSize: 48,
      fontWeight: 800,
    },
    h2: {
      fontSize: 38,
      fontWeight: 700,
    },
    h3: {
      fontSize: 26,
      fontWeight: 700,
    },
    h4: {
      fontSize: 22,
      fontWeight: 600,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
    },
    h6: {
      fontSize: 18,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
    },
  },
});

export default theme;
