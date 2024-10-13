import React, { FC, FormEvent, MouseEvent, useEffect, useRef } from "react";
import type { FormValidate, OnDelete, FormProps } from "../../types/form";
import _ from "lodash";
import classes from "./Form.module.css";
import FormItem from "./FormItem/FormItem";
import formatTitle from "../../helpers/ui/formatTitle";
import { useAppSelector, useAppDispatch } from "../../hooks/useReduxHooks";
import { cloneDeep } from "lodash";
import { formActions } from "../../store/slices/form";
import { ModalType } from "../../types/ui";
import convertPathToString from "../../helpers/convertPathToString";
import { uiActions } from "../../store/slices/ui";

const Form: FC<FormProps> = ({
  id,
  fields,
  onSubmit,
  rootPath,
  btnAndHandler,
}) => {
  const form = useAppSelector((state) => state.form);
  const fetchStatus = useAppSelector((state) => state.ui.fetchStatus);
  const { addData: addDataStatus, updateData: updateDataStatus } = fetchStatus;
  const dispatch = useAppDispatch();
  let formData = useRef<Record<string, any>>({});
  let timeOutId: any = null;
  useEffect(() => {
    return () => {
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
    };
  }, []);

  let isAllValid: boolean = true;
  const deepCopyForm = cloneDeep(form);
  const isFormValid = deepCopyForm.isFormValid ?? false;

  const formValidateHandler: FormValidate = (path, isValid) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    isAllValid = isValid === true ? isAllValid : isValid;
    if (isAllValid !== isFormValid) {
      timeOutId = setTimeout(() => {
        dispatch(formActions.changeFormValidity(isAllValid));
      }, 100);
    }

    if (Object.keys(form).length > 0 && path[0] in form) {
      const stringPath = convertPathToString(path);
      const value = _.get(deepCopyForm, `${stringPath}.value`);
      _.set(formData.current, stringPath, value);
    }
  };

  const cancelHandler = () => {
    dispatch(uiActions.toggleModal());
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    _.unset(formData.current, "url");
    _.unset(formData.current, "accordion");
    _.unset(formData.current, "isFormValid");
    onSubmit(formData.current[rootPath]);
  };

  const deleteItemHandler: OnDelete = (e, path) => {
    e.preventDefault();

    const index = fields.findIndex((field) => path[1] in field);
    const fieldsPath = path.slice(1);
    fieldsPath.unshift(index);

    const stringPath = convertPathToString(path.slice(0, -1));
    const stringFieldsPath = convertPathToString(fieldsPath.slice(0, -1));

    _.pullAt(
      _.get(fields, stringFieldsPath),
      fieldsPath[fieldsPath.length - 1] as number
    );
    _.pullAt(
      _.get(formData.current, stringPath),
      path[path.length - 1] as number
    );
    dispatch(formActions.deleteItem(path));
    dispatch(
      formActions.setCollapsed([
        path[0],
        "accordion",
        path.reduce((accordionKey: string, item) => accordionKey + item, ""),
      ])
    );
  };

  return (
    <form id={id} className={classes.form} onSubmit={submitHandler}>
      {fields.map((field, index) => (
        <FormItem
          key={`field-${index}`}
          item={field}
          rootPath={rootPath}
          onValidate={formValidateHandler}
          onDelete={deleteItemHandler}
        />
      ))}
      <div className={classes["form__btns"]}>
        <button
          type="button"
          className={`modal__btn modal__btn--cancel`}
          onClick={cancelHandler}
        >
          Cancel
        </button>
        {btnAndHandler && (
          <button
            type="button"
            className={`modal__btn modal__btn--${btnAndHandler.title}`}
            onClick={(e: MouseEvent) => btnAndHandler.handler(e, fields)}
          >
            {formatTitle(btnAndHandler.title)}
          </button>
        )}
        <button
          type="submit"
          className={`modal__btn  modal__btn${
            id === ModalType.EDIT ? "--edit" : "--add"
          } ${classes["form__btn--submit"]} ${
            [addDataStatus, updateDataStatus].includes("loading")
              ? "modal__btn--loading"
              : ""
          }`}
          disabled={!isFormValid}
        >
          {formatTitle(id)}
        </button>
      </div>
    </form>
  );
};

export default Form;
