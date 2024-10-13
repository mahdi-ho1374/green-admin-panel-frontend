import { FC, ReactElement } from "react";
import { styled } from "@mui/material";
import MUISwitch from "@mui/material/Switch";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import { renderToStaticMarkup } from 'react-dom/server';
import type { UiState } from "../../../types/ui";
import { ActionCreator} from "@reduxjs/toolkit";

interface MaterialUISwitchProps {
  uncheckedElem: ReactElement;
  checkedElem: ReactElement;
}

interface MaterialUISwitchProps {
  uncheckedElem: ReactElement;
  checkedElem: ReactElement;
  checked: boolean;
  onChange: () => void; 
}

const MaterialUISwitch = styled(({ uncheckedElem, checkedElem, ...props }: MaterialUISwitchProps) => (
  <MUISwitch {...props} />
))(({ uncheckedElem, checkedElem }: MaterialUISwitchProps) => {
  const uiColors = useAppSelector((state) => state.ui.colors);
  const stringUncheckedIcon = encodeURIComponent(renderToStaticMarkup(uncheckedElem));
  const stringCheckedIcon = encodeURIComponent(renderToStaticMarkup(checkedElem));

  return {
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: uiColors.text,
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,${stringCheckedIcon}')`,
          color: uiColors.text},
          
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: uiColors.primary,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: uiColors.primary,
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,${stringUncheckedIcon}')`,
        fill: uiColors.text
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: uiColors.primary,
      borderRadius: 20 / 2,
    },
  };
});

interface SwitchProps {
  uncheckedIcon: ReactElement;
  checkedIcon: ReactElement;
  prop: string;
  action: ActionCreator<any>;
}

const Switch:FC<SwitchProps> = ({uncheckedIcon,checkedIcon,prop,action}) => {
  const isChecked = useAppSelector((state) => state.ui[prop as keyof UiState]);
  const dispatch = useAppDispatch();

  const toggleThemeHandler = () => {
    dispatch(action());
  };

  return (
    <MaterialUISwitch checked={isChecked as unknown as boolean} onChange={toggleThemeHandler} uncheckedElem={uncheckedIcon} checkedElem={checkedIcon} />
  );
};

export default Switch;
