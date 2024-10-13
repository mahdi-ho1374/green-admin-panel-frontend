import React, { FC, useEffect } from "react";
import createSelectProps from "../../../helpers/uiControls/createSelectProps";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import Select from "../../FormFields/Select/Select";
import classes from "./BestItem.module.css";
import _ from "lodash";
import type { SetURLSearchParams } from "react-router-dom";
import useUrlParams from "../../../hooks/useUrlParams";

const createPath = (initial: string[], props: string[]) => {
  const pathObject: Record<string, any> = {};
  props.forEach((prop) => (pathObject[prop] = [...initial, prop]));
  return pathObject;
};

export interface BestItemProps {
  initialPath: string[];
  data: any[];
  title: string;
  keys: string[];
  params: URLSearchParams;
  onSelectChange: SetURLSearchParams;
}

const BestItem: FC<BestItemProps> = ({
  initialPath,
  data,
  keys,
  title,
  params,
  onSelectChange,
}) => {
  const month = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "month", "value"])
  );
  const year = useAppSelector(
    ({ form }) =>
      Number(_.get(form, [...initialPath, "year", "value"])) ||
      _.get(form, [...initialPath, "year", "value"])
  );
  const content = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "content", "value"])
  );

  useUrlParams({
    params,
    onSelectChange,
    entries: { content, month, year },
    paramsPrefix: initialPath[initialPath.length - 1],
    initialPath,
  });

  const path = createPath(initialPath, ["year", "month", "content"]);

  const years = [...new Set(data.map((item) => item.year))].sort(
    (a, b) => b - a
  );

  const months = data
    .filter((item) => item.year === year)
    .map((item) => item.month);

  const monthSelectProps = createSelectProps(months, path.month);
  const yearSelectProps = createSelectProps(years, path.year);
  const contentSelectProps = createSelectProps(keys, path.content);
  const selectProps = [yearSelectProps, monthSelectProps, contentSelectProps];

  const selectedItem =
    year &&
    month &&
    content &&
    data.filter((item) => item.year === year && item.month === month)[0][
      content
    ];

  return (
    <div className={classes["bestItem"]}>
      <h2 className={classes["bestItem__title"]}>{title}</h2>
      <div className={classes["bestItem__selects"]}>
        {selectProps.map((selectProp, index) => (
          <Select key={selectProp.initialValue + "-" + index} {...selectProp} />
        ))}
      </div>
      <div className={classes["bestItem__content"]}>
        {selectedItem &&
          Object.keys(selectedItem)
            .filter((prop) => prop !== "_id")
            .map((prop) => (
              <div
                className={classes["bestItem__prop-value"]}
                key={
                  title + prop + selectedItem[prop as keyof typeof selectedItem]
                }
              >
                {prop !== "name" && prop !== "username" && prop + ":"}
                <span className={classes["bestItem__prop"]}>
                  {prop === "revenue" ? "$" : ""}
                  {""}
                  {selectedItem[prop as keyof typeof selectedItem]}
                </span>
              </div>
            ))}
      </div>
      <svg
        className={classes["bestItem__icon"]}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M 12.03125 2 C 8.18025 2 5.03125 5.14 5.03125 9 C 5.03125 10.198 5.344 11.3255 5.875 12.3125 L 2 19 L 5.59375 18.78125 L 7.1875 22 L 10.75 15.875 C 11.166 15.952 11.59325 16 12.03125 16 C 12.45625 16 12.846 15.948 13.25 15.875 L 16.8125 22 L 18.40625 18.78125 L 22 19 L 18.15625 12.34375 C 18.69925 11.34875 19 10.213 19 9 C 19 5.14 15.88225 2 12.03125 2 z M 12 4 C 14.748 4 17 6.243 17 9 C 17 11.757 14.77925 14 12.03125 14 C 9.28325 14 7.03125 11.757 7.03125 9 C 7.03125 6.243 9.252 4 12 4 z M 11.5 5 C 11.5 6.103 10.603 7 9.5 7 L 9.5 9 C 10.232 9 10.909 8.7815 11.5 8.4375 L 11.5 13 L 13.5 13 L 13.5 5 L 11.5 5 z" />
      </svg>
    </div>
  );
};

export default BestItem;
