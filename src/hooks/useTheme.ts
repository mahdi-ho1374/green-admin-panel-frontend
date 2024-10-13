import { useAppSelector } from "./useReduxHooks";
import { createTheme } from "@mui/material/styles";


const useTheme = () => {
  const uiColors = useAppSelector((state) => state.ui.colors);

  const theme = createTheme({
    palette: {
      primary: {main: uiColors.primary},
      secondary: {main: uiColors.secondary},
      text: {primary: uiColors.text},
    },
  });

  return theme;
};

export default useTheme;
