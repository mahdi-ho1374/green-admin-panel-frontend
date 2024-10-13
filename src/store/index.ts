import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/ui";
import formSlice from "./slices/form";
import saleSlice from "./slices/sale";
import genericSlice from "./slices/generi";
import { GenericKey } from "../types/generic";
import dashboardSlice from "./slices/dashboard";

const store = configureStore({
  reducer: {
    generic: genericSlice.reducer,
    ui: uiSlice.reducer,
    form: formSlice.reducer,
    sale: saleSlice.reducer,
    dashboard: dashboardSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const uiColors = store.getState().ui.colors;

export const state = store.getState();

export default store;
