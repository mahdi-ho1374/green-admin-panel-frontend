import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import type {
  FormFieldData,
  FormState,
  FormData,
  MixedInputProps,
} from "../../../types/form";
import { InputType } from "../../../types/form";
import { formActions } from "../../../store/slices/form";
import classes from "../FormFields.module.css";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import formatTitle from "../../../helpers/ui/formatTitle";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import formValidators from "../../../helpers/form/validators";
import _ from "lodash";
import convertPathToString from "../../../helpers/convertPathToString";

const MixedInput: FC<MixedInputProps> = ({
  title,
  inputType = InputType.TEXT,
  validators = [],
  initialValue = inputType === InputType.TEXT ? "" : 1,
  min,
  max,
  path,
  disabled,
  url = "",
  match,
  onValidate,
}) => {
  const value = useAppSelector((state) =>
    _.get(state.form, convertPathToString([...path, "value"]), initialValue)
  );
  const touched = useAppSelector((state) =>
    _.get(state.form, convertPathToString([...path, "touched"]), false)
  );
  const selectedUrlData = useAppSelector(
    (state) => state.form?.[path[0]]?.url?.[url]?.selectedData
  );
  const _id = useAppSelector(({ form }) =>
    _.get(
      form,
      convertPathToString([...path.slice(0, -1), "_id"]),
      initialValue
    )
  );
  const dispatch = useAppDispatch();
  const [matchError, setMatchError] = useState<string>("");

  useEffect(() => {
    dispatch(
      formActions.initialize({
        path,
        value: initialValue as number | string,
        url,
      })
    );
  }, []);

  const id = `${title}${path.length > 1 ? path[path.length - 2] : ""}`;

  const valueChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMatchError("");
    const value =
      inputType === InputType.NUMBER
        ? Number((e.target as HTMLInputElement).value) || ""
        : (e.target as HTMLInputElement).value;
    dispatch(formActions.changeValue({ path, value }));
  };

  const inputBlurHandler = async () => {
    if (!touched) {
      dispatch(formActions.changeTouched(path));
    }
    if (url && match) {
      try {
        const response = await fetch(`${url}?${title}=${value}&_id=${_id}`);
        const searchedData = await response.json();

        if (
          searchedData &&
          Array.isArray(searchedData) &&
          searchedData.length !== 0
        ) {
          setMatchError(`This ${title} already taken`);
        }
      } catch (err: any) {}
    }
  };

  const numberIncreaseHandler = (e: MouseEvent) => {
    e.preventDefault();
    !touched && dispatch(formActions.changeTouched(path));
    dispatch(formActions.increaseNumber(path));
  };

  const numberDecreaseHandler = (e: MouseEvent) => {
    e.preventDefault();
    !touched && dispatch(formActions.changeTouched(path));
    dispatch(formActions.decreaseNumber(path));
  };

  const key =
    typeof max === "object" &&
    max !== null &&
    Object.keys(max as Record<string, any>)[0];

  if (url && !match) {
    if (selectedUrlData && typeof max === "object" && max !== null) {
      max[key as string] = selectedUrlData[key as string];
    }
    if (
      selectedUrlData &&
      title in selectedUrlData &&
      selectedUrlData[title] !== value
    ) {
      dispatch(
        formActions.changeValue({ path, value: selectedUrlData[title] })
      );
    }
  }

  const transformedMax = !max
    ? undefined
    : typeof max === "number"
    ? max
    : max[key as string];

  if (inputType === InputType.TEXT) {
    validators.push(formValidators.isFilled());
  }

  if (inputType === InputType.NUMBER) {
    if (min) {
      validators.push(formValidators.minimumNumber(min));
    }
    if (max) {
      validators.push(formValidators.maximumNumber(transformedMax as number));
    }
  }

  const error = validators?.reduce(
    (error, validator) =>
      !validator.validate(value) ? validator.error : error,
    ""
  );
  const isValid = error || matchError ? false : true;
  onValidate && onValidate(path, isValid);
  const showError = !isValid && touched;

  if (typeof value === "string" || typeof value === "number") {
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
            <span className={classes["form-control__error"]}>
              {`(${error || matchError})`}
            </span>
          )}
        </div>
        <div className={classes["form-control__container"]}>
          {inputType === InputType.NUMBER && (
            <button
              className={`${classes["form-control__btn"]} ${
                classes["form-control__btn--decrease"]
              } ${
                disabled || min === Number(value)
                  ? classes["form-control__btn--disabled"]
                  : ""
              }`}
              disabled={disabled || transformedMax === Number(value)}
              onClick={numberDecreaseHandler}
            >
              <AiOutlineMinus className={classes["form-control__icon"]} />
            </button>
          )}
          <input
            id={id}
            type={title === "password" ? "password" : "text"}
            className={`${classes["form-control__input"]} ${
              inputType === InputType.NUMBER
                ? classes["form-control__input--number"]
                : ""
            }`}
            value={String(value)}
            spellCheck={false}
            disabled={disabled ? true : false}
            onChange={valueChangeHandler}
            onBlur={inputBlurHandler}
            autoComplete="off"
          />

          {inputType === InputType.NUMBER && (
            <button
              className={`${classes["form-control__btn"]} ${
                classes["form-control__btn--increase"]
              } ${
                disabled || transformedMax === Number(value)
                  ? classes["form-control__btn--disabled"]
                  : ""
              }`}
              onClick={numberIncreaseHandler}
              disabled={disabled || transformedMax === Number(value)}
            >
              <AiOutlinePlus className={classes["form-control__icon"]} />
            </button>
          )}
        </div>
      </div>
    );
  }
  return <></>;
};

export default MixedInput;
