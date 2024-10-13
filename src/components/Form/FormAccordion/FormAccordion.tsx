import React, { FC, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import classes from "../Form.module.css";
import { MdExpandMore } from "react-icons/md";
import type { OnDelete, FormValidate, Path } from "../../../types/form";
import FormItem from "../FormItem/FormItem";
import { useAppSelector, useAppDispatch } from "../../../hooks/useReduxHooks";
import { formActions } from "../../../store/slices/form";
import convertPathToString from "../../../helpers/convertPathToString";

interface FormAccordionProps {
  path: Path;
  title: string;
  itemTitle: string | undefined;
  item: Record<string, any> | any[];
  onValidate?: FormValidate;
  onDelete?: OnDelete;
}

const FormAccordion: FC<FormAccordionProps> = ({
  title,
  path,
  item,
  itemTitle,
  onValidate,
  onDelete,
}) => {
  const prop = convertPathToString(path, true);
  const accordionPath = [path[0], "accordion", prop];
  const isExpanded: boolean = useAppSelector(
    ({ form }) => form?.[path[0]]?.accordion?.[prop]?.isExpanded ?? true
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(formActions.initialize({ path: accordionPath, value: "" }));
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const disabled = !item || Object.keys(item).length < 1;

  return (
    <Accordion
      className={`${classes["form__accordion"]} ${
        !item || Object.keys(item).length < 1
          ? classes["form__accordion--disabled"]
          : ""
      } ${isExpanded ? classes["form__accordion--expanded"] : ""}`}
      TransitionProps={{ unmountOnExit: false }}
      id="form__accordion"
      expanded={
        disabled
          ? false
          : item || Object.keys(item).length > 1
          ? isExpanded
          : false
      }
      disabled={disabled}
    >
      <AccordionSummary
        className={classes["form__accordion-header"]}
        expandIcon={
          <div className={classes["form__icon-container"]}>
            <MdExpandMore className={classes["form__icon"]} />
          </div>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
        onClick={() => dispatch(formActions.toggleExpanded(accordionPath))}
      >
        <Typography className={classes["form__title"]} id="form__title">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes["form__content"]}>
          <FormItem
            item={item}
            title={itemTitle}
            path={path}
            onValidate={onValidate}
            onDelete={onDelete}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default FormAccordion;
