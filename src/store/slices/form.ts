import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type {
  ChangeValuePayload,
  FormState,
  InitializePayload,
  Path,
  UrlDataPayload,
} from "../../types/form";
import convertPathToString from "../../helpers/convertPathToString";
import _ from "lodash";

const initialState: FormState = {};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    initialize(state, action: PayloadAction<InitializePayload>) {
      const { path, value, url } = action.payload;
      const clonedState = _.cloneDeep(state);
      path.reduce((item: any, prop: any, index: number, array: any) => {
        if (index === array.length - 1) {
          if (!item) {
            item = {};
          }
          item[prop] =
            path[1] === "accordion"
              ? { isExpanded: false }
              : { value, touched: false, isExpanded: false };
          return item[prop];
        }
        if (!item[prop]) {
          item[prop] = isNaN(Number(path[index + 1])) ? {} : [];
        }
        return item[prop];
      }, clonedState);
      if (url) {
        clonedState[path[0]].url = {
          ...clonedState?.[path[0]]?.url,
          [url]: { data: null, selectedData: null },
        };
      }
      return clonedState;
    },
    changeValue(state, action: PayloadAction<ChangeValuePayload>) {
      const { path, value } = action.payload;
      const stringPath = convertPathToString([...path, "value"]);
      _.set(state, stringPath, value);
    },
    changeTouched(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "touched"]);
      _.set(state, stringPath, true);
    },
    increaseNumber(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "value"]);
      _.update(state, stringPath, (value) => {
        return value + 1;
      });
    },
    decreaseNumber(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "value"]);
      _.update(state, stringPath, (value) => {
        return value - 1;
      });
    },
    toggleExpanded(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "isExpanded"]);
      _.update(state, stringPath, (value) => {
        return !value;
      });
    },
    saveData(state, action: PayloadAction<UrlDataPayload>) {
      const { url, data, path } = action.payload;
      state[path[0]].url[url]["data"] = data;
    },
    selectData(state, action: PayloadAction<UrlDataPayload>) {
      const { url, data, path } = action.payload;
      state[path[0]].url[url]["selectedData"] = data;
    },
    setExpanded(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "isExpanded"]);
      _.set(state, stringPath, true);
    },
    setCollapsed(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const stringPath = convertPathToString([...path, "isExpanded"]);
      _.set(state, stringPath, false);
    },
    changeFormValidity(state, action: PayloadAction<boolean>) {
      state.isFormValid = action.payload;
    },
    setCollapsedAll(state) {
      for (const key in state.accordion) {
        if (state.accordion.hasOwnProperty(key)) {
          state.accordion[key] = false;
        }
      }
    },
    deleteItem(state, action: PayloadAction<Path>) {
      const path = action.payload;
      const isDeleteFromArray = typeof path[path.length - 1] === "number";
      const stringPath = convertPathToString(
        isDeleteFromArray ? path.slice(0, -1) : path
      );
      isDeleteFromArray
        ? _.pullAt(_.get(state, stringPath), path[path.length - 1] as number)
        : _.unset(state, stringPath);
    },
    cleanForm(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const formActions = formSlice.actions;

export default formSlice;
