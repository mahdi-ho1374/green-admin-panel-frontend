import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SortType } from "../../types/generic";
import {
  Product,
  AllowedSortProps as ProductSortProps,
  AllowedFilterProps as ProductFilterProps,
  ChartProduct,
} from "../../types/product";
import {
  Comment,
  AllowedSortProps as CommentSortProps,
  AllowedFilterProps as CommentFilterProps,
  ChartComment,
} from "../../types/comment";
import {
  Order,
  AllowedSortProps as OrderSortProps,
  AllowedFilterProps as OrderFilterProps,
  ChartOrder,
} from "../../types/order";
import {
  User,
  AllowedSortProps as UserSortProps,
  AllowedFilterProps as UserFilterProps,
  ChartUser,
} from "../../types/user";
import type {
  GenericKey,
  GenericState,
  GenericMainData,
  SetMainDataPayload,
  GenericChartData,
  GenericSort,
  View,
  GenericFilter,
  MinMaxTuple,
  SetChartDataPayload,
  SetSearchDataPayload,
} from "../../types/generic";

const initializeData = <T, S, P, W>(section: GenericKey) => {
  return {
    data: { main: null as T, chart: null as W, search: null as T },
    selectedDocumentId: "",
    lastPath: {
      all: `/${section}s/main/1`,
      chart: `/${section}s/chart`,
      main: `/${section}s/main/1`,
      card: `/${section}s/card/1`,
      search: "",
    },
    currentPage: 1,
    searchTerm: "",
    lastPage: 0,
    perPage: 30,
    sortField: "" as S,
    dataChanged: false,
    minmax: {},
    filterField: "" as P,
    filterTerm: "",
    withinRange: undefined,
  };
};

const initialState: GenericState = {
  user: initializeData<User[], UserSortProps, UserFilterProps, ChartUser[]>(
    "user"
  ),
  product: initializeData<
    Product[],
    ProductSortProps,
    ProductFilterProps,
    ChartProduct[]
  >("product"),
  order: initializeData<
    Order[],
    OrderSortProps,
    OrderFilterProps,
    ChartOrder[]
  >("order"),
  comment: initializeData<
    Comment[],
    CommentSortProps,
    CommentFilterProps,
    ChartComment[]
  >("comment"),
};

const genericSlice = createSlice({
  name: "generic",
  initialState: initialState,
  reducers: {
    setLastPath(
      state,
      action: PayloadAction<{
        section: GenericKey;
        path: string;
        view: "all" | View;
      }>
    ) {
      const { section, path, view } = action.payload;
      if (["main", "card"].includes(view)) {
        const paramsPart = path.split("/").slice(3).join("");

        state[section].lastPath.main = `/${section}s/main/${paramsPart}`;
        state[section].lastPath.card = `/${section}s/card/${paramsPart}`;
      } else {
        state[section].lastPath[view] = path;
      }
      state[section].lastPath.all = path;
    },
    setMainDataNull(state, action: PayloadAction<GenericKey>) {
      const section = action.payload;
      state[section].data.main = null;
    },
    selectDocumentId(
      state,
      action: PayloadAction<{ section: GenericKey; id: string }>
    ) {
      const { section, id } = action.payload;
      state[section].selectedDocumentId = id;
    },
    setMainData<
      T extends GenericMainData,
      S extends GenericSort,
      P extends GenericFilter
    >(state: any, action: PayloadAction<SetMainDataPayload<T, S, P>>) {
      const {
        data,
        lastPage,
        currentPage,
        perPage,
        section,
        withinRange,
        sortField,
        sortBy,
        filterField,
        filterTerm,
      } = action.payload;
      state[section].data.main = data;
      state[section] = {
        ...state[section],
        lastPage,
        currentPage,
        perPage,
        sortField,
        sortBy,
        filterTerm,
        filterField,
        withinRange,
      };
    },
    setChartData<W extends GenericChartData>(
      state: any,
      action: PayloadAction<SetChartDataPayload<W>>
    ) {
      const { section, data } = action.payload;
      state[section].data.chart = data;
    },
    setSearchData<T extends GenericMainData | null>(
      state: any,
      action: PayloadAction<SetSearchDataPayload<T>>
    ) {
      const { section, data, searchTerm } = action.payload;
      state[section].data.search = data;
      state[section].searchTerm = searchTerm;
    },
    toggleDataChanged(state, action: PayloadAction<GenericKey>) {
      const section = action.payload;
      state[section].dataChanged = !state[section].dataChanged;
    },
    setMinMax(
      state,
      action: PayloadAction<{
        section: GenericKey;
        prop: string;
        minmax: MinMaxTuple;
      }>
    ) {
      const { section, prop, minmax } = action.payload;
      state[section].minmax[prop] = minmax;
    },
  },
});

export const genericActions = genericSlice.actions;

export default genericSlice;
