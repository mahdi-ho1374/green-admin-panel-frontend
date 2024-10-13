import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sales from "./pages/Sales/Sales";
import Settings from "./pages/Settings/Settings";
import { Params, RouteObject, defer } from "react-router-dom";
import {
  fetchChartData,
  fetchMainData,
  fetchSearchData,
} from "./store/actions/generic";
import {
  fetchChartData as fetchDashboardChartData,
  fetchLast30DaysData,
  fetchTotalsData,
} from "./store/actions/dashboard";
import store from "./store";
import { allowedSortProps as UserAllowedSortProps } from "./types/user";
import { allowedSortProps as productAllowedSortProps } from "./types/product";
import { allowedSortProps as orderAllowedSortProps } from "./types/order";
import { allowedSortProps as commentAllowedSortProps } from "./types/comment";
import { allowedFilterProps as UserAllowedFilterProps } from "./types/user";
import { allowedFilterProps as productAllowedFilterProps } from "./types/product";
import { allowedFilterProps as orderAllowedFilterProps } from "./types/order";
import { allowedFilterProps as commentAllowedFilterProps } from "./types/comment";
import { GenericKey, sortType, type SortType } from "./types/generic";
import { fetchUrlValidate } from "./helpers/url/validateFetchUrl";
import Error from "./pages/Error/Error";
import {
  fetchMostSoldProductsData,
  fetchTopBuyersData,
  fetchSalesData,
} from "./store/actions/sale";
import Generic from "./pages/Generic/Generic";

const dispatch = store.dispatch;

const allowedSortProp = {
  user: UserAllowedSortProps,
  product: productAllowedSortProps,
  order: orderAllowedSortProps,
  comment: commentAllowedSortProps,
};

const allowedFilterProp = {
  user: UserAllowedFilterProps,
  product: productAllowedFilterProps,
  order: orderAllowedFilterProps,
  comment: commentAllowedFilterProps,
};

const mainDataLoader = (
  params: Params,
  request: Request,
  genericKey: GenericKey
) => {
  const currentPage = Number(params.currentPage);
  const parameters = new URLSearchParams(request.url);
  const perPage = Number(parameters.get("perPage") ?? 30);
  const sortField = parameters.get("sortField")?.trim().toLowerCase();
  const sortBy = parameters.get("sortBy")?.trim().toLowerCase();
  const filterField = parameters.get("filterField")?.trim().toLowerCase();
  const filterTerm = parameters.get("filterTerm")?.trim().toLowerCase();
  let withinRange: boolean | string | undefined = parameters
    .get("withinRange")
    ?.trim()
    .toLowerCase();
  if (isNaN(Number(currentPage))) {
    throw {
      status: 404,
      title: "Page not found",
      message: `Invalid page number: ${params.currentPage}`,
    };
  }
  if (withinRange === "true") {
    withinRange = true;
  }
  if (withinRange === "false") {
    withinRange = false;
  }
  fetchUrlValidate({
    allowedSortProps:
      allowedSortProp[genericKey as keyof typeof allowedSortProp],
    allowedFilterProps:
      allowedFilterProp[genericKey as keyof typeof allowedFilterProp],
    parameters,
  });
  const sortProp = (
    allowedSortProp[genericKey as keyof typeof allowedSortProp] as Record<
      string,
      any
    >
  )[sortField!];
  const typeProp: SortType = sortType[sortBy as keyof typeof sortType];
  const filterProp = (
    allowedFilterProp[genericKey as keyof typeof allowedFilterProp] as Record<
      string,
      any
    >
  )[filterField!];
  const genericState = store.getState().generic;
  const uiState = store.getState().ui;
  const dataChanged = genericState?.[genericKey]?.dataChanged;
  const lastPathObj = genericState?.[genericKey]?.lastPath;
  const lastPath = request.url.includes("main")
    ? lastPathObj.main
    : lastPathObj.card;
  const url = new URL(request.url);
  const currentPath = url.pathname + url.search;
  const mainData = genericState?.[genericKey]?.data?.main;
  const fetchStatus = uiState.fetchStatus.fetchMainData;

  return defer({
    fetchedData:
      dataChanged ||
      currentPath !== lastPath ||
      !mainData ||
      fetchStatus === "error"
        ? dispatch(
            fetchMainData(genericKey, {
              currentPage,
              perPage,
              sortField: sortProp,
              sortBy: typeProp,
              filterField: filterProp,
              filterTerm,
              withinRange: withinRange as boolean | undefined,
            })
          )
        : mainData,
  });
};

