import React, { FC, MouseEvent, useEffect } from "react";
import type {
  SelectProps,
  FormFieldData,
  FormState,
} from "../../../types/form";
import { formActions } from "../../../store/slices/form";
import classes from "../FormFields.module.css";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import formatTitle from "../../../helpers/ui/formatTitle";
import { MdExpandMore } from "react-icons/md";
import useElementClose from "../../../hooks/useElementClose";
import convertPathToString from "../../../helpers/convertPathToString";
import _ from "lodash";

const Select: FC<SelectProps> = ({
  id,
  title,
  initialValue: anyTypeInitialValue = "",
  validators = [],
  values: anyTypeValues,
  path,
  disabled,
  onValidate,
  reverseColor = false,
}) => {
  const value = useAppSelector(({ form }) =>
    _.get(form, convertPathToString([...path, "value"]))
  );
  const isExpanded = useAppSelector(({ form }) =>
    _.get(form, convertPathToString([...path, "isExpanded"]))
  );
  const dispatch = useAppDispatch();
  const values = anyTypeValues.map((value) => String(value));
  const initialValue = String(anyTypeInitialValue);

  useEffect(() => {
    if (value === undefined || !values.includes(String(value))) {
      dispatch(formActions.initialize({ path, value: initialValue }));
    }
  }, [values.length]);

  const selectId = id
    ? id
    : `${path[path.length - 1]}-${
        path.length > 1 ? path[path.length - 2] : ""
      }`;

  useElementClose({
    onClose: () => dispatch(formActions.setCollapsed(path)),
    isExpanded,
    exception: `#${selectId}`,
  });

  const valueChangeHandler = (e: MouseEvent<HTMLDivElement>) => {
    const value =
      (e.target as HTMLDivElement).className === "form-control__content"
        ? ""
        : ((e.target as HTMLDivElement).dataset.value as string);
    dispatch(formActions.changeValue({ path, value }));
    dispatch(formActions.setCollapsed(path));
  };

  const expandedToggleHandler = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(formActions.toggleExpanded(path));
  };

  const error =
    value === ""
      ? "Select an item from the list"
      : validators?.reduce(
          (error, validator) =>
            !validator.validate(value) ? validator.error : error,
          ""
        );
  const isValid = error ? false : true;
  onValidate && onValidate(path, isValid);
  const showError = !isValid;
  return (
    <div className={classes["form-control"]} id={selectId}>
      {title && (
        <div className={classes["form-control__top"]}>
          <label
            htmlFor={selectId}
            className={`${classes["form-control__label"]} ${
              disabled ? classes["form-control__label--disabled"] : ""
            }`}
            onClick={expandedToggleHandler}
          >
            {formatTitle(title || "")}
          </label>
          {showError && (
            <span className={classes["form-control__error"]}>
              {`(${error})`}
            </span>
          )}
        </div>
      )}
      <div
        className={`${classes["form-control__select"]} ${
          isExpanded ? classes["form-control__select--expanded"] : ""
        } ${disabled ? classes["form-control__select--disabled"] : ""} 
          ${reverseColor ? classes["form-control__select--reverse"] : ""}`}
      >
        <div
          className={classes["form-control__select-main"]}
          onClick={expandedToggleHandler}
        >
          {formatTitle(String(value || initialValue || "---"))}
          <div
            className={`${classes["form-control__btn"]} ${
              classes["form-control__btn--select"]
            }  ${reverseColor ? classes["form-control__btn--reverse"] : ""}`}
            onClick={expandedToggleHandler}
          >
            <MdExpandMore
              className={`${classes["form-control__icon"]} ${
                reverseColor ? classes["form-control__icon--reverse"] : ""
              } ${isExpanded ? classes["form-control__icon--expanded"] : ""}`}
            />
          </div>
        </div>
        {isExpanded && (
          <div
            className={classes["form-control__content"]}
            onClick={valueChangeHandler}
          >
            {values?.map((value) => (
              <div
                className={`${classes["form-control__option"]} ${
                  reverseColor ? classes["form-control__option--reverse"] : ""
                }`}
                data-value={value}
                key={value}
              >
                {formatTitle(value as string)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
