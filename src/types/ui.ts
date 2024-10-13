export enum ModalType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  DETAILS = "details",
}

export type FetchStatus = "loading" | "error" | "success" | "";
export interface CustomError {
  title: string;
  status: number;
  message: string;
}

export interface UiState {
  showModal: boolean;
  modalType: ModalType | "";
  openedTooltipId: string;
  connectionError: null | CustomError;
  isDarkMode: boolean;
  isBackgroundMode: boolean;
  isNavVisible: boolean;
  isNavWide: boolean;
  fetchStatus: { [key: string]: FetchStatus };
  colors: {
    primary: string;
    secondary: string;
    supplement: string;
    tertiary: string;
    modal: string;
    text: string;
    white: string;
    success: string;
    error: string;
    info: string;
    warning: string;
    edit: string;
  };
}

export enum BtnType {
  ADD = "Add",
  EDIT = "Edit",
  DELETE = "Delete",
  DETAILS = "Details",
}

export enum SwalType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export enum ChartType {
  LINECHART = "lineChart",
  BARCHART = "barChart",
  AREACHART = "areaChart",
}

export enum TimeFrame {
  MONTH = "month",
  YEAR = "year",
}
