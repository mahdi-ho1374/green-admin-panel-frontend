import { Dispatch } from "@reduxjs/toolkit";
import type { Totals, Last30DaysData, ChartData } from "../../types/dashboard";
import { dashboardActions } from "../slices/dashboard";
import convertDecimalToNumber from "../../helpers/convertDecimalToNumber";
import connectionErrorHandler from "../../helpers/error/connectionErrorHandler";
import { uiActions } from "../slices/ui";

export const fetchTotalsData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchTotalsData", status: "loading" })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/dashboard/totals`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchTotalsData");
      } else {
        dispatch(
          uiActions.setFetchStatus({
            key: "fetchTotalsData",
            status: "success",
          })
        );
        const data = (await response.json()) as Totals;
        return data;
      }
    };
    try {
      const totalsData = await getRequest();
      if (totalsData) {
        const transformedTotalsData = convertDecimalToNumber(totalsData);
        dispatch(dashboardActions.setTotalsData(transformedTotalsData));
        return totalsData;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchTotalsData");
    }
  };
};

export const fetchLast30DaysData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({
        key: "fetchLast30DaysData",
        status: "loading",
      })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/dashboard/last30days`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchLast30DaysData");
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({
            key: "fetchLast30DaysData",
            status: "success",
          })
        );
        const data = (await response.json()) as Last30DaysData;

        return data;
      }
    };
    try {
      const data = await getRequest();

      if (data) {
        const transformedData = Object.entries(data).reduce(
          (transformedData, [key, value]) => {
            const transformedValue = value.map((item: any) =>
              convertDecimalToNumber(item)
            );
            transformedData[key as keyof Last30DaysData] = transformedValue;
            return transformedData;
          },
          {} as Last30DaysData
        );
        dispatch(dashboardActions.setLast30DaysData(transformedData));

        return transformedData;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchLast30DaysData");
    }
  };
};
export const fetchChartData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchChartData", status: "loading" })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/dashboard/chart`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchChartData");
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "fetchChartData", status: "success" })
        );
        const data = (await response.json()) as ChartData;
        return data;
      }
    };
    try {
      const data = await getRequest();
      if (data) {
        const transformedData = Object.entries(data).reduce(
          (transformedData, [key, value]) => {
            const transformedValue = value.map((item: any) =>
              convertDecimalToNumber(item)
            );
            transformedData[key as keyof ChartData] = transformedValue;
            return transformedData;
          },
          {} as ChartData
        );
        dispatch(dashboardActions.setChartData(transformedData));
        return transformedData;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchChartData");
    }
  };
};
