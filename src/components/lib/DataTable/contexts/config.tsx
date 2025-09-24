import React from "react";
import { Config } from "../types/app";

interface ConfigContextValue {
  config: Config;
  rememberMe: boolean;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialConfig: Config = {
  frozenKeys: [],
  maxStickyColumns: {
    left: 2,
    right: 2,
  },
  hide: [],
  positions: [],
};

export const ConfigContext = React.createContext<ConfigContextValue>({
  config: initialConfig,
  setConfig: () => void 0,
  rememberMe: false,
  setRememberMe: () => void 0,
});

export const ConfigProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [config, setConfig] = React.useState<Config>(initialConfig);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [frozenLeftCount, setFrozenLeftCount] = React.useState<number>(0);
  const [frozenRightCount, setFrozenRightCount] = React.useState<number>(0);

  React.useEffect(() => {
    let config: Partial<ConfigContextValue> = {};
    config["config"] = initialConfig;
    try {
      config = JSON.parse(
        window.localStorage.getItem("datatable.config") || JSON.stringify(initialConfig)
      );
      if (config.rememberMe) setRememberMe(config.rememberMe);
    } catch (error) {
      console.error(error);
    } finally {
      if (config.config) setConfig(config.config);
    }
  }, []);

  React.useEffect(() => {
    if (rememberMe === false) window.localStorage.removeItem("datatable.config");
  }, [rememberMe]);

  React.useEffect(() => {
    if (rememberMe) {
      // write datatable.config to LS
      const localConfig: Partial<ConfigContextValue> = {};
      localConfig["config"] = config;
      localConfig["rememberMe"] = rememberMe;
      window.localStorage.setItem("datatable.config", JSON.stringify(localConfig));
    }
  }, [config, rememberMe]);

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        rememberMe,
        setRememberMe,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const ConfigConsumer = ConfigContext.Consumer;
