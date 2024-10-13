import React, { FC,MouseEvent } from "react";
import classes from "../../Table.module.css";
import { allowedPerPageValues } from "../../../../types/generic";

export interface PerPageOptionProps {
    onPerPage: (value: number) => void;
    classTitle: string | null;
    visibility: boolean;
}

const PerPageOption:FC<PerPageOptionProps> = ({onPerPage,classTitle,visibility}) => {

const clickHandler = (e: MouseEvent) => {
    const textContent = Number((e.target as HTMLLIElement).textContent);
    onPerPage(textContent);
}

  return (
    <ul className={`${classes["table__options"]} ${classTitle ? classes[classTitle] : ""} ${!visibility ? classes["table__options--hidden"] : ""}`}>
      {allowedPerPageValues.map((value) => (
        <li key={value} className={classes["table__option"]} onClick={clickHandler}>
          {value}
        </li>
      ))}
    </ul>
  );
};

export default PerPageOption;
