import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { uiActions } from "../store/slices/ui";

const useGeneralStyles = (pageId: string) => {
  const { isDarkMode, isBackgroundMode, isNavWide, isNavVisible } =
    useAppSelector((state) => state.ui);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement!.classList.add("dark-mode");
      document.documentElement!.classList.remove("light-mode");
    } else {
      document.documentElement!.classList.remove("dark-mode");
      document.documentElement!.classList.add("light-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    isBackgroundMode
      ? document.body.classList.add("background-mode")
      : document.body.classList.remove("background-mode");
  }, [isBackgroundMode]);

  useEffect(() => {
    if (isNavWide) {
      document.documentElement!.classList.add("wide-nav");
      document.documentElement!.classList.remove("narrow-nav");
    } else {
      document.documentElement!.classList.add("narrow-nav");
      document.documentElement!.classList.remove("wide-nav");
    }
  }, [isNavWide]);

  useEffect(() => {
    const navVisibilityHandler = () => {
      if (window.innerWidth < 992 && isNavVisible) {
        dispatch(uiActions.toggleNavVisibility());
      }
    };

    window.addEventListener("resize", navVisibilityHandler);

    if (!isNavVisible) {
      document.documentElement!.classList.add("nonVisible-nav");
      document.documentElement!.classList.remove("narrow-nav");
      document.documentElement!.classList.remove("wide-nav");
      document.getElementById(pageId)!.classList.remove("blur-body");
    } else {
      if (window.innerWidth < 992) {
        document.getElementById(pageId)!.classList.add("blur-body");
      }
      document.documentElement!.classList.remove("nonVisible-nav");
      isNavWide
        ? document.documentElement!.classList.add("wide-nav")
        : document.documentElement!.classList.add("narrow-nav");
    }

    return () => {
      window.removeEventListener("resize", navVisibilityHandler);
    };
  }, [isNavVisible]);
};

export default useGeneralStyles;
