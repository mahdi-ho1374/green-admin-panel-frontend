import { useEffect } from "react";

interface UseFormFieldCloseProps {
  onClose: () => void;
  exception: string;
  isExpanded: boolean;
}

const useElementClose = ({
  isExpanded,
  exception,
  onClose,
}: UseFormFieldCloseProps) => {
  useEffect(() => {
    const closeTooltip: EventListener = (e) => {
      if (
        (isExpanded && !(e.target as HTMLElement).closest(exception)) ||
        (isExpanded && e instanceof KeyboardEvent && e.key === "Escape")
      ) {
        onClose();
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

export default useElementClose;
