import React, { FC } from "react";
import { TimeFrame, ChartType } from "../../types/ui";
import createSelectProps from "../../helpers/uiControls/createSelectProps";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import Select from "../FormFields/Select/Select";
import classes from "./ChartProvider.module.css";
import { BsInfoLg } from "react-icons/bs";
import createChartData from "../../helpers/chart/createChartData";
import _, { cloneDeep } from "lodash";
import AreaChart from "../Charts/AreaChart/AreaChart";
import LineChart from "../Charts/LineChart/LineChart";
import BarChart from "../Charts/BarChart/BarChart";
import selectInfos from "../../helpers/chart/selectInfos";
import Tooltip from "../Tooltip/ToolTip";
import createKey from "../../helpers/createKey";
import { SetURLSearchParams } from "react-router-dom";
import useUrlParams from "../../hooks/useUrlParams";
import { uiActions } from "../../store/slices/ui";
import useTooltipClose from "../../hooks/useTooltipClose";
import formatTitle, {
  formatObjectProperties,
} from "../../helpers/ui/formatTitle";

const createPath = (starter: string[], props: string[]) => {
  const pathObject: Record<string, any> = {};
  props.forEach((prop) => (pathObject[prop] = [...starter, prop]));
  return pathObject;
};

export interface MixedChartProviderProps {
  initialPath: string[];
  data: Record<string, any>[];
  keys: string[];
  params: URLSearchParams;
  onSelectChange: SetURLSearchParams;
  heights?: [string | number, string | number];
  boxShadow?: boolean;
  aspect?: boolean;
}

const MixedChartProvider: FC<MixedChartProviderProps> = ({
  initialPath,
  data,
  keys,
  params,
  onSelectChange,
  heights = [undefined, undefined],
  boxShadow = true,
}) => {
  const view = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "view", "value"])
  );
  const year = useAppSelector(
    ({ form }) =>
      Number(_.get(form, [...initialPath, "year", "value"])) ||
      _.get(form, [...initialPath, "year", "value"])
  );
  const timeFrame = useAppSelector(({ form }) =>
    _.get(form, [...initialPath, "timeFrame", "value"])
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
  const { colors: uiColors, openedTooltipId } = useAppSelector(
    (state) => state.ui
  );
  const dispatch = useAppDispatch();
  useUrlParams({
    params,
    onSelectChange,
    entries: {
      content: keys.length > 1 ? content : undefined,
      timeFrame,
      month,
      year,
      view,
      accumulation,
      accumulationRange,
    },
    paramsPrefix: "chart",
    initialPath,
  });

  useTooltipClose();

  const hasYear = "year" in data[0];
  const hasMonth = "month" in data[0];

  const path = createPath(initialPath, [
    "year",
    "view",
    "content",
    "timeFrame",
    "month",
    "accumulation",
    "accumulationRange",
  ]);

  const years = hasYear
    ? [...new Set(data.map((item) => item.year))].sort((a, b) => b - a)
    : [];
  const months = hasMonth ? [...new Set(data.map((item) => item.month))] : [];

  const yearsSelectProps =
    hasYear && createSelectProps([...years!, "all"], path.year);
  const viewsSelectProps = createSelectProps(
    Object.values(ChartType),
    path.view
  );
  const timeFrameSelectProps =
    hasYear &&
    hasMonth &&
    createSelectProps(
      year !== "all"
        ? ["month"]
        : year === "all" && month !== "---"
        ? ["year"]
        : Object.values(TimeFrame),
      path.timeFrame,
      year !== "all" || month !== "---"
    );
  const monthsSelectProps =
    hasMonth &&
    createSelectProps(
      year !== "all" ? ["---"] : ["---", ...months!],
      path.month,
      year !== "all"
    );
  const contentsSelectProps =
    keys.length > 1 &&
    createSelectProps(
      view === ChartType.AREACHART ? [...keys] : [...keys, "Both"],
      path.content
    );
  const accumulationSelectProps = createSelectProps(
    ["discrete", "cumulative"],
    path.accumulation
  );
  const accumulationRangeSelectProps =
    hasYear &&
    hasMonth &&
    createSelectProps(
      !(year === "all" && month === "---" && accumulation === "cumulative")
        ? (accumulation === "discrete" ? ["---"] : [])
            .concat(accumulation === "cumulative" ? ["allTime", "yearly"] : [])
            .concat((months as any[]).includes(month) ? ["monthly"] : [])
        : timeFrame === "month"
        ? ["---"]
        : ["allTime"],
      path.accumulationRange,
      accumulation === "discrete" || (year === "all" && month === "---")
    );

  const selectsProps: Record<string, any> = {
    view: viewsSelectProps,
  };
  if (timeFrameSelectProps) {
    selectsProps.timeFrame = timeFrameSelectProps;
  }
  if (yearsSelectProps) {
    selectsProps.year = yearsSelectProps;
  }
  if (monthsSelectProps) {
    selectsProps.month = monthsSelectProps;
  }
  if (contentsSelectProps) {
    selectsProps.content = contentsSelectProps;
  }
  if (accumulationSelectProps) {
    selectsProps.accumulation = accumulationSelectProps;
  }
  if (accumulationRangeSelectProps) {
    selectsProps.accumulationRange = accumulationRangeSelectProps;
  }

  const chartData = createChartData({
    data: cloneDeep(data),
    filter: ![undefined, "---"].includes(month)
      ? { month }
      : years!.includes(year)
      ? { year: year }
      : undefined,
    accumulateKey: hasMonth ? timeFrame : "day",
    keys: keys.length < 2 ? [keys[0]] : content === "Both" ? keys : [content],
    accumulation,
    accumulationRange:
      accumulation === "discrete" ? undefined : accumulationRange || "allTime",
  });

  chartData.data =
    chartData.data.length &&
    chartData.data.every((item) => typeof item === "object")
      ? chartData.data.map((item) => {
          if ("createdAt" in item) {
            item.newEntries = item.createdAt;
            delete item.createdAt;
          }

          return formatObjectProperties(item);
        })
      : [];

  chartData.yDataKey = chartData.yDataKey.length
    ? chartData.yDataKey.map((title) =>
        title === "createdAt" ? formatTitle("newEntries") : formatTitle(title)
      )
    : [];
  chartData.xDataKey = chartData.xDataKey
    ? formatTitle(chartData.xDataKey)
    : "";

  return (
    <div
      style={{
        height: heights[0] || "500px",
        boxShadow: boxShadow ? "rgba(0, 0, 0, 0.35) 0px 5px 15px" : "none",
      }}
      className={`${classes["chartProvider__chart-container"]} ${classes["chartProvider__chart-container--mixed"]}`}
    >
      <div className={classes["chartProvider__selects"]}>
        {Object.keys(selectsProps).map((key) => (
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
      <div className={classes["chartProvider__mixed-container"]}>
        {chartData && view === ChartType.LINECHART && (
          <LineChart {...chartData} height={heights[1]} />
        )}
        {chartData && view === ChartType.AREACHART && (
          <AreaChart {...chartData} height={heights[1]} />
        )}
        {chartData && view === ChartType.BARCHART && (
          <BarChart {...chartData} height={heights[1]} />
        )}{" "}
      </div>
    </div>
  );
};

export default MixedChartProvider;
