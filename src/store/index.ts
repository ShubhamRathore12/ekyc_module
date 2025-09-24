// import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
// import {
//   TypedUseSelectorHook,
//   useDispatch as useReduxDispatch,
//   useSelector as useReduxSelector,
// } from "react-redux";
// import { adminApi } from "services/admin.service";
// import { CDURequestsApi } from "services/cdu-requests.service";
// import { ekycApi } from "services/ekyc.service";
// import { Info } from "services/info.service";
// import appSlice from "slices/app.slice";
// import authSlice from "slices/auth.slice";

// export const store = configureStore({
//   reducer: {
//     auth: authSlice.reducer,
//     app: appSlice.reducer,
//     [ekycApi.reducerPath]: ekycApi.reducer,
//     [adminApi.reducerPath]: adminApi.reducer,
//     [Info.reducerPath]: Info.reducer,
//     [CDURequestsApi.reducerPath]: CDURequestsApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware().concat(
//       ekycApi.middleware,
//       adminApi.middleware,
//       Info.middleware,
//       CDURequestsApi.middleware
//     );
//   },
// });

import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { ThunkAction } from "redux-thunk";
import { adminApi } from "services/admin.service";
import { cduRequestsApi } from "services/cdu-requests.service";
import { ekycApi } from "services/ekyc.service";
import { infoApi } from "services/info.service";
import { accountOpenApi } from "services/accountopen.service";
import appSlice from "slices/app.slice";
import authSlice from "slices/auth.slice";
import configSlice from "slices/config.slice";
// import { rootReducer } from "store/rootReducer";

/*
 * Blacklisting RTK Query reducer from persisting to local storage
 * Otherwise, the API responses will remain cached forever, and there
 * will be no calls to the API until and unless we do a refetch.
 */
const persistedReducer = persistReducer(
  {
    key: "smc-admin-v1",
    blacklist: ["ekycApi", "adminApi", "cduRequestsApi", "infoApi"],
    whitelist: ["config", "auth"],
    storage,
  },
  combineReducers({
    ekyc: ekycApi.reducer,
    cduRequests: cduRequestsApi.reducer,
    admin: adminApi.reducer,
    info: infoApi.reducer,
    app: appSlice.reducer,
    auth: authSlice.reducer,
    config: configSlice.reducer,
    account: accountOpenApi.reducer, 
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      ekycApi.middleware,
      cduRequestsApi.middleware,
      adminApi.middleware,
      infoApi.middleware,
      accountOpenApi.middleware, 
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const persistor = persistStore(store);
