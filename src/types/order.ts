import { User } from "./user";
import { Data } from "./generic";

export interface Product {
  _id: string;
  name: string;
  price: number | { $numberDecimal: number };
  amount: number;
}

const order = {
  _id: "",
  user: {} as User | undefined,
  items: [] as Product[],
  totalPrice: 2,
  status: "" as Status,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type Order = typeof order;

export const orderFormKeys = ["user", "status"];

export enum Status {
  DELIVERED = "delivered",
  CANCELED = "canceled",
  PENDING = "pending",
}

export type TableOrder = Omit<Order, "items" | "user"> & {
  user: string;
  productsCount: number;
  itemsCount: number;
};

export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  user: "user",
  totalprice: "totalPrice",
  itemscount: "itemsCount",
  productscount: "productsCount",
  status: "status",
  createdat: "createdAt",
  updatedat: "updatedAt"
} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

export type AllowedSortKeys = keyof typeof allowedSortProps;

const { id, _id, user, ...otherKeys } = allowedSortProps;
export const allowedFilterProps = otherKeys;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export interface ChartOrder {
  _id: { month: number; year: number; day?:number; };
  month?: string;
  year?: number;
  day?: number;
  orders: number;
}

export interface OrdersData extends Data {
  data: { main: Order[] | null; chart: ChartOrder[] | null; search: Order[] | null;};
  sortField?: AllowedSortProps;
  filterField?: AllowedFilterProps;
}
