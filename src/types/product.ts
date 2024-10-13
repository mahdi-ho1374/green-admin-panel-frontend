import type { Data } from "./generic";

export enum ProductCategory {
  TechEssentials = "Tech Essentials",
  OutdoorAdventures = "Outdoor Adventures",
  HomeAndLifestyle = "Home & Lifestyle",
  FashionForward = "Fashion Forward",
  HealthAndWellness = "Health & Wellness",
};

const product = {
  _id: "",
  name: "",
  price: 2,
  quantity: 3,
  description: "",
  salesNumber: 3,
  category: "" as ProductCategory,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type Product = typeof product;

const { _id: ID, salesNumber, createdAt, updatedAt, ...formKeys } = product;

export const productFormKeys = Object.keys(formKeys);

export type TableProduct = Product & {
  revenue: number;
};
export const allowedSortProps = {
  id: "_id",
  _id: "_id",
  name: "name",
  quantity: "quantity",
  price: "price",
  salesnumber: "salesNumber",
  revenue: "revenue",
} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

const { id, _id, name, ...otherKeys } = allowedSortProps;
export const allowedFilterProps = otherKeys;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export interface ChartProduct {
  _id?: {month: number;year: number;};
  month?: string;
  year?: number;
  revenue: {ProductCategory: number}[];
  amount: {ProductCategory: number}[];
}

export interface ProductsData extends Data {
  data: {main: Product[] | null; chart: ChartProduct[] | null; search: Product[] | null;}
  sortField?: AllowedSortProps;
  filterField?: AllowedFilterProps;
}

