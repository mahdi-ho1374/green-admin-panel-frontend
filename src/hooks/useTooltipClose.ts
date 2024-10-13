import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { uiActions } from "../store/slices/ui";

const useTooltipClose = () => {
  const openedTooltipId = useAppSelector((state) => state.ui.openedTooltipId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const closeTooltip: EventListener = (e) => {
      if (
        (openedTooltipId &&
          !(e.target as HTMLElement).closest(".info") &&
          !(e.target as HTMLElement).closest(".MuiTooltip-popper")) ||
        (openedTooltipId && e instanceof KeyboardEvent && e.key === "Escape")
      ) {
        dispatch(uiActions.setOpenedTooltipId(""));
      }
    };

    document.addEventListener("click", closeTooltip);
    document.addEventListener("keydown", closeTooltip);

    return () => {
      document.removeEventListener("click", closeTooltip);
      document.removeEventListener("keydown", closeTooltip);
    };
  }, []);
};

export default useTooltipClose;
