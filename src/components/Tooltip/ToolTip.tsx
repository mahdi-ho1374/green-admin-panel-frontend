import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Tooltip as MuiTooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { TooltipProps as MuiTooltipProps } from "@mui/material";
import { useAppSelector } from "../../hooks/useReduxHooks";

type TooltipProps = MuiTooltipProps & {
  color: string;
  backgroundColor: string;
  fontSize: number;
  height?: number;
  width?: number;
  marginBottom?: string;
};

const Tooltip = styled(
  ({
    color,
    backgroundColor,
    fontSize,
    height,
    width,
    className,
    marginBottom,
    ...props
  }: TooltipProps) => (
    <MuiTooltip
      {...props}
      classes={{ popper: className }}
      open={props.open ?? undefined}
    />
  )
)(({ theme, color, backgroundColor, fontSize, width, height, marginBottom }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor,
      color,
      boxShadow: theme.shadows[1],
      fontSize,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: height || "auto",
      width: width || "auto",
      marginBottom: marginBottom || "6px",
      borderRadius: "10px",
    },
  };
});

export default Tooltip;
