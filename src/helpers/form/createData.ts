import type { Fields, FormFieldProps } from "../../types/form";
import { FormFieldType, InputType } from "../../types/form";
import { Status } from "../../types/order";
import { ProductCategory } from "../../types/product";
import formValidators from "./validators";

const createFormDataForKey = (key: string, formFieldData: FormFieldProps) => {
  if (key === "age") {
    formFieldData.min = 18;
    formFieldData.max = 100;
    formFieldData.validators = [
      formValidators.minimumNumber(18),
      formValidators.maximumNumber(100),
    ];
  }
  if (["username", "name"].includes(key)) {
    formFieldData.validators = [
      formValidators.maximumCharacters(30),
      formValidators.minimumCharacters(3),
    ];
  }
  if (key === "address") {
    formValidators.minimumCharacters(8);
  }
  if (key === "password") {
    formFieldData.validators = [
      formValidators.isValidPassword(),
      formValidators.maximumCharacters(20),
      formValidators.minimumCharacters(8),
    ];
  }
  if (key === "category") {
    formFieldData.formFieldType = FormFieldType.SELECT;
    formFieldData.values = Object.values(ProductCategory);
  }
  if (key === "description") {
    formFieldData.validators = [formValidators.minimumCharacters(25)];
  }
  if (key === "price") {
    formFieldData.validators = [
      formValidators.minimumNumber(15),
      formValidators.maximumNumber(200),
    ];
  }
  if (key === "quantity") {
    formFieldData.validators = [formValidators.maximumNumber(150)];
  }
  if (["username", "email"].includes(key)) {
    formFieldData.url = `${process.env.REACT_APP_BACKEND_URL}/admin/user/validate`;
    formFieldData.match = true;
  }
  if (key === "email") {
    formFieldData.validators = [formValidators.isValidEmail()];
  }
  if (["seen", "approved", "replied"].includes(key)) {
    formFieldData.inputType = InputType.CHECKBOX;
  }
  if (["text", "repliedText"].includes(key)) {
    formFieldData.formFieldType = FormFieldType.TEXTBOX;
  }
  if (key == "text") {
    formFieldData.validators = [formValidators.isFilled()];
  }
  if (key === "status") {
    formFieldData.formFieldType = FormFieldType.SELECT;
    formFieldData.values = Object.values(Status).filter(
      (item) => item !== "canceled"
    );
  }
};

export default function createFormData<
  T extends Record<string, any> | string[]
>(obj: T, add = false, allDisabled = false): Fields {
  let formData = [] as Fields;
  if (!add) {
    formData = Object.keys(obj).reduce((formData, key): Fields => {
      const value: any = obj[key as keyof T];
      if (typeof value === "object" && key === "user") {
        formData.push({
          user: createFormData(value, false, true) as FormFieldProps[],
        });
        return formData;
      }
      const formFieldData = {
        title: key,
        initialValue: value,
      } as FormFieldProps;
      if (typeof value === "number") {
        formFieldData.inputType = InputType.NUMBER;
        formFieldData.min = 0;
      }
      if (
        [
          "createdAt",
          "__v",
          "updatedAt",
          "orders",
          "password",
          "totalSpent",
        ].includes(key)
      ) {
        return formData;
      }
      if (
        ["_id", "salesNumber", "text", "name", "category"].includes(key) ||
        (key === "seen" && value === true) ||
        allDisabled
      ) {
        formFieldData.disabled = true;
      }
      createFormDataForKey(key, formFieldData);
      formData.push(formFieldData);
      return formData;
    }, [] as Fields);
  } else {
    obj.map((key: string) => {
      const searchUserUrl = `${process.env.REACT_APP_BACKEND_URL}/admin/users/search/byUsername`;
      if (key === "user") {
        const userData = {
          user: [
            {
              title: "_id",
              url: searchUserUrl,
              disabled: true,
            },
            {
              title: "username",
              url: searchUserUrl,
              inputType: InputType.SEARCH,
            },
          ],
        } as unknown as Record<string, FormFieldProps[]>;
        formData.push(userData);
        return;
      }
      const formFieldData = {
        title: key,
      } as FormFieldProps;
      if (
        [
          "age",
          "totalSpent",
          "quantity",
          "price",
          "salesNumber",
          "amount",
        ].includes(key)
      ) {
        formFieldData.inputType = InputType.NUMBER;
        formFieldData.min = ["totalSpent", "quantity", "salesNumber"].includes(
          key
        )
          ? 0
          : 1;
        formFieldData.disabled = ["totalSpent", "salesNumber"].includes(key)
          ? true
          : false;
        formFieldData.initialValue = key === "age" ? 18 : undefined;
      }
      createFormDataForKey(key, formFieldData);
      formData.push(formFieldData);
    });
  }
  return formData;
}
