import { MouseEvent } from "react";
import { BtnType } from "./ui";
import { Dayjs } from "dayjs";

export type Path = (string | number)[];

export enum FormFieldType {
  INPUT = "input",
  SELECT = "select",
  TEXTBOX = "textbox",
}

export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  SEARCH = "search",
  CHECKBOX = "checkbox",
}

export type FormValidate = (path: Path, isValid: boolean) => void;

export interface ChangeValuePayload {
  path: Path;
  value: string | number | boolean | Date;
  isExpanded?: boolean;
  url?: string;
}

export type InitializePayload = ChangeValuePayload;

export interface FormFieldProps {
  title: string;
  id?: string;
  formFieldType?: FormFieldType;
  initialValue?: number | string | boolean;
  inputType?: InputType;
  validators?: Validator[];
  min?: number;
  max?: number | { [prop: string]: number };
  values?: (string | number)[];
  disabled?: boolean;
  path: Path;
  url?: string;
  match?: boolean;
  text?: string;
  onValidate?: FormValidate;
  onDelete?: OnDelete;
}

export interface SelectProps {
  title?: string;
  values: (string | number)[];
  initialValue: number | string;
  disabled?: boolean;
  path: Path;
  reverseColor?: boolean;
  validators?: Validator[];
  onValidate?: FormValidate;
  url?: string;
  id?: string;
}

export interface SearchInputProps {
  title?: string;
  initialValue?: string,
  path: Path,
  disabled?: boolean,
  url: string,
  validators?: Validator[],
  icon?: boolean,
  autoComplete?: boolean,
  text?: string,
  onSearch?: (value: string) => void,
  onValidate?: FormValidate,
}

export interface MixedInputProps {
  title: string;
  id?: string;
  initialValue?: number | string | boolean | any;
  inputType?: InputType;
  validators?: Validator[];
  min?: number;
  max?: number | { [prop: string]: number };
  disabled?: boolean;
  path: Path;
  url?: string;
  match?: boolean;
  onValidate?: FormValidate;
}

export interface CheckBoxProps {
  id?: string;
  title?: string;
  vertical?: boolean;
  initialValue?: boolean;
  validators?: Validator[];
  disabled?: boolean;
  onValidate?: FormValidate;
  path: Path;
  inputType?: InputType;
}

export interface FormFieldData {
  value: string | number | boolean;
  touched?: boolean;
  isExpanded?: boolean;
}

export type BtnProps = { btn: BtnType; handler?: () => void };

export type FormProperties = FormFieldProps | BtnProps;

export type Field =
  FormProperties
  | { [key: string]: FormProperties[][] }
  | { [key: string]: FormProperties[] };

export type Fields = Field[];

export interface FormProps {
  id: string;
  fields: Fields;
  onSubmit: (data: any) => void;
  closeModal?: () => {};
  rootPath: string;
  btnAndHandler?: {title: string,handler: (e: MouseEvent,fields: Fields) => void;};
}

export type OnDelete = (event: MouseEvent, path: Path) => void;

export interface UrlDataPayload {
  url: string;
  data: any;
  path: Path;
}

export type FormData = FormFieldData & { urlData: any; selectedUrlData: any };

export type FormState = any;

export interface Validator {
  validate(value: number | string | boolean): boolean;
  error: string;
}
