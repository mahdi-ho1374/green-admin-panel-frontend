import React, { ChangeEvent, FC, useEffect } from "react";
import type { FormFieldProps, FormState } from "../../../types/form";
import { formActions } from "../../../store/slices/form";
import classes from "../FormFields.module.css";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import formatTitle from "../../../helpers/ui/formatTitle";

const TextBox: FC<FormFieldProps> = ({
  title,
  initialValue = "",
  validators = [],
  path,
  disabled,
  url,
  onValidate,
}) => {
  const { value, touched } = useAppSelector(({ form }) =>
    path.reduce((form, item) => form?.[item] || {}, form as FormState)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value === undefined) {
      dispatch(formActions.initialize({ path, value: initialValue, url }));
    }
  }, []);

  const id = `${title}${path.length > 1 ? path[path.length - 2] : ""}`;

  const valueChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value;
    dispatch(formActions.changeValue({ path, value }));
  };

  const inputBlurHandler = () => {
    dispatch(formActions.changeTouched(path));
  };

  const error = validators?.reduce(
    (error, validator) =>
      !validator.validate(value || initialValue) ? validator.error : error,
    ""
  );
  const isValid = error ? false : true;
  onValidate && onValidate(path, isValid);
  const showError = !isValid && touched;

  return (
    <div className={classes["form-control"]}>
      <div className={classes["form-control__top"]}>
        <label
          htmlFor={id}
          className={`${classes["form-control__label"]} ${
            disabled ? classes["form-control__label--disabled"] : ""
          }`}
        >
          {formatTitle(title)}
        </label>
        {showError && (
          <span className={classes["form-control__error"]}>{`(${error})`}</span>
        )}
      </div>
      <textarea
        id={id}
        className={classes["form-control__text-box"]}
        value={(value as string) || (initialValue as string)}
        spellCheck={false}
        disabled={disabled ? true : false}
        onChange={valueChangeHandler}
        onBlur={inputBlurHandler}
      />
    </div>
  );
};

export default TextBox;
