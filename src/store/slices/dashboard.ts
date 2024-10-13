import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Totals,
  DashboardState,
  Last30DaysData,
  ChartData
} from "../../types/dashboard";

const initialState: DashboardState = {
  totals: null,
  last30Days: null,
  chartData: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTotalsData(state, action: PayloadAction<Totals>) {
      state.totals = action.payload;
    },
    setLast30DaysData(state, action: PayloadAction<Last30DaysData>) {
      state.last30Days = action.payload;
    },
    setChartData(state, action: PayloadAction<ChartData>) {
      state.chartData = action.payload;
    }
  },
});

export const dashboardActions = dashboardSlice.actions;

export default dashboardSlice;