const chartDataLoader = (genericKey: GenericKey) => {
  const genericState = store.getState().generic;
  return defer({
    fetchedChartData:
      genericState?.[genericKey as GenericKey]?.data?.chart ||
      dispatch(fetchChartData(genericKey)),
  });
};

const dashboardDataLoader = () => {
  const dashboardState = store.getState().dashboard;
  const {
    fetchLast30DaysData: fetchLast30DaysStatus,
    fetchChartData: fetchChartStatus,
    fetchTotalsData: fetchTotalsStatus,
  } = store.getState().ui.fetchStatus;

  return defer({
    fetchedChartData: ["loading", "success"].includes(fetchChartStatus)
      ? dashboardState.chartData
      : dispatch(fetchDashboardChartData()),
    fetchedLast30Days: ["loading", "success"].includes(fetchLast30DaysStatus)
      ? dashboardState.last30Days
      : dispatch(fetchLast30DaysData()),
    fetchedTotals: ["loading", "success"].includes(fetchLast30DaysStatus)
      ? dashboardState.totals
      : dispatch(fetchTotalsData()),
  });
};

const salesDataLoader = () => {
  const saleState = store.getState().sale;
  return defer({
    fetchedSales: saleState.sales || dispatch(fetchSalesData()),
    fetchedTopBuyers: saleState.topBuyers || dispatch(fetchTopBuyersData()),
    fetchedMostSoldProducts:
      saleState.mostSoldProducts || dispatch(fetchMostSoldProductsData()),
  });
};

const searchDataLoader = (request: Request, genericKey: GenericKey) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term") || "";
  const { data, searchTerm: lastTerm } = store.getState().generic?.[genericKey];
  const searchData = data.search;

  return defer({
    fetchedSearchData:
      term !== lastTerm
        ? dispatch(fetchSearchData(genericKey, term))
        : searchData,
  });
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <Error />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardDataLoader,
      },
      {
        path: "users/search",
        element: <Generic />,
        loader: ({ params, request }) => searchDataLoader(request, "user"),
      },
      {
        path: "users/main/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "user"),
      },
      {
        path: "users/card/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "user"),
      },
      {
        path: "users/chart",
        element: <Generic />,
        loader: ({ params, request }) => chartDataLoader("user"),
      },
      {
        path: "products/search",
        element: <Generic />,
        loader: ({ params, request }) => searchDataLoader(request, "product"),
      },
      {
        path: "products/main/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "product"),
      },
      {
        path: "products/card/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "product"),
      },
      {
        path: "products/chart",
        element: <Generic />,
        loader: ({ params, request }) => chartDataLoader("product"),
      },
      {
        path: "orders/search",
        element: <Generic />,
        loader: ({ params, request }) => searchDataLoader(request, "order"),
      },
      {
        path: "orders/chart",
        element: <Generic />,
        loader: ({ params, request }) => chartDataLoader("order"),
      },
      {
        path: "orders/main/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "order"),
      },
      {
        path: "orders/card/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "order"),
      },
      {
        path: "comments/search",
        element: <Generic />,
        loader: ({ params, request }) => searchDataLoader(request, "comment"),
      },
      {
        path: "comments/main/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "comment"),
      },
      {
        path: "comments/card/:currentPage",
        element: <Generic />,
        loader: ({ params, request }) =>
          mainDataLoader(params, request, "comment"),
      },
      {
        path: "comments/chart",
        element: <Generic />,
        loader: ({ params, request }) => chartDataLoader("comment"),
      },
      { path: "sales", element: <Sales />, loader: salesDataLoader },

      { path: "settings", element: <Settings /> },
    ],
  },
];

export default routes;
