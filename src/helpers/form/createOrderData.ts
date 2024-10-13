import type { Product } from "../../types/product";
import sortObjectKeys from "../ui/sortObjectKeys";
import createFormData from "./createData";
import type { Fields, FormProperties, Field } from "../../types/form";
import { Status } from "../../types/order";
import { InputType } from "../../types/form";
import { BtnType } from "../../types/ui";
import { FormFieldType } from "../../types/form";
import { FormFieldProps } from "../../types/form";
import type { Order } from "../../types/order";

export interface CreateItemFormDataProps {
  itemsFormField: { [key: string]: FormFieldProps[][] };
  products?: Product[];
  status?: Status;
}

type OrderParams = {
  orderId: string;
  orders: Order[];
  formData?: never;
};

type FormDataParams = {
  orderId?: never;
  orders?: never;
  formData: Fields;
};

type CreateOrderFormDataProps = OrderParams | FormDataParams;

const createItemsFormData = ({
  itemsFormField,
  products,
  status,
}: CreateItemFormDataProps) => {
  const itemsFormFieldValue = (
    itemsFormField as unknown as { [key: string]: FormFieldProps[][] }
  ).items.map((item, index) => {
    let currentProduct: null | Product = null;
    item.map((prop) => {
      prop.url = `${process.env.REACT_APP_BACKEND_URL}/admin/products/search/byName/${index}`;
      prop.text = "product";
      if (prop.title === "name") {
        prop.inputType = InputType.SEARCH;
        prop.disabled = Status.DELIVERED === status;
      }
      if (prop.title === "price") {
        prop.disabled = true;
        prop.inputType = InputType.NUMBER;
      }
      if (prop.title === "_id") {
        prop.disabled = true;
        currentProduct = products?.find(
          (product) => product._id === prop.initialValue
        ) as Product;
      }
      if (prop.title === "amount") {
        prop.max = { quantity: currentProduct?.quantity || 0 };
        prop.disabled = status === Status.DELIVERED;
      }
      return prop;
    });
    !item.some((field) => "btn" in field) &&
      (item as FormProperties[]).push({ btn: BtnType.DELETE });
    return item;
  }) as FormFieldProps[][];
  return { items: itemsFormFieldValue };
};

export default async ({
  orderId,
  orders,
  formData,
}: CreateOrderFormDataProps) => {
  if (formData) {
    const index = formData.findIndex((item) => "items" in item);
    index < 0 && formData.push({ items: [] });
    let itemsFormField: { [key: string]: FormFieldProps[][] } = formData.find(
      (item) => "items" in item
    ) as { [key: string]: FormFieldProps[][] };
    itemsFormField["items"].push(
      createFormData(
        ["_id", "name", "price", "amount"],
        true
      ) as FormFieldProps[]
    );

    createItemsFormData({ itemsFormField });

    return formData as Fields;
  }
  let products: Product[] | null = null;
  const selectedOrder = orderId
    ? sortObjectKeys(orders!.filter((order: any) => order._id === orderId)[0])
    : {};
  const ids: string[] = selectedOrder.items.map((item: any) => item._id);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/admin/products/byId`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: ids }),
      }
    );
    products = await response.json();

    const initialFormData = createFormData(selectedOrder);
    let status: Status | null = null;
    const completedFormData = (initialFormData as FormFieldProps[]).reduce(
      (data, item): Fields => {
        if (item.title === "status") {
          item.values = Object.values(Status);
          item.formFieldType = FormFieldType.SELECT;
          status = item.initialValue as Status;
          item.disabled = status === Status.CANCELED;
        }
        if (item.title === "totalPrice") {
          return data;
        }
        if (item.title === "items") {
          (item as unknown as { [key: string]: FormFieldProps[][] }).items = (
            item.initialValue as any
          ).map((value: Record<string, any>) => {
            return createFormData(value);
          });
          createItemsFormData({
            itemsFormField: item as unknown as {
              [key: string]: FormFieldProps[][];
            },
            products: products!,
            status: status!,
          });
          delete item.initialValue;
          delete (item as unknown as { [key: string]: FormFieldProps[][] })
            .title;
        }
        data.push(item as unknown as Field);
        return data;
      },
      [] as Fields
    );
    return completedFormData;
  } catch (err: any) {
    throw { title: "OOps", message: "Something went wrong!", status: 500 };
  }
};
