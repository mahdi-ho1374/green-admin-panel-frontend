import type { Data } from "./generic";

const user = {
  _id: "",
  username: "",
  firstName: "",
  lastName: "",
  gender: "",
  password: "",
  age: 0,
  phone: "",
  email: "",
  address: "",
  orders: [""],
  totalSpent: 2,
  createdAt: new Date(),
  updatedAt: new Date()
};

export type User = typeof user;

const { _id, orders, totalSpent,createdAt,updatedAt, ...formKeys } = user;

export const UserFormKeys = Object.keys(formKeys);

export interface TableUser {
  _id: string;
  username: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CardUser = TableUser & {
  phone: string;
}

export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  username: "username",
  email: "email",
  totalspent: "totalSpent",
  orderscount: "ordersCount",
  createdat: "createdAt",
  updatedat: "updatedAt",
} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

export type AllowedSortKeys = keyof typeof allowedSortProps;

export const allowedFilterProps = {
  totalspent: "totalSpent",
  orderscount: "ordersCount",
  createdat: "createdAt",
  updatedat: "updatedAt"
} as const;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export interface ChartUser {
  _id: { month: number; year: number; day?:number; };
  month?: string;
  year?: number;
  day?: number;
  signUp: number;
  firstBuy: number;
}

export interface UsersData extends Data {
  data: { main: User[] | null; chart: ChartUser[] | null; search: User[] | null; };
  sortField?: AllowedSortProps;
  filterField?: AllowedFilterProps;
}
