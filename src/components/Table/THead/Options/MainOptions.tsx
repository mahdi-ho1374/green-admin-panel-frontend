import React, { FC, MouseEvent } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useReduxHooks";
import classes from "../../Table.module.css";
import { formActions } from "../../../../store/slices/form";
import type { GenericKey } from "../../../../types/generic";
import { Path } from "../../../../types/form";
import Swal from "sweetalert2";
import { fetchMinMax } from "../../../../store/actions/generic";
import { useSearchParams } from "react-router-dom";

export interface MainOptionsProp {
  headerId: string;
  genericKey: GenericKey;
  title: string;
  includeFilter: boolean;
  onSort: (e: MouseEvent) => void;
  onUnSort: () => void;
  onUnFilter: () => void;
  initialPath: Path;
  classTitle: string | null;
  visibility: boolean;
  data: Record<string, any>[];
}

const MainOptions: FC<MainOptionsProp> = ({
  headerId,
  title,
  includeFilter,
  onSort,
  onUnFilter,
  onUnSort,
  genericKey,
  initialPath,
  classTitle,
  visibility,
  data,
}) => {
  const EMPTY_ARRAY: [] = [];
  const headerOptionsPath = [...initialPath, "headerOptions"];
  const columnsExpandedPath = [...headerOptionsPath, "columnsExpanded"];
  const filterExpandedPath = [...headerOptionsPath, "filterExpanded"];
  const perPageExpandedPath = [...headerOptionsPath, "perPageExpanded"];
  const mainExpandedPath = [...headerOptionsPath, "mainExpanded"];
  const columnsPath = [...initialPath, "columns"];

  const dispatch = useAppDispatch();

  const [params, setParams] = useSearchParams();
  const [minOfNumericFilter = 0, maxOfNumericFilter = 0] = useAppSelector(
    (state) => state?.generic?.[genericKey]?.minmax?.[headerId] || EMPTY_ARRAY
  );
  const uiColors = useAppSelector(({ ui }) => ui.colors);
  const columns = useAppSelector(({ form }) =>
    columnsPath.reduce((result, prop) => result?.[prop], form)
  );
  const sortBy = params.get("sortBy");
  const filterField = params.get("filterField");
  const sortField = params.get("sortField");
  const onlyOneColumnVisible = !columns
    ? false
    : Object.keys(columns).filter((column: any) => columns[column].value)
        .length === 1
    ? true
    : false;

  const hideColumnHandler = () => {
    dispatch(
      formActions.changeValue({
        path: [...columnsPath, headerId],
        value: false,
      })
    );
  };

  const showOptionHandler = (e: MouseEvent, path: Path) => {
    dispatch(formActions.setCollapsed(mainExpandedPath));
    dispatch(formActions.setExpanded(path));
    e.stopPropagation();
  };

  const filterOptionHandler = () => {
    if (
      typeof data[0][title] === "number" &&
      title === headerId &&
      maxOfNumericFilter === 0
    ) {
      dispatch(fetchMinMax(genericKey, title));

      Swal.fire({
        position: "center",
        title: `Something went wrong`,
        showConfirmButton: false,
        text: "please try again in a few moments",
        customClass: {
          popup: "sweet-alert__modal",
          title: "sweet-alert__title",
          htmlContainer: "sweet-alert__text",
        },
        timer: 30000,
        color: uiColors.text,
        background: uiColors.secondary,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  const isActionsColumn = headerId === "actions";

  return (
    <ul
      className={`${classes["table__options"]} ${
        !visibility ? classes["table__options--hidden"] : ""
      } ${classTitle ? classes[classTitle] : ""}`}
    >
      {!isActionsColumn && sortField === title && (
        <li className={classes["table__option"]} onClick={onUnSort}>
          UnSort
        </li>
      )}
      {!isActionsColumn && !(sortField === title && sortBy === "asc") && (
        <li className={classes["table__option"]} onClick={onSort}>
          Sort by Asc
        </li>
      )}
      {!isActionsColumn && !(sortField === title && sortBy === "desc") && (
        <li className={classes["table__option"]} onClick={onSort}>
          Sort by Desc
        </li>
      )}
      {!isActionsColumn && includeFilter && (
        <li
          className={classes["table__option"]}
          onClick={(e: MouseEvent) => {
            filterOptionHandler();
            showOptionHandler(e, filterExpandedPath);
          }}
        >
          Filter
        </li>
      )}
      {!isActionsColumn && includeFilter && title === filterField && (
        <li className={classes["table__option"]} onClick={onUnFilter}>
          UnFilter
        </li>
      )}
      {!onlyOneColumnVisible && (
        <li className={classes["table__option"]} onClick={hideColumnHandler}>
          Hide
        </li>
      )}
      <li
        className={classes["table__option"]}
        onClick={(e: MouseEvent) => showOptionHandler(e, columnsExpandedPath)}
      >
        Manage Columns
      </li>
      <li
        className={classes["table__option"]}
        onClick={(e: MouseEvent) => showOptionHandler(e, perPageExpandedPath)}
      >
        Per Page
      </li>
    </ul>
  );
};

export default MainOptions;
