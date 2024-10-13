import { Dispatch } from "@reduxjs/toolkit";
import { genericActions } from "../slices/generi";
import convertDecimalToNumber from "../../helpers/convertDecimalToNumber";
import sweetAlert from "../../helpers/ui/sweetAlert";
import { SwalType } from "../../types/ui";
import {
  FetchDataArg,
  FetchedMainData,
  GenericChartData,
  GenericDocument,
  GenericKey,
  GenericMainData,
  MinMaxTuple,
} from "../../types/generic";
import formatTitle from "../../helpers/ui/formatTitle";
import sortCommentProps from "../../helpers/ui/sortCommentProps";
import { Comment } from "../../types/comment";
import createUrlPath from "../../helpers/url/createUrlPath";
import convertNumberToMonth from "../../helpers/chart/convertNumberToMonth";
import sortChartData from "../../helpers/chart/sortChartData";
import postDataErrorHandler from "../../helpers/error/postDataErrorHandler";
import { uiActions } from "../slices/ui";
import connectionErrorHandler from "../../helpers/error/connectionErrorHandler";
import _ from "lodash";

export const fetchMainData = (section: GenericKey, arg: FetchDataArg) => {
  const {
    currentPage,
    perPage = 30,
    sortField,
    sortBy,
    filterField,
    filterTerm,
    withinRange,
  } = arg;
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchMainData", status: "loading" })
    );

    const fetchData = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/admin${createUrlPath({
        page: section + "s",
        currentPage,
        params: {
          perPage,
          sortField,
          sortBy,
          filterField,
          filterTerm,
          withinRange,
        },
      })}`;
      const response = await fetch(url);
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchMainData");
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "fetchMainData", status: "success" })
        );
        const data = (await response.json()) as FetchedMainData;
        return data;
      }
    };
    try {
      const fetchedData = await fetchData();

      if (fetchedData) {
        const data = fetchedData?.data;
        const lastPage = fetchedData?.lastPage;
        let transformedData = data.map((document) => {
          const convertedDocument = convertDecimalToNumber(document);

          return convertedDocument;
        });
        if (section === "comment") {
          transformedData = (transformedData as Comment[]).map((document) =>
            sortCommentProps(document)
          );
        }

        dispatch(
          genericActions.setMainData({
            section: section,
            data: transformedData,
            lastPage,
            filterField,
            filterTerm,
            currentPage,
            perPage,
            sortField,
            sortBy,
            withinRange,
          })
        );

        return transformedData;
      } else {
        return null;
      }
    } catch (err) {
      connectionErrorHandler(dispatch, "fetchMainData");
    }
  };
};

export const fetchChartData = (section: GenericKey) => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchChartData", status: "loading" })
    );
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${section}s/chart`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchChartData");
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "fetchChartData", status: "success" })
        );
        const data = (await response.json()) as any[];
        return data;
      }
    };
    try {
      const data = (await fetchData()) as any[];
      if (data) {
        const sortedData = sortChartData(data);
        const transformedData: GenericChartData = sortedData.map((document) => {
          const transformedDocument = convertNumberToMonth(document);
          return convertDecimalToNumber(transformedDocument);
        });

        dispatch(
          genericActions.setChartData({
            section: section,
            data: transformedData,
          })
        );
        return transformedData;
      } else {
        return null;
      }
    } catch (err) {
      connectionErrorHandler(dispatch, "fetchChartData");
    }
  };
};

export const addData = (section: GenericKey, document: GenericDocument) => {
  return async (dispatch: Dispatch) => {
    dispatch(uiActions.setFetchStatus({ key: "addData", status: "loading" }));
    const postRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${section}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(document),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        postDataErrorHandler({ response, data });
        dispatch(uiActions.setFetchStatus({ key: "addData", status: "error" }));
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "addData", status: "success" })
        );
        dispatch(genericActions.toggleDataChanged(section));
        sweetAlert({
          type: SwalType.SUCCESS,
          title: `${formatTitle(section)} added`,
        });
        return data;
      }
    };
    try {
      const addedDocument = await postRequest();

      return addedDocument;
    } catch (err) {
      postDataErrorHandler({ response: null, data: null });
      dispatch(uiActions.setFetchStatus({ key: "addData", status: "error" }));
    }
  };
};

export const updateData = (section: GenericKey, document: GenericDocument) => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "updateData", status: "loading" })
    );
    const putRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${section}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(document),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        postDataErrorHandler({ response, data });
        dispatch(
          uiActions.setFetchStatus({ key: "updateData", status: "error" })
        );
        return null;
      } else {
        dispatch(
          uiActions.setFetchStatus({ key: "updateData", status: "success" })
        );
        dispatch(genericActions.toggleDataChanged(section));
        sweetAlert({
          type: SwalType.SUCCESS,
          title: `${formatTitle(section)} edited`,
        });
        return data;
      }
    };
    try {
      const updatedDocument = await putRequest();
      return updatedDocument;
    } catch (err) {
      postDataErrorHandler({ response: null, data: null });
      dispatch(
        uiActions.setFetchStatus({ key: "updateData", status: "error" })
      );
    }
  };
};

export const fetchSearchData = (section: GenericKey, term: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(
      uiActions.setFetchStatus({ key: "fetchSearchData", status: "loading" })
    );
    const searchRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${section}s/search?term=${term}`
      );
      if (!response.ok) {
        connectionErrorHandler(dispatch, "fetchSearchData");
        return;
      } else {
        dispatch(
          uiActions.setFetchStatus({
            key: "fetchSearchData",
            status: "success",
          })
        );
        const fetchedData = (await response.json()) as GenericMainData;
        return fetchedData;
      }
    };
    try {
      const searchData = await searchRequest();
      if (searchData) {
        let transformedSearchData = searchData.map((document) =>
          convertDecimalToNumber(document)
        );
        if (section === "comment") {
          transformedSearchData = (transformedSearchData as Comment[]).map(
            (document) => sortCommentProps(document)
          );
        }
        dispatch(
          genericActions.setSearchData({
            section,
            data: transformedSearchData,
            searchTerm: term,
          })
        );
        return transformedSearchData;
      } else {
        return null;
      }
    } catch (err) {
      connectionErrorHandler(dispatch, "fetchSearchData");
    }
  };
};

export const fetchMinMax = (genericKey: GenericKey, prop: string) => {
  return async (dispatch: Dispatch) => {
    const getRequest = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/${genericKey}s/minmax/${prop}`
      );
      if (!response.ok) {
        throw Error("Something went wrong");
      }
      const data = await response.json();
      return data;
    };
    try {
      const minmax = (await getRequest()) as MinMaxTuple;
      dispatch(
        genericActions.setMinMax({
          section: genericKey,
          prop,
          minmax,
        })
      );
    } catch (err) {}
  };
};
