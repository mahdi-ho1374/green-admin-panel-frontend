import React, { FC } from "react";
import classes from "../Chart.module.css";
import {
  BarChart as MuiBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import createDomain from "../../../helpers/chart/createDomain";

interface BarChartProps {
  data: any;
  xDataKey: string;
  yDataKey: string[];
  height?: string | number;
}

const BarChart: FC<BarChartProps> = ({ data, xDataKey, yDataKey,height }) => {
  const uiColors = useAppSelector(({ ui }) => ui.colors);
  const domain1 = createDomain(data, yDataKey[0]);
  const domain2 =
    yDataKey.length === 2
      ? createDomain(data, yDataKey[1])
      : { min: 1, max: 1 };

  return (
    <ResponsiveContainer  
    width={"99.9%"}
    height={height || 400}
>
      <MuiBarChart data={data}>
        <YAxis
          yAxisId="left"
          padding={{ top: 30 }}
          tick={{
            fill: uiColors.text,
            fontFamily: "'Lato',sans-serif",
            fontSize: "1.4rem",
          }}
          tickMargin={6}
          domain={[domain1.min, domain1.max]}
          tickLine={{ stroke: uiColors.text, strokeWidth: 2 }}
          axisLine={{ stroke: uiColors.text, strokeWidth: 2 }}
        />
        {yDataKey.length === 2 && (
          <YAxis
            yAxisId="right"
            orientation="right"
            padding={{ top: 30 }}
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
          cursor={false}
        />
        <Legend
          wrapperStyle={{
            fontFamily: "'Lato',sens-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
          }}
        />
        <Bar
          yAxisId="left"
          type="monotone"
          maxBarSize={17}
          dataKey={yDataKey[0]}
          stroke={uiColors.tertiary}
          fill={uiColors.tertiary}
          fillOpacity={0.7}
          strokeLinejoin="round"
          strokeWidth={3}
        />
        {yDataKey.length === 2 && (
          <Bar
            yAxisId="right"
            type="monotone"
            dataKey={yDataKey[1]}
            stroke={uiColors.tertiary}
            strokeOpacity={0.5}
            fill={uiColors.tertiary}
            fillOpacity={0}
            strokeWidth={3}
          />
        )}
        <XAxis
          dataKey={xDataKey}
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
      </MuiBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
