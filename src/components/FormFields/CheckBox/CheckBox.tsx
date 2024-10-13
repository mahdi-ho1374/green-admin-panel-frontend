import React, { ChangeEvent, FC, useEffect } from "react";
import type {
  CheckBoxProps,
  FormFieldData,
  FormState,
} from "../../../types/form";
import { formActions } from "../../../store/slices/form";
import classes from "../FormFields.module.css";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import formatTitle from "../../../helpers/ui/formatTitle";
import { AiOutlineCheck } from "react-icons/ai";
import _ from "lodash";
import convertPathToString from "../../../helpers/convertPathToString";

const CheckBox: FC<CheckBoxProps> = ({
  id,
  title,
  initialValue = false,
  validators = [],
  path,
  disabled,
  onValidate,
  vertical = true,
}) => {
  const value = useAppSelector(({ form }) =>
    _.get(form, convertPathToString([...path, "value"]))
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value === undefined) {
      dispatch(formActions.initialize({ path, value: initialValue }));
    }
  }, []);

  const checkBoxId = title
    ? `${title}${path.length > 1 ? path[path.length - 2] : ""}`
    : id;

  const valueChangeHandler = () => {
    dispatch(formActions.changeValue({ path, value: !value }));
  };

  const error = validators?.reduce(
    (error, validator) =>
      !validator.validate(value) ? validator.error : error,
    ""
  );

  const isValid = error ? false : true;
  onValidate && onValidate(path, isValid);
  const showError = !isValid;

  return (
    <div
      className={`${classes["form-control"]} ${
        vertical ? "" : classes["form-control--horizontal"]
      }`}
    >
      {title && (
        <div className={classes["form-control__top"]}>
          <label
            htmlFor={checkBoxId}
            className={`${classes["form-control__label"]} ${
              disabled ? classes["form-control__label--disabled"] : ""
            }`}
            onClick={valueChangeHandler}
          >
            {formatTitle(title)}
          </label>
          {showError && (
            <span className={classes["form-control__error"]}>
              ${`(${error})`}
            </span>
          )}
        </div>
      )}
      <div
        className={`${classes["form-control__checkbox-container"]} ${
          value ? classes["form-control__checkbox-container--checked"] : ""
        } ${
          vertical
            ? ""
            : classes["form-control__checkbox-container--horizontal"]
        } ${
          disabled ? classes["form-control__checkbox-container--disabled"] : ""
        }`}
      >
        <input
          id={id}
          type="checkbox"
          className={classes["form-control__checkbox"]}
          checked={(value as boolean) ?? initialValue}
          disabled={disabled ? true : false}
          onChange={valueChangeHandler}
        />
        {value && (
          <AiOutlineCheck className={classes["form-control__checkbox-icon"]} />
        )}
      </div>
    </div>
  );
};

export default CheckBox;
