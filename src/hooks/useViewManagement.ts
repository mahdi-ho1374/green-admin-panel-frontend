import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { genericActions } from "../store/slices/generi";
import {
  Params,
  SetURLSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { GenericKey, GenericMainData, View } from "../types/generic";
import { formActions } from "../store/slices/form";
import type { Path } from "../types/form";
import { uiActions } from "../store/slices/ui";

export interface UseViewManagementProps {
  section: GenericKey;
  view: View;
  path: Path;
  dataChanged: null | boolean;
  setParams: SetURLSearchParams;
  params: URLSearchParams;
  searchData: GenericMainData | null;
}

const useViewManagement = ({
  section,
  path,
  view,
  dataChanged,
  setParams,
  searchData,
  params,
}: UseViewManagementProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = location.pathname;
  const search = location.search;
  const urlPath = pathname + search;
  const viewParam = location.pathname.includes("chart")
    ? "chart"
    : pathname.includes("search")
    ? "search"
    : pathname.includes("card")
    ? "card"
    : "main";

  const { lastPath, data, perPage } = useAppSelector(
    (state) => state.generic?.[section]
  );
  const {
    main: lastMainPath,
    chart: lastChartPath,
    search: lastSearchPath,
    card: lastCardPath,
  } = lastPath;

  useEffect(() => {
    dispatch(
      genericActions.setLastPath({
        section,
        view: viewParam,
        path: urlPath,
      })
    );

    view !== viewParam &&
      dispatch(formActions.changeValue({ path, value: viewParam }));
  }, [urlPath]);

  useEffect(() => {
    if (view && !String(urlPath).includes(view)) {
      navigate(
        view === "main"
          ? lastMainPath
          : view === "chart"
          ? lastChartPath
          : view === "card"
          ? lastCardPath
          : lastSearchPath
      );
    }
  }, [view]);

  useEffect(() => {
    view === "search" &&
      searchData &&
      searchData.length > perPage &&
      !params.get("currentPage") &&
      setParams(
        (searchParams) => {
          searchParams.set("currentPage", "1");
          return params;
        },
        { replace: true }
      );
  }, [lastSearchPath]);

  useEffect(() => {
    if (dataChanged) {
      dispatch(formActions.cleanForm(section));
      dispatch(uiActions.toggleModal());
      navigate(urlPath, { replace: true });
      dispatch(genericActions.toggleDataChanged(section));
      view === "search" &&
        dispatch(
          genericActions.setSearchData({ section, data: null, searchTerm: "" })
        );
    }
  }, [dataChanged]);
};

export default useViewManagement;
