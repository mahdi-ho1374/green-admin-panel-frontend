import React, { FC, useEffect, useState } from "react";
import classes from "../Chart.module.css";
import {
  LineChart as MuiLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import createDomain from "../../../helpers/chart/createDomain";

interface LineChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string[];
  height?: string | number;
}

const LineChart: FC<LineChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  height,
}) => {
  const { colors: uiColors } = useAppSelector(({ ui }) => ui);
  const domain1 = createDomain(data, yDataKey[0]);
  const domain2 =
    yDataKey.length === 2
      ? createDomain(data, yDataKey[1])
      : { min: 1, max: 1 };

  return (
    <ResponsiveContainer width="99.9%" height={height || 300}>
      <MuiLineChart data={data}>
        <XAxis
          dataKey={xDataKey}
          padding={{ left: 30, right: 30 }}
          tick={{
            fill: uiColors.text,
            fontFamily: "'Lato',sans-serif",
            fontSize: "1.4rem",
          }}
          tickMargin={6}
          tickLine={{ stroke: uiColors.text, strokeWidth: 2 }}
          tickSize={5}
          axisLine={{ stroke: uiColors.text, strokeWidth: 2 }}
        />
        <YAxis
          yAxisId="left"
          tick={{
            fill: uiColors.text,
            fontFamily: "'Lato',sans-serif",
            fontSize: "1.4rem",
          }}
          padding={{ bottom: 15, top: 15 }}
          tickMargin={6}
          domain={[domain1.min, domain1.max]}
          tickLine={{ stroke: uiColors.text, strokeWidth: 2 }}
          axisLine={{ stroke: uiColors.text, strokeWidth: 2 }}
        />
        {yDataKey.length === 2 && (
          <YAxis
            yAxisId="right"
            orientation="right"
            padding={{ top: 15, bottom: 15 }}
            tick={{
              fill: uiColors.text,
              fontFamily: "'Lato',sans-serif",
              fontSize: "1.4rem",
            }}
            tickMargin={6}
            domain={[domain2.min, domain2.max]}
            tickLine={{ stroke: uiColors.text, strokeWidth: 2 }}
            axisLine={{ stroke: uiColors.text, strokeWidth: 2 }}
          />
        )}
        <Tooltip
          wrapperClassName={classes["chart__tooltip-wrapper"]}
          labelClassName={classes["chart__tooltip-label"]}
          contentStyle={{ color: uiColors.text }}
          itemStyle={{ color: uiColors.text }}
          cursor={false}
        />
        <Legend
          wrapperStyle={{
            fontFamily: "'Lato',sens-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={yDataKey[0]}
          stroke={uiColors.tertiary}
          fill={uiColors.white}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
        {yDataKey.length === 2 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={yDataKey[1]}
            stroke={uiColors.supplement}
            strokeOpacity={0.6}
            fill={uiColors.primary}
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        )}
      </MuiLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
