import { TableCellProps } from "@mui/material";

export const getStickyStyles = (
  key: string,
  frozenKeys: {
    key: string;
    pos?: "right" | "left" | undefined;
  }[],
  body?: boolean
) => {
  const index = frozenKeys?.findIndex((k) => k.key === key);
  const pos = frozenKeys?.at(index)?.pos;

  const idx = frozenKeys?.filter((f) => f.pos === pos).findIndex((k) => k.key === key);

  if (idx === -1) return {} as TableCellProps["sx"];

  let i = idx;
  let width = 0;
  while (i !== 0) {
    const prevEl = document.querySelector(
      `[data-column-key=${frozenKeys?.filter((f) => f.pos === pos)?.at(i-- - 1)?.key}]`
    );
    width += prevEl?.getBoundingClientRect?.()?.width || 0;
  }

  return {
    ...(body
      ? {
          position: "sticky",
          top: 0,
          zIndex: 1099,
        }
      : {
          zIndex: "appBar",
        }),
    ...(pos && {
      [pos]: width,
    }),
    bgcolor: "rgb(248, 248, 248)",
  } as TableCellProps["sx"];
};
