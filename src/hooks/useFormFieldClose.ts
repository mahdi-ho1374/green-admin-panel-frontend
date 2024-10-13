import { useEffect } from "react";
import { useAppDispatch } from "./useReduxHooks";
import { formActions } from "../store/slices/form";
import { Path } from "../types/form";

interface UseFormFieldCloseProps {
  path: Path;
  exception: string;
  isExpanded: boolean;
}

const useFormFieldClose = ({
  isExpanded,
  exception,
  path,
}: UseFormFieldCloseProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const closeTooltip: EventListener = (e) => {
      if (
        (isExpanded && !(e.target as HTMLElement).closest(exception)) ||
        (isExpanded && e instanceof KeyboardEvent && e.key === "Escape")
      ) {
        dispatch(formActions.setCollapsed(path));
      }
    };

    document.addEventListener("click", closeTooltip);
    document.addEventListener("keydown", closeTooltip);

    return () => {
      document.removeEventListener("click", closeTooltip);
      document.removeEventListener("keydown", closeTooltip);
    };
  }, [isExpanded]);
};

export default useFormFieldClose;
