import React, { FC } from "react";
import classes from "../Form.module.css";
import type {
  Path,
  Field,
  FormFieldProps,
  FormValidate,
  OnDelete,
  SelectProps,
  MixedInputProps,
  CheckBoxProps,
  SearchInputProps,
} from "../../../types/form";
import { FormFieldType, InputType, BtnProps } from "../../../types/form";
import Select from "../../FormFields/Select/Select";
import CheckBox from "../../FormFields/CheckBox/CheckBox";
import MixedInput from "../../FormFields/MixedInput/MixedInput";
import SearchInput from "../../FormFields/SearchInput/SearchInput";
import TextBox from "../../FormFields/TextBox/TextBox";

interface ComponentProps {
  item: FormFieldProps;
  path?: Path;
  onValidate?: FormValidate;
  onDelete?: OnDelete;
}

const FormField: FC<ComponentProps> = (props) => {
  const { item, path, onValidate, onDelete } = props;
  if (item.formFieldType === FormFieldType.SELECT) {
    return (
      <div className={classes["form__select"]}>
        <Select
          {...(item as SelectProps)}
          values={item.values as (string | number)[]}
          path={[...(path as Path), (item as FormFieldProps).title]}
          onValidate={onValidate}
        />
      </div>
    );
  }
  if (item.formFieldType === FormFieldType.TEXTBOX) {
    return (
      <div className={classes["form__text-box"]}>
        <TextBox
          {...(item as FormFieldProps)}
          values={item.values as (string | number)[]}
          path={[...(path as Path), (item as FormFieldProps).title]}
          onValidate={onValidate}
        />
      </div>
    );
  }
  if (
    item.inputType === InputType.TEXT ||
    item.inputType === InputType.NUMBER ||
    (!item.inputType && !("btn" in item))
  ) {
    return (
      <div className={classes["form__mixed-input"]}>
        <MixedInput
          {...(item as MixedInputProps)}
          path={[...(path as Path), (item as FormFieldProps).title]}
          onValidate={onValidate}
        />
      </div>
    );
  }
  if (item.inputType === InputType.SEARCH) {
    return (
      <div className={classes["form__search-input"]}>
        <SearchInput
          {...(item as SearchInputProps)}
          path={[...(path as Path), (item as FormFieldProps).title]}
          onValidate={onValidate}
        />
      </div>
    );
  }
  if (item.inputType === InputType.CHECKBOX) {
    return (
      <div className={classes["form__checkbox"]}>
        <CheckBox
          {...(item as CheckBoxProps)}
          path={[...(path as Path), (item as CheckBoxProps).title!]}
          onValidate={onValidate}
        />
      </div>
    );
  }

  if ("btn" in item) {
    return (
      <div className={classes["form__btn-container"]}>
        <button
          className={`modal__btn modal__btn--delete ${classes["form__btn--delete"]}`}
          onClick={(e) => onDelete!(e, path as Path)}
        >
          {(item as BtnProps).btn}
        </button>
      </div>
    );
  } else {
    return <span></span>;
  }
};

export default FormField;
