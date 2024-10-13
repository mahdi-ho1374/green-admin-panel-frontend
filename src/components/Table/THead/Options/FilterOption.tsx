import React, { FC, MouseEvent } from "react";
import Slider from "../../../FormFields/Slider/Slider";
import CheckBox from "../../../FormFields/CheckBox/CheckBox";
import classes from "../../Table.module.css";
import { Path } from "../../../../types/form";
import Select from "../../../FormFields/Select/Select";
import DatePicker from "../../../FormFields/DatePicker/DatePicker";

export interface FilterOptionProps {
  filterType: "boolean" | "number" | "select" | "date";
  title: string;
  min: number;
  max: number;
  values?: string[];
  onFilter: () => void;
  initialPath: Path;
  classTitle: string | null;
  visibility: boolean;
}

const FilterOption: FC<FilterOptionProps> = ({
  min,
  max,
  title,
  onFilter,
  initialPath,
  filterType,
  values,
  classTitle,
  visibility
}) => {
  const filterTermPath = [...initialPath, "filter", title, "term"];
  return (
    <div
      className={`${classes["table__options"]} ${
        classes["table__options--filter"]
      } ${
        ["boolean", "select"].includes(filterType)
          ? classes["table__options--lowHeight"]
          : ""
      } ${!visibility ? classes["table__options--hidden"] : ""} ${filterType === "date" ? classes["table__options--date"] : ""} ${classTitle ? classes[classTitle] : ""}`}
      onClick={(e: MouseEvent) => e.stopPropagation()}
    >
      {filterType === "number" && (
        <>
          <Slider min={min} max={max} path={filterTermPath} />
          <div className={classes["table__filter-checkbox"]}>
            {
              <CheckBox
                path={[...initialPath, "filter", title, "withinRange"]}
                vertical={false}
                title="within range"
                initialValue={true}
              />
            }
          </div>
        </>
      )}
      {filterType === "boolean" && (
        <CheckBox path={filterTermPath} vertical={false} />
      )}
      {filterType === "select" && (
        <div className={classes["table__select"]}>
          <Select
            path={filterTermPath}
            values={values!}
            initialValue={values![0]}
          />
        </div>
      )}
      {filterType === "date" && (
        <div className={classes["table__filter-dates"]}>
          <div className={classes["table__filter-checkbox"]}>
            {
              <CheckBox
                path={[...initialPath, "filter", title, "withinRange"]}
                vertical={false}
                title="within range"
                initialValue={true}
              />
            }
          </div>
          <div className={classes["table__filter-date"]}>
            <div>Date A:</div>
            <DatePicker
              path={[...filterTermPath, 0]}
              max={new Date()}
              min={new Date("2021-01-01")}
              defaultValue={new Date("2021-01-01")}
            />
          </div>
          <div className={classes["table__filter-date"]}>
            <div>Date B:</div>
            <DatePicker
              path={[...filterTermPath, 1]}
              max={new Date()}
              min={new Date("2021-01-01")}
              defaultValue={new Date()}
            />
          </div>
        </div>
      )}

      <button
        className={`modal__btn--edit ${classes["table__filter-btn"]} ${
          filterType === "date" ? classes["table__filter-btn--date"] : ""
        }`}
        onClick={onFilter}
      >
        Filter
      </button>
    </div>
  );
};

export default FilterOption;
