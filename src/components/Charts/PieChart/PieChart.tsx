import React, { FC } from "react";
import classes from "../Chart.module.css";
import "../Chart.css";
import {
  PieChart as MuiPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useAppSelector } from "../../../hooks/useReduxHooks";

export interface PieChartProps {
  data: Record<string, any[]>;
  category: string;
  props: string[];
  percentageMode: boolean;
}

const PieChart: FC<PieChartProps> = ({
  data,
  category,
  props,
  percentageMode,
}) => {
  const uiColors = useAppSelector((state) => state.ui.colors);
  const COLORS = [
    uiColors.edit,
    uiColors.warning,
    uiColors.info,
    uiColors.error,
    uiColors.success,
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }: Record<string, any>) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={30}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {percentageMode ? `${(percent * 100).toFixed(0)}%` : value}
      </text>
    );
  };

  const totalValue =
    Object.keys(data).length !== 0
      ? data?.[props[0] as keyof typeof data].reduce(
          (total, item) =>
            (item[props[0] as keyof typeof item] as unknown as number) + total,
          0
        )
      : 0;

  return (
    <div className={classes["pieChart"]}>
      <ResponsiveContainer className={classes["pieChart__chart"]}>
        <MuiPieChart >
          <Pie
            data={data[props[0] as keyof typeof data]}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey={props[0]}
            innerRadius={100}
            outerRadius={210}
          >
            <Label
              value={totalValue}
              position="center"
              fontSize={30}
              fill="white"
            />

            {data?.[props[0] as keyof typeof data]?.map(
              (entry: any, index: number) => (
                  <Cell
                    key={`cell-${props[0]}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
              )
            )}
          </Pie>
          {props.length > 1 && (
            <Pie
              data={data[props[1] as keyof typeof data]}
              dataKey={props[1]}
              cx="50%"
              cy="50%"
              innerRadius={220}
              outerRadius={240}
              label
              labelLine={false}
            >
              {data?.[props[1] as keyof typeof data]?.map(
                (entry: any, index: number) => (
                    <Cell
                      key={`cell-${props[1]}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                )
              )}{" "}
            </Pie>
          )}
        </MuiPieChart>
      </ResponsiveContainer>
      <div className={classes["pieChart__legend"]}>
        {data?.[props[0]].map((item, index) => (
          <div key={item[category]} className={classes["pieChart__legend-item"]}>
            <span
              className={classes["pieChart__legend-icon"]}
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <span className={classes["pieChart__legend-text"]}>
              {item[category]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
