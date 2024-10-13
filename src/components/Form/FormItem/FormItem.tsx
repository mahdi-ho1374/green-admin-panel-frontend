import React, { FC } from "react";
import classes from "../Form.module.css";
import formatTitle from "../../../helpers/ui/formatTitle";
import formatArrayIndexTitle from "../../../helpers/ui/formatArrayIndexTitle";
import {
  type OnDelete,
  type Field,
  type FormFieldProps,
  type FormValidate,
  type Path,
  FormProperties,
  BtnProps,
} from "../../../types/form";
import Accordion from "../FormAccordion/FormAccordion";
import FormField from "../FormField/FormField";

interface FormItemProps {
  title?: string;
  item: Field | FormFieldProps[] | FormFieldProps[][];
  path?: Path;
  rootPath?: string;
  onValidate?: FormValidate;
  onDelete?: OnDelete;
}

const FormItem: FC<FormItemProps> = (props) => {
  const { item, onValidate, onDelete, title, rootPath } = props;
  const path = props.path || [rootPath as string];

  if ("title" in item) {
    return (
      <FormField
        {...(props as FormFieldProps)}
        item={item as FormFieldProps}
        path={path}
      />
    );
  }

  if ("btn" in item) {
    return (
      <div className={classes["form__btn-container"]}>
        <button
          className={`modal__btn modal__btn--delete ${classes["form__btn--delete"]}`}
          onClick={(e) => onDelete!(e, path)}
        >
          {(item as BtnProps).btn}
        </button>
      </div>
    );
  }

  if (Array.isArray(item) && item.some((item) => "title" in item)) {
    const items = item as FormFieldProps[];
    return (
      <>
        {items.map((item: FormFieldProps) => (
          <FormField {...props} item={item} path={path} />
        ))}
      </>
    );
  }

  if (
    (Array.isArray(item) && !item.some((item) => "title" in item)) ||
    (!Array.isArray(item) && !("title" in item))
  ) {
    const isArray = Array.isArray(item);
    const entities = isArray ? item : Object.keys(item);
    if (entities.length < 1) {
      return <div></div>;
    }
    return (
      <>
        {entities.map((entity, index) => {
          const updatedPath = isArray
            ? [...path, index]
            : [...path, entity as string];
          const accordionTitle =
            title && isArray
              ? formatArrayIndexTitle(title, index)
              : formatTitle(entity as string);
          const details = isArray
            ? (entity as FormFieldProps[])
            : item[entity as keyof typeof item];
          const itemTitle = isArray ? undefined : (entity as string);
          return (
            <Accordion
              key={`field-accordion${updatedPath.reduce(
                (text: string, prop, index) => text + "-" + prop + index,
                ""
              )}`}
              {...props}
              path={updatedPath}
              title={accordionTitle}
              item={details as FormProperties[]}
              itemTitle={itemTitle}
            />
          );
        })}
      </>
    );
  } else {
    return <div></div>;
  }
};

export default FormItem;
