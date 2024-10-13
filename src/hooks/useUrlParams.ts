import { useEffect, useRef } from "react";
import { useAppDispatch } from "./useReduxHooks";
import { formActions } from "../store/slices/form";
import { Path } from "../types/form";
import type { SetURLSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import _ from "lodash";

interface UseUrlParamsProps {
  initialPath: string[];
  params: URLSearchParams;
  onSelectChange: SetURLSearchParams;
  entries: Record<string, string | number>;
  paramsPrefix: string;
}

const useUrlParams = ({
  initialPath,
  params,
  onSelectChange,
  entries,
  paramsPrefix,
}: UseUrlParamsProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const prevParams = useRef<URLSearchParams | null>(null);
  const prevEntries = useRef<Record<string, string | number>>({});
  const urlPath = location.pathname + location.search;
  const entriesJson = JSON.stringify(entries);

  useEffect(() => {
    const updatedEntries = {} as Record<string, any>;
    const adjustSelectValueWithUrl = (
      paramName: string,
      selectValue: string | number,
      path: Path
    ) => {
      const paramValue = Number(params.get(paramName)) || params.get(paramName);

      if (paramValue && paramValue !== selectValue) {
        dispatch(formActions.changeValue({ path, value: paramValue! }));
        return paramValue;
      }
      return selectValue;
    };
    if (!_.isEqual(params, prevParams.current)) {
      Object.entries(entries).forEach(([title, value]) => {
        if (value) {
          const newValue = adjustSelectValueWithUrl(
            `${paramsPrefix}${_.upperFirst(title)}`,
            value,
            [...initialPath, title]
          );
          updatedEntries[title] = newValue;
        }
      });
    }

    prevParams.current = params;
    prevEntries.current = { ...entries, ...updatedEntries };
  }, [urlPath]);

  useEffect(() => {
    const updateSearchParams = (
      paramName: string,
      selectValue: string | number
    ) => {
      params.get(paramName) !== String(selectValue) &&
        onSelectChange((params) => {
          params.set(paramName, String(selectValue));
          return params;
        });
    };

    if (!_.isEqual(entries, prevEntries.current)) {
      params.forEach((value, key) => {
        key.startsWith(paramsPrefix) &&
          key !== "chartEntry" &&
          !entries[key] &&
          params.delete(key);
      });
      Object.entries(entries).forEach(([title, value]) => {
        value &&
          updateSearchParams(`${paramsPrefix}${_.upperFirst(title)}`, value);
      });
    }
    prevParams.current = params;
    prevEntries.current = entries;
  }, [entriesJson]);
};

export default useUrlParams;
