import { capitalize } from "@mui/material";

export default function kebabToCapitalize(str: string) {
  return str?.toString().split("-").map(capitalize).join(" ").split("_").map(capitalize).join(" ");
}
