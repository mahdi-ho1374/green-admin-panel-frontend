import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CustomError, FetchStatus, ModalType, UiState } from "../../types/ui";

const isDarkMode = JSON.parse(localStorage.getItem("isDarkMode") || "true");
const isBackgroundMode = JSON.parse(
  localStorage.getItem("isBackgroundMode") || "false"
);
const isNavWide = JSON.parse(localStorage.getItem("isNavWide") || "true");

const initialState: UiState = {
  showModal: false,
  modalType: "",
  isDarkMode,
  isBackgroundMode,
  isNavWide,
  isNavVisible: window.innerWidth > 991 ? true : false,
  openedTooltipId: "",
  fetchStatus: {},
  connectionError: null,
  colors: {
    primary: isDarkMode ? "#2d483b" : "#e5e4e2",
    secondary: isDarkMode ? "#082623" : "#dfdfd5",
    tertiary: isDarkMode ? "#082623" : "#023020",
    modal: isDarkMode ? "#082623" : "#dfdfd5",
    supplement: isDarkMode ? "#f7fac3" : "#662c27",
    text: isDarkMode ? "#fbfddf" : "#023020",
    white: isDarkMode ? "#fafcda" : "#e5e4e2",
    success: "#064a34",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f97316",
    edit: "#a855f7",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<ModalType | undefined>) {
      state.showModal = !state.showModal;
      state.modalType = action.payload !== undefined ? action.payload : "";
    },
    setOpenedTooltipId(state, action: PayloadAction<string>) {
      console.log("grtr");
      console.log(action.payload);
      state.openedTooltipId = action.payload;
    },
    setFetchStatus(
      state,
      action: PayloadAction<{ key: string; status: FetchStatus }>
    ) {
      const { key, status } = action.payload;
      state.fetchStatus[key] = status;
      if (status === "success") {
        state.connectionError = null;
        localStorage.removeItem("connectionTimestamps");
      }
    },
    setError(state, action: PayloadAction<CustomError | null>) {
      state.connectionError = action.payload;
    },
    toggleTheme(state) {
      const previousValue = state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(!previousValue));
      state.isDarkMode = !previousValue;
      if (!previousValue) {
        state.colors.primary = "#2d483b";
        state.colors.secondary = "#082623";
        state.colors.tertiary = "#082623";
        state.colors.modal = "#082623";
        state.colors.supplement = "#f7fac3";
        state.colors.text = "#fbfddf";
      } else {
        state.colors.primary = "#e5e4e2";
        state.colors.secondary = "#dfdfd5";
        state.colors.tertiary = "#355a3b";
        state.colors.text = "#355a3b";
        state.colors.supplement = "#662c27";
        state.colors.modal = "#dfdfd5";
        state.colors.white = "#e5e4e2";
      }
    },
    toggleBackgroundMode(state) {
      const previousValue = state.isBackgroundMode;
      localStorage.setItem("isBackgroundMode", JSON.stringify(!previousValue));
      state.isBackgroundMode = !previousValue;
    },
    toggleNavVisibility(state) { 
      state.isNavVisible = !state.isNavVisible;
    },
    toggleNavWidth(state) {
      const previousValue = state.isNavWide;
      localStorage.setItem("isNavWide", JSON.stringify(!previousValue));
      state.isNavWide = !previousValue;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
