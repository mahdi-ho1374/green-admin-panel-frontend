import React, { FC } from "react";
import classes from "../Chart.module.css";
import {
  AreaChart as MuiAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import createDomain from "../../../helpers/chart/createDomain";

interface AreaChartProps {
  data: any;
  xDataKey: string;
  yDataKey: string[];
  height?: number | string;
}

const AreaChart: FC<AreaChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  height
}) => {
  const uiColors = useAppSelector(({ ui }) => ui.colors);
  const domain = createDomain(data, yDataKey[0]);

  return (
    <ResponsiveContainer
    width={"99.9%"}
    height={height || 400}
    >
      <MuiAreaChart data={data}>
        <XAxis
          dataKey={xDataKey}
          padding={{ right: 30 }}
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
          padding={{ top: 30 }}
          tick={{
            fill: uiColors.text,
            fontFamily: "'Lato',sans-serif",
            fontSize: "1.4rem",
          }}
          tickMargin={6}
          domain={[domain.min, domain.max]}
          tickLine={{ stroke: uiColors.text, strokeWidth: 2 }}
          axisLine={{ stroke: uiColors.text, strokeWidth: 2 }}
        />
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
        <Area
          type="monotone"
          dataKey={yDataKey[0]}
          stroke={uiColors.tertiary}
          fill={uiColors.tertiary}
          fillOpacity={0.5}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </MuiAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
