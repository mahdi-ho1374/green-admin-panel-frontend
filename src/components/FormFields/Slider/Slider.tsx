import React, { FC, MouseEvent, useRef } from "react";
import MUISlider, { SliderValueLabelProps } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Path } from "../../../types/form";
import { useAppDispatch, useAppSelector } from "../../../hooks/useReduxHooks";
import { formActions } from "../../../store/slices/form";
import Tooltip from "../../Tooltip/ToolTip";
import "./Slider.css";

const ValueLabel: FC<SliderValueLabelProps> = (props) => {
  const { children, value } = props;
  const uiColors = useAppSelector((state) => state.ui.colors);

  return (
    <Tooltip
      enterTouchDelay={0}
      marginBottom="-30px"
      placement="top"
      title={value}
      backgroundColor={uiColors.primary}
      color={uiColors.text}
      fontSize={12}
      height={18}
      children={children}
    />
  );
};

const TableSlider = styled(MUISlider)(({ theme }) => {
  const uiColors = useAppSelector((state) => state.ui.colors);

  return {
    color: uiColors.text,
    height: 4,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 20,
      width: 20,
      backgroundColor: uiColors.text,
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
  };
});

export interface SliderProps {
  min: number;
  max: number;
  path: Path;
}

const Slider: FC<SliderProps> = ({ min, max, path }) => {
  const EMPTY_OBJECT = {};
  const { value } = useAppSelector(({ form }) =>
    path.reduce((value, prop) => value[prop] || EMPTY_OBJECT, form)
  );
  const dispatch = useAppDispatch();
  const sliderValue = value
    ?.split(",")
    ?.map((item: string) => Number(item)) || [min, max];

  const changeHandler = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "object") {
      dispatch(
        formActions.changeValue({
          path,
          value: `${newValue[0]},${newValue[1]}`,
        })
      );
    }
  };

  return (
    <Box sx={{ width: 200 }}>
      <TableSlider
        onChange={changeHandler}
        valueLabelDisplay="auto"
        slots={{
          valueLabel: ValueLabel,
        }}
        min={min}
        max={max}
        value={sliderValue}
      />
    </Box>
  );
};

export default Slider;
