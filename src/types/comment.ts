import { User } from "./user";
import { Data } from "./generic";

const comment = {
  _id: "",
  user: {} as User | undefined,
  approved: true,
  seen: true,
  replied: true,
  text: "",
  repliedText: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type Comment = typeof comment;

const { _id: ID, createdAt, updatedAt, ...formKeys } = comment;

export const commentFormKeys = Object.keys(formKeys);

export type TableComment = {
  user: string;
  approved: boolean;
  seen: boolean;
  replied: boolean;
};

export const allowedSortProps = {
  _id: "_id",
  id: "_id",
  user: "user",
  approved: "approved",
  seen: "seen",
  replied: "replied",
  createdat: "createdAt",
  updatedat: "updatedAt",
} as const;

export type AllowedSortProps =
  (typeof allowedSortProps)[keyof typeof allowedSortProps];

const { id, _id, user, ...otherKeys } = allowedSortProps;
export const allowedFilterProps = otherKeys;

export type AllowedFilterProps =
  (typeof allowedFilterProps)[keyof typeof allowedFilterProps];

export interface ChartComment {
  _id: { month: number; year: number;day?: number; };
  month?: string | number;
  year?: number;
  day?: number;
  comments: number;
}

export interface CommentsData extends Data {
  data: { main: Comment[] | null; chart: ChartComment[] | null; search: Comment[] | null; };
  sortField?: AllowedSortProps;
  filterField?: AllowedFilterProps;
}
