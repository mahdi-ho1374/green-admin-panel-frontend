import React, { FC, MouseEvent } from "react";
import classes from "../../Table.module.css";
import { useAppSelector } from "../../../../hooks/useReduxHooks";
import CheckBox from "../../../FormFields/CheckBox/CheckBox";
import { Path } from "../../../../types/form";

export interface ColumnsOptionProp {
  initialPath: Path;
  allKeys: string[];
  classTitle: string | null;
  visibility: boolean;
}

const ColumnsOption: FC<ColumnsOptionProp> = ({ allKeys, initialPath,classTitle,visibility}) => {
  const columnsPath = [...initialPath, "columns"];

  return (
    <ul
      className={`${classes["table__options"]} ${!visibility ? classes["table__options--hidden"] : ""} ${classes["table__options--columns"]} ${classTitle ? classes[classTitle] : ""}`}
    >
      {allKeys.map((key) => (
        <li
          key={key}
          className={`${classes["table__option"]} ${classes["table__option--column"]}`}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <CheckBox
            path={[...columnsPath, key]}
            title={key}
            vertical={false}
            initialValue={key === "_id" ? false : true}
          />
        </li>
      ))}
    </ul>
  );
};

export default ColumnsOption;
