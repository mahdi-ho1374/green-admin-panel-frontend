import { FC, MouseEvent, ReactNode, useEffect, useState } from "react";
import classes from "./Table.module.css";
import { ModalType } from "../../types/ui";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useReduxHooks";
import { formActions } from "../../store/slices/form";
import { GenericKey, View } from "../../types/generic";
import { fetchMinMax } from "../../store/actions/generic";
import THead from "./THead/THead";
import createUrlPath from "../../helpers/url/createUrlPath";
import _ from "lodash";
import { Status } from "../../types/order";
import { useSelector } from "react-redux";

interface Table {
  data: Record<string, any>[];
  buttonsAndHandlers: {
    element: ReactNode;
    name: ModalType;
    handler: (id: string) => void;
    disabled?: [string, string] | false;
  }[];
  priceFields?: string[];
  filterProp?: { key: string; values: string[] };
  view: View;
}

const Table: FC<Table> = ({
  data,
  buttonsAndHandlers,
  priceFields = [],
  filterProp,
  view,
}) => {
  const [tableContainerWidth, setTableContainerWidth] = useState<number>(() =>
    getTableContainerWidth()
  );
  const [isOnMobile, setIsOnMobile] = useState<boolean>(
    window.innerWidth < 576
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const page = location.pathname.split("/")[1];
  const rootPath = page;
  const initialPath = [page, "table"];
  const headerOptionsPath = [...initialPath, "headerOptions"];
  const genericKey = page.split("").slice(0, -1).join("") as GenericKey;
  const EMPTY_OBJECT = {};
  const { currentPage, perPage, searchTerm } = useAppSelector(
    (state) => state?.generic?.[genericKey]
  );
  const headerId = useAppSelector(
    ({ form }) => form?.[rootPath]?.table?.headerOptions?.id?.value || ""
  );
  const filterValueObject = useAppSelector(
    ({ form }) =>
      form?.[rootPath]?.table?.filter?.[headerId]?.term || EMPTY_OBJECT
  );
  const { value: withinRangeValue } = useAppSelector(
    ({ form }) =>
      form?.[rootPath]?.table?.filter?.[headerId]?.withinRange || EMPTY_OBJECT
  );
  const columns: any = useAppSelector(
    ({ form }) => form?.[rootPath]?.table?.columns
  );
  type Keys = keyof (typeof data)[0];
  const keys: string[] = columns
    ? Object.keys(columns).reduce(
        (result, key) => (columns[key].value ? [...result, key] : result),
        [] as string[]
      )
    : ([...Object.keys(data[0] || {})]
        .concat(buttonsAndHandlers ? ["actions"] : [])
        .filter((key) => key !== "_id") as Keys[]);
  const allKeys =
    data.length > 0
      ? Object.keys(data[0]).concat(buttonsAndHandlers ? ["actions"] : [])
      : [];
  const numberKeys =
    data.length > 0
      ? keys.filter((key) => typeof data[0][key] === "number")
      : [];
  const filterField = params.get("filterField");
  const filterTerm = params.get("filterTerm");
  const withinRange = params.get("withinRange");
  const sortBy = params.get("sortBy");
  const sortField = params.get("sortField");

  useEffect(() => {
    numberKeys.forEach((key) => dispatch(fetchMinMax(genericKey, key)));
  }, []);

  useEffect(() => {
    let resizeTimeout: any;

    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 576 && !isOnMobile) {
          setIsOnMobile(true);
        }
        if (window.innerWidth >= 576 && isOnMobile) {
          setIsOnMobile(false);
        }
        setTableContainerWidth(getTableContainerWidth());
      }, 200);
    };

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    document
      .querySelector("#table")
      ?.removeEventListener("resize", resizeHandler);

    return () => {
      document
        .querySelector("#table")
        ?.removeEventListener("resize", resizeHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isOnMobile]);

  useEffect(() => {
    setTableContainerWidth(getTableContainerWidth());
  }, [keys.length]);

  const sortHandler = (e: MouseEvent) => {
    const textContent = (e.target as HTMLLIElement).textContent as string;
    const sortBy = textContent.split(" ")[2].toLowerCase();

    navigate(
      createUrlPath({
        page,
        currentPage,
        view,
        searchTerm,
        params: {
          sortField: headerId,
          sortBy,
          filterField,
          filterTerm,
          perPage,
          withinRange,
        },
      })
    );
  };

  const unSortHandler = () => {
    navigate(
      createUrlPath({
        currentPage,
        searchTerm,
        view,
        page,
        params: { filterField, filterTerm, perPage, withinRange },
      })
    );
  };

  const unFilterHandler = () => {
    navigate(
      createUrlPath({
        currentPage,
        searchTerm,
        view,
        page,
        params: { sortField, sortBy, perPage },
      })
    );
  };

  const filterHandler = () => {
    const filterTerm = Array.isArray(filterValueObject)
      ? (filterValueObject[0] > filterValueObject[1]
          ? filterValueObject.reverse()
          : filterValueObject
        )
          .map((valueObj: Date) =>
            new Date((valueObj as any).value)
              .toISOString()
              .split("")
              .slice(0, 10)
              .join("")
          )
          .join(",")
      : filterValueObject.value;
    dispatch(formActions.deleteItem(headerOptionsPath));
    navigate(
      createUrlPath({
        page,
        currentPage,
        view,
        searchTerm,
        params: {
          sortField,
          sortBy,
          filterField: headerId,
          filterTerm,
          withinRange: withinRangeValue,
          perPage,
        },
      })
    );
  };

  const perPageHandler = (value: number) => {
    navigate(
      createUrlPath({
        currentPage,
        searchTerm,
        page,
        view,
        params: {
          filterField,
          filterTerm,
          sortField,
          sortBy,
          withinRange,
          perPage: value,
        },
      })
    );
  };

  function getTableContainerWidth() {
    return document.querySelector("#table")?.clientWidth || 0;
  }

  const tableWidth = Number(
    (((keys.length * 140) / tableContainerWidth) * 100).toFixed(2)
  );

  return (
    <>
      {data.length === 0 ? (
        <div className={classes["table__no-data"]}>There is no data</div>
      ) : (
        <div className={classes["table__container"]} id="table">
          <table
            style={{
              width:
                tableWidth > 100 && !isOnMobile ? `${tableWidth}%` : "100%",
            }}
            className={classes.table}
            id="table__main"
          >
            <THead
              allKeys={allKeys}
              data={data}
              onUnFilter={unFilterHandler}
              keys={keys}
              filterProp={filterProp}
              rootPath={rootPath}
              genericKey={genericKey}
              onFilter={filterHandler}
              onSort={sortHandler}
              onUnSort={unSortHandler}
              onPerPage={perPageHandler}
              isOnMobile={isOnMobile}
            />
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  {keys.map((title, index) =>
                    keys.includes(title) && title === "actions" ? (
                      <td
                        className="actions"
                        data-cell="actions"
                        key={item._id + "-" + item[title] + "-" + index}
                      >
                        {buttonsAndHandlers.map((button, index) => (
                          <button
                            key={button.element + "-" + index}
                            className={`actions__btn actions__btn--${button.name}`}
                            onClick={() => button.handler(item._id)}
                            disabled={
                              button.disabled &&
                              item[button.disabled[0]] === button.disabled[1]
                            }
                            data-free={
                              button.disabled &&
                              item[button.disabled[0]] === button.disabled[1]
                            }
                          >
                            {button.element}
                          </button>
                        ))}
                      </td>
                    ) : (
                      <td
                        data-cell={title}
                        key={item._id + "-" + item[title] + "-" + index}
                        className={
                          Number(item[title]) > -1 && !isOnMobile
                            ? "center"
                            : "left"
                        }
                      >
                        {item[title] instanceof Date ||
                        /^\d{1,4}([^\d]|$)\d{1,2}\1\d{1,4}/.test(
                          item[title]
                        ) ? (
                          new Date(item[title])
                            .toLocaleDateString()
                            .split("/")
                            .map((item) =>
                              item.length === 1 ? `0${item}` : item
                            )
                            .join("/")
                        ) : typeof item[title] !== "boolean" ? (
                          `${item[title] || "---"} ${
                            priceFields.includes(title) && item[title] !== 0
                              ? "$"
                              : ""
                          }`
                        ) : item[title] === true ? (
                          <AiOutlineCheck className={classes["table__icon"]} />
                        ) : (
                          <AiOutlineClose className={classes["table__icon"]} />
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
