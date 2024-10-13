import { Dispatch } from "@reduxjs/toolkit";
import { saleActions } from "../slices/sale";
import convertDecimalToNumber from "../../helpers/convertDecimalToNumber";
import convertNumberToMonth from "../../helpers/chart/convertNumberToMonth";
import type {
  MostSoldProduct,
  TopBuyer,
  Sale,
  TimeInfo,
} from "../../types/sale";
import sortChartData from "../../helpers/chart/sortChartData";
import connectionErrorHandler from "../../helpers/error/connectionErrorHandler";
import { uiActions } from "../slices/ui";

export const fetchSalesData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchSalesData", status: "loading" })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/sales/chart`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchSalesData");
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "fetchSalesData", status: "success" })
        );
        const data = (await response.json()) as Sale[];
        return data;
      }
    };
    try {
      const salesData = await getRequest();
      if (salesData) {
        const sortedSalesData = sortChartData(salesData);
        const transformedSalesData = sortedSalesData.map((sale: Sale) => {
          let transformedSale = {} as Sale;
          transformedSale = convertNumberToMonth(sale);
          transformedSale = convertDecimalToNumber(sale);
          return transformedSale;
        });
        dispatch(saleActions.setSales(transformedSalesData));
        return transformedSalesData;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchSalesData");
    }
  };
};

export const fetchTopBuyersData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchTopBuyersData", status: "loading" })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/sales/top-buyers`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchTopBuyersData");
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({
            key: "fetchTopBuyersData",
            status: "success",
          })
        );
        const data = (await response.json()) as TopBuyer[];
        return data;
      }
    };
    try {
      const topBuyers = await getRequest();
      if (topBuyers) {
        const sortedTopBuyers = sortChartData(topBuyers);
        const transformedTopBuyers = sortedTopBuyers.map((item) => {
          let transformedBestUser = {} as TopBuyer;
          transformedBestUser = convertNumberToMonth(item);
          transformedBestUser = convertDecimalToNumber(item);
          return transformedBestUser;
        });
        dispatch(saleActions.setTopBuyers(transformedTopBuyers));
        return transformedTopBuyers;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchTopBuyersData");
    }
  };
};

export const fetchMostSoldProductsData = () => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({
        key: "fetchMostSoldProductsData",
        status: "loading",
      })
    );
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/sales/most-sold-products`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchMostSoldProductsData");
      } else {
        dispatch(
          uiActions.setFetchStatus({
            key: "fetchMostSoldProductsData",
            status: "success",
          })
        );
        const data = (await response.json()) as MostSoldProduct[];
        return data;
      }
    };
    try {
      const mostSoldProducts = await getRequest();
      if (mostSoldProducts) {
        const sortedMostSoldProducts = sortChartData(mostSoldProducts);
        const transformedMostSoldProducts = sortedMostSoldProducts.map(
          (item) => {
            let transformedMostSoldProduct = {} as MostSoldProduct;
            transformedMostSoldProduct = convertNumberToMonth(item);
            transformedMostSoldProduct = convertDecimalToNumber(item);
            return transformedMostSoldProduct;
          }
        );
        dispatch(saleActions.setMostSoldProducts(transformedMostSoldProducts));
        return transformedMostSoldProducts;
      } else {
        return null;
      }
    } catch (err: any) {
      connectionErrorHandler(dispatch, "fetchMostSoldProductsData");
    }
  };
};
