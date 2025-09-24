export interface Config {
  frozenKeys: {
    key: string;
    pos?: "left" | "right";
    RenderBodyCell?: React.FC<{ row: any }>;
    RenderHeadCell?: React.FC;
  }[];
  hide: string[];
  positions: {
    key: string;
    pos?: "left" | "right";
    RenderBodyCell?: React.FC<{ row: any }>;
    RenderHeadCell?: React.FC;
  }[];
  maxStickyColumns: {
    left: number;
    right: number;
  };
}
