import { Config } from "@components/lib/DataTable/types/app";

export const handleStickiness = (
  key: string,
  pos: "left" | "right" | "none",
  frozenKeys: {
    key: string;
    pos?: "right" | "left" | undefined;
  }[],
  setConfig: React.Dispatch<React.SetStateAction<Config>>,
  maxStickyColumns: {
    left: number;
    right: number;
  }
) => {
  if (pos !== "none") {
    const index = frozenKeys?.findIndex((k) => k.key === key);
    // if the key already exists in frozenKeys
    if (index !== -1) {
      const updated = [...frozenKeys];
      updated[index].pos = pos;

      setConfig((prev) => ({
        ...prev,
        frozenKeys: updated,
      }));
    }
    // if the max sticky columns limit is reached
    else if (frozenKeys?.filter((f) => f.pos === pos).length === maxStickyColumns[pos]) {
      const updated = [...frozenKeys];

      setConfig((prev) => ({
        ...prev,
        frozenKeys: updated.concat({ key, pos }),
      }));
    }
    // add the key to frozenKeys otherwise
    else {
      setConfig((prev) => ({
        ...prev,
        frozenKeys: prev.frozenKeys.concat({ key, pos }),
      }));
    }
  } else {
    setConfig((prev) => ({
      ...prev,
      frozenKeys: prev.frozenKeys?.filter((f) => f.key !== key),
    }));
  }
};
