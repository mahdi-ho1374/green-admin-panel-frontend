import React, {
  FC,
  MouseEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  SearchInputProps,
  FormFieldData,
  FormState,
  FormData,
} from "../../../types/form";
import { formActions } from "../../../store/slices/form";
import classes from "../FormFields.module.css";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import formatTitle from "../../../helpers/ui/formatTitle";
import formValidators from "../../../helpers/form/validators";
import convertDecimalToNumber from "../../../helpers/convertDecimalToNumber";
import { FaRegFaceFrown } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import useElementClose from "../../../hooks/useElementClose";
import convertPathToString from "../../../helpers/convertPathToString";
import _ from "lodash";

const SearchInput: FC<SearchInputProps> = ({
  title,
  initialValue = "",
  path,
  disabled,
  url,
  validators = [],
  icon = false,
  autoComplete = false,
  text,
  onSearch,
  onValidate,
}) => {
  const value = useAppSelector((state) =>
    _.get(state.form, convertPathToString([...path, "value"]), initialValue)
  );
  const touched = useAppSelector((state) =>
    _.get(state.form, convertPathToString([...path, "touched"]), false)
  );
  const isExpanded = useAppSelector((state) =>
    _.get(state.form, convertPathToString([...path, "isExpanded"]), false)
  );
  const urlData = useAppSelector(
    (state) => state.form?.[path[0]]?.url?.[url]?.data
  );
  const selectedUrlData = useAppSelector(
    (state) => state.form?.[path[0]]?.url?.[url]?.selectedData
  );
  const dispatch = useAppDispatch();
  const searchTimeOut = useRef<any>(null);
  const error = useRef<{ validator: string; search: string }>({
    validator: "",
    search: "",
  });
  const [searchStatus, setSearchStatus] = useState<
    "error" | "pending" | "success" | null
  >(null);
  const inputBlurred = useRef<null | boolean>(null);

  useEffect(() => {
    dispatch(formActions.initialize({ path, value: initialValue, url }));
    return () => {
      clearTimeout(searchTimeOut.current);
    };
  }, []);

  useEffect(() => {
    if (inputBlurred.current === null) {
      return;
    }
    clearTimeout(searchTimeOut.current);
    inputBlurHandler();
  }, [inputBlurred.current]);

  const id = `${title}${path.length > 1 ? path[path.length - 2] : ""}`;

  useElementClose({
    onClose: () => dispatch(formActions.setCollapsed(path)),
    isExpanded: isExpanded || false,
    exception: `#${id}`,
  });

  const formattedTitle = formatTitle(title || "");

  const valueChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeOut.current);
    const value = (e.target as HTMLInputElement).value;
    validators?.push(formValidators.minimumCharacters(3));
    const validatorError = validators?.reduce(
      (error, validator) =>
        !validator.validate(value) ? validator.error : error,
      ""
    );
    error.current.validator = validatorError;
    dispatch(formActions.changeValue({ path, value }));
    if (error.current.validator) {
      dispatch(formActions.saveData({ url: url as string, data: [], path }));
      return;
    }
    searchTimeOut.current = setTimeout(async () => {
      try {
        setSearchStatus("pending");
        const response = await fetch(
          `${url}?${title || "term"}=${value}${
            autoComplete ? "&autoComplete=true" : ""
          }`
        );

        setSearchStatus(response.ok ? "success" : "error");
        const searchedData = await response.json();
        const transformedSearchedData = convertDecimalToNumber(searchedData);
        dispatch(
          formActions.saveData({
            url: url as string,
            data: transformedSearchedData,
            path,
          })
        );
      } catch (err: any) {
        setSearchStatus("error");
      }
    }, 2000);
  };

  const searchedValueSelectHandler = (
    e: MouseEvent<HTMLDivElement>,
    item: any
  ) => {
    const value = (e.target as HTMLDivElement).textContent as string;
    dispatch(formActions.changeValue({ path, value }));
    dispatch(formActions.selectData({ url: url as string, data: item, path }));

    dispatch(formActions.setCollapsed(path));
    if (!autoComplete) {
      inputBlurred.current =
        inputBlurred.current !== null ? !inputBlurred.current : false;
    }
  };

  const inputFocusHandler = async () => {
    dispatch(formActions.setExpanded(path));
    error.current.search = "";
    if (!touched && (value as string)?.trim().length > 2) {
      try {
        const response = await fetch(
          `${url}?${title || "term"}=${value}${
            autoComplete ? "&autoComplete=true" : ""
          }`
        );
        const searchedData = convertDecimalToNumber(await response.json());
        searchedData.forEach((item: any) => {
          if (
            item[title as string].toUpperCase() ===
            (value as string).toUpperCase()
          ) {
            dispatch(
              formActions.selectData({ url: url as string, data: item, path })
            );
          }
        });
        dispatch(
          formActions.saveData({ url: url as string, data: searchedData, path })
        );
      } catch (err: any) {}
    }
  };

  const inputBlurHandler = async () => {
    clearTimeout(searchTimeOut.current);
    searchTimeOut.current = setTimeout(async () => {
      dispatch(formActions.changeTouched(path));
      if (error.current.validator) {
        return;
      }
      if (
        selectedUrlData &&
        (value as string).toUpperCase() ===
          selectedUrlData[title as string].toUpperCase()
      ) {
        dispatch(formActions.setCollapsed(path));
        return;
      }
      const isReturned = urlData?.some((item: any) => {
        if (
          item[title as string].toUpperCase() ===
          (value as string).toUpperCase()
        ) {
          dispatch(
            formActions.selectData({ url: url as string, data: item, path })
          );
          return true;
        }
      });

      if (isReturned) {
        dispatch(formActions.setCollapsed(path));
        return;
      }
      try {
        const response = await fetch(`${url}?${title || "term"}=${value}`);
        if (response.status === 404) {
          error.current.search = `No ${
            text || formatTitle(title!)
          } match your search`;

          dispatch(formActions.setCollapsed(path));
        }
        const searchedData = convertDecimalToNumber(await response.json());
        if (searchedData.length > 1) {
          error.current.search = `Multiple ${
            (text || formattedTitle) + (text || formattedTitle).endsWith("s")
              ? "es"
              : "s"
          } found,choose one`;
          dispatch(formActions.setExpanded(path));
        }
        if (searchedData.length === 1) {
          if (
            searchedData[0][title!].toUpperCase() ===
            (value as string).toUpperCase()
          ) {
            dispatch(formActions.selectData(searchedData[0]));
            error.current.search = "";

            dispatch(formActions.setCollapsed(path));
          }
          if (
            searchedData[0][title!].toUpperCase() !==
            (value as string).toUpperCase()
          ) {
            error.current.search = `Please complete the ${formatTitle(
              title!
            ).toLowerCase()}`;

            dispatch(formActions.setCollapsed(path));
          }
        }
        dispatch(
          formActions.saveData({ url: url as string, data: searchedData, path })
        );
      } catch (err: any) {}
    }, 200);
  };

  const isValid =
    error.current.search || error.current.validator ? false : true;
  const showError = !isValid && touched;
  onValidate && onValidate(path, isValid);

  return (
    <div
      className={`${classes["form-control"]} ${classes["form-control--search"]}`}
    >
      {!autoComplete && (
        <div className={classes["form-control__top"]}>
          <label
            htmlFor={id}
            className={`${classes["form-control__label"]} ${
              disabled ? classes["form-control__label--disabled"] : ""
            }`}
          >
            {formattedTitle}
          </label>
          {showError && (
            <span className={classes["form-control__error"]}>
              {`(${error.current.validator || error.current.search})`}
            </span>
          )}
        </div>
      )}
      <div
        className={`${classes["form-control__container"]} ${
          isExpanded ? classes["form-control__container--expanded"] : ""
        }`}
      >
        <input
          id={id}
          spellCheck={false}
          type="text"
          className={`${classes["form-control__input"]} ${
            isExpanded ? classes["form-control__input--expanded"] : ""
          }`}
          value={value as string}
          disabled={disabled ? true : false}
          onChange={valueChangeHandler}
          onBlur={autoComplete ? () => {} : inputBlurHandler}
          onFocus={inputFocusHandler}
          autoComplete="off"
        />
        {icon && (
          <button
            className={`${classes["form-control__btn"]} ${classes["form-control__btn--search"]}`}
            onClick={() => onSearch!(value as string)}
            disabled={disabled ? true : false}
          >
            <GrSearch
              className={`${classes["form-control__icon"]} ${classes["form-control__icon--search"]}`}
            />
          </button>
        )}

        {isExpanded && (
          <div className={classes["form-control__content"]}>
            {searchStatus === "success" && urlData && urlData.length > 0 ? (
              (urlData as any[]).map((item) => (
                <div
                  className={classes["form-control__option"]}
                  onClick={(e) => searchedValueSelectHandler(e, item)}
                >
                  {autoComplete ? item : item[title!]}
                </div>
              ))
            ) : (
              <div
                className={`${classes["form-control__option"]} ${classes["form-control__option--disabled"]}`}
              >
                {["success", null].includes(searchStatus) && (
                  <>
                    <p>No {text || formattedTitle} match your search</p>
                    <FaRegFaceFrown />
                  </>
                )}
                {searchStatus === "pending" && <p>Searching...</p>}
                {searchStatus === "error" && (
                  <p>Something went wrong, try again later</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
