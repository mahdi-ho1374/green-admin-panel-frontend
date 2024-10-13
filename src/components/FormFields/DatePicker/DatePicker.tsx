import React, { FC, MouseEvent, useEffect } from "react";
import "./DatePicker.css";
import { DesktopDatePicker as MUIDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Path } from "../../../types/form";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import { formActions } from "../../../store/slices/form";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const customTheme = (theme: any) => {
  return createTheme({
    ...theme,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
            borderTopLeftRadius: "0",
            overflow: "hidden",
            marginTop: "3px",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
            overflow: "hidden",
            width: "150px",
            height: "40px",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            height: "40px",
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
            "&:hover": {
              border: "none",
              outline: "none",
            },
            "&:focus": {
              border: "none",
              outline: "none",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: "none",
            outline: "none",
            "&:hover": {
              border: "none",
              outline: "none",
            },
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
            "&:hover": {
              border: "none",
            },
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
          },
          switchViewIcon: {
            color: theme.palette.text.primary,
            fontSize: "14px",
            width: "30px",
            height: "30px",
          },
          label: {
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
          },
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
          },
          weekDayLabel: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
          },
          today: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
      MuiPickersYear: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
            },
          },
          yearButton: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.main,
            fontFamily: ["Lato", "sans-serif"].join(","),
            fontSize: "14px",
          },
        },
      },
    },
  });
};

interface DatePickerProps {
  min?: Date;
  max?: Date;
  path: Path;
  defaultValue: Date;
}

const DatePicker: FC<DatePickerProps> = ({ min, max, path, defaultValue }) => {
  const EMPTY_OBJECT = {};
  const { value, isExpanded } = useAppSelector(({ form }) =>
    path.reduce((value, prop) => value[prop] || EMPTY_OBJECT, form)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!value) {
      dispatch(
        formActions.initialize({ path, value: defaultValue.toISOString() })
      );
    }
  }, []);

  const mouseDownHandler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const setVisible = () => {
    dispatch(formActions.setExpanded(path));
  };

  const setInvisible = () => {
    dispatch(formActions.setCollapsed(path));
  };

  return (
    <div onMouseDown={mouseDownHandler}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={customTheme}>
          <MUIDatePicker
            onOpen={setVisible}
            open={isExpanded}
            onClose={setInvisible}
            className={isExpanded ? "date-picker--expanded" : ""}
            defaultValue={dayjs(defaultValue)}
            minDate={dayjs(min)}
            maxDate={dayjs(max)}
            value={dayjs(value)}
            onChange={(date: any) => {
              dispatch(
                formActions.changeValue({
                  path,
                  value: dayjs(date.$d).toISOString(),
                })
              );
            }}
          />
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
