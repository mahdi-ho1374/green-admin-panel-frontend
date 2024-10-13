import React, { FC, MouseEvent, useEffect } from "react";
import formatTitle from "../../../helpers/ui/formatTitle";
import classes from "../Table.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/useReduxHooks";
import { GenericKey } from "../../../types/generic";
import { BsThreeDotsVertical } from "react-icons/bs";
import MainOptions from "./Options/MainOptions";
import ColumnsOption from "./Options/ColumnsOption";
import FilterOption from "./Options/FilterOption";
import PerPageOption from "./Options/PerPageOption";
import _ from "lodash";
import { formActions } from "../../../store/slices/form";
import Swal from "sweetalert2";

export type THeadProps = {
  keys: string[];
  allKeys: string[];
  data: Record<string, any>[];
  genericKey: GenericKey;
  rootPath: string;
  filterProp?: { key: string; values: string[] };
  onSort: (e: MouseEvent) => void;
  onUnSort: () => void;
  onFilter: () => void;
  onUnFilter: () => void;
  onPerPage: (value: number) => void;
  isOnMobile: boolean;
};

const THead: FC<THeadProps> = ({
  keys,
  allKeys,
  data,
  rootPath,
  onPerPage,
  genericKey,
  filterProp,
  onSort,
  onUnSort,
  onFilter,
  onUnFilter,
  isOnMobile,
}) => {
  const EMPTY_ARRAY: [] = [];
  const headerId = useAppSelector(
    ({ form }) => form?.[rootPath]?.table?.headerOptions?.id?.value || ""
  );
  const form = useAppSelector(({ form }) => form);
  const [minOfNumericFilter = 0, maxOfNumericFilter = 0] = useAppSelector(
    (state) => state?.generic?.[genericKey]?.minmax?.[headerId] || EMPTY_ARRAY
  );
  const dispatch = useAppDispatch();

  const initialPath = [rootPath, "table"];
  const headerOptionsPath = [...initialPath, "headerOptions"];
  const paths = {
    columns: [...headerOptionsPath, "columnsExpanded"],
    filter: [...headerOptionsPath, "filterExpanded"],
    perPage: [...headerOptionsPath, "perPageExpanded"],
    main: [...headerOptionsPath, "mainExpanded"],
  };

  const expandedOptions: Record<string, any> = {};

  for (const path of Object.values(paths)) {
    expandedOptions[path[path.length - 1]] = _.get(form, [
      ...path,
      "isExpanded",
    ]);
  }

  const columnsOptionExpanded = expandedOptions?.columnsExpanded;
  const filterOptionExpanded = expandedOptions?.filterExpanded;
  const perPageOptionExpanded = expandedOptions?.perPageExpanded;
  const mainOptionExpanded = expandedOptions?.mainExpanded;

  const headerClickHandler = (e: MouseEvent, title: string) => {
    setTimeout(() => {
      dispatch(formActions.deleteItem(headerOptionsPath));
      if (title !== headerId) {
        dispatch(
          formActions.changeValue({
            path: [...headerOptionsPath, "id"],
            value: title,
          })
        );
        dispatch(formActions.setExpanded(paths.main));
      }
    }, 100);
  };

  useEffect(() => {
    const collapseOptions = (e: any) => {
      if (headerId && !(e.target as HTMLElement).closest("th")) {
        dispatch(formActions.deleteItem(headerOptionsPath));
      }
    };
    document.addEventListener("mousedown", collapseOptions);

    return () => {
      document.removeEventListener("mousedown", collapseOptions);
    };
  }, [headerId]);

  const getOptionsClass = () => {
    const tableBounding = document
      .querySelector("#table__main")
      ?.getBoundingClientRect();
    const thBounding = headerId
      ? document
          .querySelector(`[data-th-name=${headerId}]`)
          ?.getBoundingClientRect()
      : null;
    if (window.innerWidth < 576) {
      return "table__options--full-width";
    }
    return !tableBounding || !thBounding
      ? null
      : tableBounding.right - thBounding.right >
        thBounding.right - tableBounding.left
      ? "table__options--right"
      : "table__options--left";
  };

  return (
    <thead>
      <tr>
        {keys.map(
          (title, index) =>
            keys.includes(title) && (
              <th
                key={title}
                onClick={(e: MouseEvent) => headerClickHandler(e, title)}
                className={
                  title === "actions" && !isOnMobile
                    ? "center"
                    : Number(data[0]?.[keys[index]]) > -1 && !isOnMobile
                    ? "center"
                    : "left"
                }
              >
                <span className={classes["table__title"]}>
                  {formatTitle(title)}
                  <BsThreeDotsVertical
                    data-th-name={title}
                    className={classes["table__dot-btn"]}
                  />

                  <MainOptions
                    title={title}
                    data={data}
                    classTitle={getOptionsClass()}
                    visibility={title === headerId && mainOptionExpanded}
                    genericKey={genericKey}
                    initialPath={initialPath}
                    headerId={headerId}
                    includeFilter={
                      ["number", "boolean"].includes(typeof data[0]?.[title]) ||
                      filterProp?.key === title ||
                      /^\d{1,4}([^\d]|$)\d{1,2}\1\d{1,4}/.test(data[0][title])
                    }
                    onSort={onSort}
                    onUnFilter={onUnFilter}
                    onUnSort={onUnSort}
                  />

                  <ColumnsOption
                    allKeys={allKeys}
                    initialPath={initialPath}
                    classTitle={getOptionsClass()}
                    visibility={title === headerId && columnsOptionExpanded}
                  />

                  <FilterOption
                    classTitle={getOptionsClass()}
                    visibility={
                      typeof data[0][title] !== "number"
                        ? title === headerId && filterOptionExpanded
                        : title === headerId &&
                          filterOptionExpanded &&
                          maxOfNumericFilter !== 0
                    }
                    filterType={
                      /^\d{1,4}([^\d]|$)\d{1,2}\1\d{1,4}/.test(data[0][title])
                        ? "date"
                        : filterProp?.key === title
                        ? "select"
                        : (typeof data[0][title] as "number" | "boolean")
                    }
                    min={minOfNumericFilter}
                    max={maxOfNumericFilter}
                    values={filterProp?.values}
                    onFilter={onFilter}
                    title={title}
                    initialPath={initialPath}
                  />

                  <PerPageOption
                    classTitle={getOptionsClass()}
                    onPerPage={onPerPage}
                    visibility={title === headerId && perPageOptionExpanded}
                  />
                </span>
              </th>
            )
        )}
      </tr>
    </thead>
  );
};

export default THead;
