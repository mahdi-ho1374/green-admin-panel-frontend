import {
  Product,
  ProductsData,
  AllowedFilterProps as ProductAllowedFilterProps,
  AllowedSortProps as ProductAllowedSortProps,
  allowedFilterProps as productAllowedFilterProps,
  ChartProduct,
} from "./product";
import {
  Comment,
  CommentsData,
  AllowedFilterProps as CommentAllowedFilterProps,
  AllowedSortProps as CommentAllowedSortProps,
  allowedFilterProps as commentAllowedFilterProps,
  ChartComment,
} from "./comment";
import {
  User,
  UsersData,
  AllowedFilterProps as UserAllowedFilterProps,
  AllowedSortProps as UserAllowedSortProps,
  allowedFilterProps as userAllowedFilterProps,
  ChartUser,
} from "./user";
import {
  Order,
  OrdersData,
  AllowedFilterProps as OrderAllowedFilterProps,
  AllowedSortProps as OrderAllowedSortProps,
  allowedFilterProps as orderAllowedFilterProps,
  ChartOrder,
} from "./order";

export const sortType = {
  asc: "asc",
  desc: "desc",
  descending: "desc",
  ascending: "asc",
} as const;

export type SortType = (typeof sortType)[keyof typeof sortType] | "";

export type MinMaxTuple = [number, number];

export type View = "chart" | "card" | "main" | "search";

export type GenericSort =
  | UserAllowedSortProps
  | ProductAllowedSortProps
  | CommentAllowedSortProps
  | OrderAllowedSortProps
  | undefined;

export type GenericFilter =
  | UserAllowedFilterProps
  | ProductAllowedFilterProps
  | CommentAllowedFilterProps
  | OrderAllowedFilterProps
  | undefined;

export type Data = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  lastPath: { main: string; card: string; chart: string; all: string; search: string;};
  selectedDocumentId: string;
  sortBy?: SortType;
  dataChanged: boolean;
  minmax: { [key: string]: MinMaxTuple };
  withinRange?: boolean;
  filterTerm?: string;
  searchTerm: string;
};

export type FetchDataArg = {
  currentPage: number;
  perPage?: number;
  sortField?: GenericSort;
  sortBy?: SortType;
  filterField?: GenericFilter;
  filterTerm?: string;
  withinRange?: boolean;
};

export const { status: statusField, ...numberFields } = {
  ...userAllowedFilterProps,
  ...productAllowedFilterProps,
  ...orderAllowedFilterProps,
};
export const { createdat, updatedat ,...booleanFields} = commentAllowedFilterProps;

export const dateFields = {createdat: "createdAt", updatedat: "updatedAt"};

export const allowedPerPageValues = [20, 30, 50] as const;

export type GenericMainData = User[] | Product[] | Order[] | Comment[];
export type GenericDocument = User | Product | Order | Comment;
export type GenericChartData =
  | ChartComment[]
  | ChartUser[]
  | ChartOrder[]
  | ChartProduct[];

export type GenericState = {
  user: UsersData;
  product: ProductsData;
  order: OrdersData;
  comment: CommentsData;
};

export type GenericKey = "product" | "user" | "order" | "comment";

export interface EditDataPayload<T extends GenericDocument> {
  section: GenericKey;
  updatedDocument: T;
}

export type FetchedMainData = { data: GenericMainData; lastPage: number };

export interface SetMainDataPayload<
  T extends GenericMainData | null,
  S extends GenericSort,
  P extends GenericFilter
> {
  section: GenericKey;
  currentPage: number;
  perPage: number;
  lastPage: number;
  data: T;
  sortBy?: SortType;
  sortField?: S;
  filterField?: P;
  filterTerm?: string;
  withinRange?: boolean;
}

export interface SetChartDataPayload<W extends GenericChartData | null> {
  section: GenericKey;
  data: W;
}

export interface SetSearchDataPayload<T extends GenericMainData | null> {
  section: GenericKey;
  data: T;
  searchTerm: string;
}
