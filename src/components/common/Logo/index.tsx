import { useTheme } from "@mui/material";
import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => {
    const theme = useTheme()
    const fill = theme.palette.primary.main;
    return (
        <svg {...props}>
            <></>
        </svg>
    )
};