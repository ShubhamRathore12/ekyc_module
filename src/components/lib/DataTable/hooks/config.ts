import React from "react";
import { ConfigContext } from "../contexts/config";

export const useConfig = () => React.useContext(ConfigContext);
