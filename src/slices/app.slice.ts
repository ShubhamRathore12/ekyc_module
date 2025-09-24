import { BlobFile } from "@components/common/lib";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  currentSlide: number;
  files: BlobFile[];
  expirationTime: Date | null;
  timeLeft: string | null;
  wantsToRelock: boolean;
  headerHeight: number;
  sidebarWidth: number;
  expandedSidebarWidth: number;
  updatedReportRequest: any;
  activePopoverRow: string | null;
}

const initialState: AppState = {
  currentSlide: 0,
  files: [],
  expirationTime: null,
  timeLeft: null,
  wantsToRelock: false,
  sidebarWidth: 60,
  headerHeight: 84,
  expandedSidebarWidth: 176,
  updatedReportRequest: [],
  activePopoverRow: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentSlide(state: AppState, action: PayloadAction<number>) {
      state.currentSlide = action.payload;
    },
    setFiles(state: AppState, action: PayloadAction<{ index?: number; file: BlobFile }>) {
      // call
      // setFiles({ index: , file: { ... } })
    },
    setExpirationTime(state: AppState, action: PayloadAction<Date | null>) {
      state.expirationTime = action.payload;
    },
    setTimeLeft(state: AppState, action: PayloadAction<string | null>) {
      state.timeLeft = action.payload;
    },
    setWantsToRelock(state: AppState, action: PayloadAction<boolean>) {
      state.wantsToRelock = action.payload;
    },
    setUpdatedReportRequest(state: AppState, action: PayloadAction<any | null>) {
      state.updatedReportRequest = action.payload;
    },
    setActivePopoverRow: (state, action: PayloadAction<string | null>) => {
      state.activePopoverRow = action.payload;
    },
  },
});

export default appSlice;
