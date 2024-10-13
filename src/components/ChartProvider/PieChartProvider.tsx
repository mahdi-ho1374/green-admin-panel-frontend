import React, { FC, useEffect } from "react";
import createSelectProps from "../../helpers/uiControls/createSelectProps";
import { useAppSelector, useAppDispatch } from "../../hooks/useReduxHooks";
import Select from "../FormFields/Select/Select";
import classes from "./ChartProvider.module.css";
import { BsInfoLg } from "react-icons/bs";
import _, { cloneDeep } from "lodash";
import PieChart from "../Charts/PieChart/PieChart";
import selectInfos from "../../helpers/chart/selectInfos";
import Tooltip from "../Tooltip/ToolTip";
import createPieChartData from "../../helpers/chart/createPieChartData";
import { type SetURLSearchParams } from "react-router-dom";
import useUrlParams from "../../hooks/useUrlParams";
import createKey from "../../helpers/createKey";
import useTooltipClose from "../../hooks/useTooltipClose";
import { uiActions } from "../../store/slices/ui";

const createPath = (starter: string[], props: string[]) => {
  const pathObject: Record<string, any> = {};
  props.forEach((prop) => (pathObject[prop] = [...starter, prop]));
  return pathObject as Record<string, (string | number)[]>;
};

export interface PieChartProviderProps {
  initialPath: string[];
  data: Record<string, any>[];
  keys: string[];
  category: string;
  params: URLSearchParams;
  onSelectChange: SetURLSearchParams;
  boxShadow?: boolean;
}

const PieChartProvider: FC<PieChartProviderProps> = ({
  initialPath,
  data,
  keys,
  category,
  params,
  onSelectChange,
  boxShadow = true,
}) => {
  const year = useAppSelector(
    ({ form }) =>
      Number(_.get(form, [...initialPath, "year", "value"])) ||
      _.get(form, [...initialPath, "year", "value"])
  );
  const content = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "content", "value"])
  );
  const month = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "month", "value"])
  );
  const accumulation = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "accumulation", "value"])
  );
  const accumulationRange = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "accumulationRange", "value"])
  );
  const valueMode = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "valueMode", "value"])
  );
  const { colors: uiColors, openedTooltipId } = useAppSelector(
    (state) => state.ui
  );
  const dispatch = useAppDispatch();

  useUrlParams({
    params,
    onSelectChange,
    initialPath,
    paramsPrefix: "chart",
    entries: {
      year,
      month,
      content,
      accumulation,
      accumulationRange,
      valueMode,
    },
  });

  useTooltipClose();

  const hasYear = "year" in data[0];
  const hasMonth = "month" in data[0];

  const path: Record<string, (string | number)[]> = createPath(initialPath, [
    "year",
    "content",
    "month",
    "accumulation",
    "accumulationRange",
    "valueMode",
  ]);

  const years = hasYear
    ? [...new Set(data.map((item) => item.year))].sort((a, b) => b - a)
    : [];
  const months = hasMonth
    ? [
        ...new Set(
          (year === "all"
            ? data
            : data.filter((item) => item.year === year)
          ).map((item) => item.month)
        ),
      ]
    : [];

  const yearsSelectProps =
    hasYear &&
    createSelectProps(
      accumulation === "discrete" ? [...years] : [...years, "all"],
      path.year
    );

  const monthsSelectProps =
    hasMonth &&
    createSelectProps(
      accumulation === "discrete" ? [...months] : [...months, "all"],
      path.month
    );
  const contentsSelectProps =
    keys.length > 1 && createSelectProps([...keys, "Both"], path.content);

  const accumulationSelectProps =
    hasMonth &&
    hasYear &&
    createSelectProps(["discrete", "cumulative"], path.accumulation);
  const accumulationRangeSelectProps =
    hasMonth &&
    hasYear &&
    createSelectProps(
      accumulation === "discrete"
        ? ["---"]
        : month !== "all" && year === "all"
        ? ["monthly"]
        : month !== "all" && year !== "all"
        ? ["allTime", "yearly", "monthly"]
        : month === "all" && year === "all"
        ? ["allTime"]
        : ["allTime", "yearly"],
      path.accumulationRange,
      accumulation === "discrete"
    );
  const valueModeSelectProps = createSelectProps(
    ["mainValues", "percentages"],
    path.valueMode
  );
  const selectsProps: Record<string, any> = {
    valueMode: valueModeSelectProps,
  };
  if (accumulationSelectProps) {
    selectsProps.accumulation = accumulationSelectProps;
  }
  if (contentsSelectProps) {
    selectsProps.content = contentsSelectProps;
  }
  if (monthsSelectProps) {
    selectsProps.month = monthsSelectProps;
  }
  if (yearsSelectProps) {
    selectsProps.year = yearsSelectProps;
  }
  if (accumulationRangeSelectProps) {
    selectsProps.accumulationRange = accumulationRangeSelectProps;
  }

  const chartData =
    !content && keys.length > 1
      ? {}
      : hasMonth && hasYear
      ? createPieChartData({
          data: cloneDeep(data),
          filter:
            !hasMonth && !hasYear
              ? {}
              : year === "all" && month === "all"
              ? {
                  month: data[data.length - 1].month,
                  year: years[0],
                }
              : { month, year },
          keys:
            keys.length < 2 ? [keys[0]] : content === "Both" ? keys : [content],
          accumulationRange:
            accumulation === "discrete" ? undefined : accumulationRange,
          category,
        })
      : data[0];

  return (
    <div
      className={`${classes["chartProvider__chart-container"]} ${classes["chartProvider__chart-container--pie"]}`}
      style={{
        boxShadow: boxShadow ? "rgba(0, 0, 0, 0.35) 0px 5px 15px" : "none",
      }}
    >
      <div className={classes["chartProvider__selects"]}>
        {Object.keys(selectsProps).map((key, index) => (
          <div
            className={classes["chartProvider__select"]}
            key={createKey(selectsProps[key].path)}
          >
            <Select {...selectsProps[key]} />
            <Tooltip
              title={selectInfos[key as keyof typeof selectInfos]}
              backgroundColor={uiColors.secondary}
              color={uiColors.text}
              fontSize={16}
              open={openedTooltipId === key}
              onClick={() =>
                dispatch(
                  uiActions.setOpenedTooltipId(
                    key === openedTooltipId ? "" : key
                  )
                )
              }
            >
              <div className="info" id={`tooltip-${key}`}>
                <BsInfoLg className="info__icon" />
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
      {Object.keys(chartData).length > 0 && (
        <div className={classes["chartProvider__pie-container"]}>
          <PieChart
            data={chartData}
            category={category}
            props={
              keys.length < 2
                ? [keys[0]]
                : content === "Both"
                ? keys
                : [content]
            }
            percentageMode={valueMode === "percentages"}
          />
        </div>
      )}
    </div>
  );
};

export default PieChartProvider;
