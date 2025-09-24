import { capitalize } from "@mui/material";

export default function capitalizeKey(str: string) {
  return str.split("_").map(capitalize).join(" ");
}
