import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface ConfigState {
  dataTableHiddenColumns: string[];
  maxStickyColumns: {
    left: number;
    right: number;
  };
  frozenKeys: { key: string; pos?: "left" | "right" }[];
  columnPositions: { key: string; pos?: "left" | "right" }[];
}

const initialState: ConfigState = {
  dataTableHiddenColumns: [],
  maxStickyColumns: {
    left: 2,
    right: 2,
  },
  frozenKeys: [],
  columnPositions: [],
};

const configSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMaxStickyLeft(state: ConfigState, action: PayloadAction<number>) {
      if (action.payload >= 1) {
        state.maxStickyColumns.left = action.payload;
      }
    },
    setMaxStickyRight(state: ConfigState, action: PayloadAction<number>) {
      if (action.payload >= 1) {
        state.maxStickyColumns.right = action.payload;
      }
    },
    setHiddenColumns(state: ConfigState, action: PayloadAction<{ key: string; hide: boolean }>) {
      action.payload.hide
        ? state.dataTableHiddenColumns.push(action.payload.key)
        : (state.dataTableHiddenColumns = state.dataTableHiddenColumns.filter(
            (_key) => _key !== action.payload.key
          ));
    },
    resetOptions(state: ConfigState, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.dataTableHiddenColumns = [];
        state.maxStickyColumns.left = 2;
        state.maxStickyColumns.right = 2;
        state.frozenKeys = [];
        state.columnPositions = [];
      }
    },
    addFrozenKey(
      state: ConfigState,
      action: PayloadAction<{ key: string; pos: "left" | "right" | "none" }>
    ) {
      const { key, pos } = action.payload;
      if (pos !== "none") {
        // if found remove it
        const foundIdx = state.frozenKeys.findIndex((f) => f.key === key);
        if (foundIdx !== -1) state.frozenKeys.splice(foundIdx, 1);

        // if limit is reached, remove it
        // if (state.frozenKeys.filter((f) => f.pos === pos).length === state.maxStickyColumns[pos]) {
        //   state.frozenKeys.splice(
        //     state.frozenKeys.findIndex((f) => f.pos === pos),
        //     1
        //   );
        //   toast(
        //     (t) => (
        //       <>
        //         <p style={{ textAlign: "center" }}>
        //           😂 Max column length reached for position: <b>{pos}</b>
        //         </p>
        //       </>
        //     ),
        //     { id: "MAX_COLUMN_LIMIT" }
        //   );
        // }

        // add to frozen keys
        state.frozenKeys.push(action.payload as ConfigState["frozenKeys"][number]);
      } else {
        state.frozenKeys = state.frozenKeys.filter((frozenKey) => frozenKey.key !== key);
      }
    },
    addColumnPositions(
      state: ConfigState,
      action: PayloadAction<{ key: string; pos: "left" | "right" | "none" }>
    ) {
      const { key, pos } = action.payload;
      if (pos !== "none") {
        // if found remove it
        const foundIdx = state.columnPositions.findIndex((c) => c.key === key);
        if (foundIdx !== -1) state.columnPositions.splice(foundIdx, 1);
        // add to frozen keys
        state.columnPositions.push(action.payload as ConfigState["columnPositions"][number]);
      } else {
        state.columnPositions = state.columnPositions.filter((column) => column.key !== key);
      }
    },
  },
});

export default configSlice;
