import { GenericKey, GenericMainData } from "../../types/generic";
import type { TableUser, User } from "../../types/user";
import type { Order, TableOrder } from "../../types/order";
import type { Comment, TableComment } from "../../types/comment";
import type { Product, TableProduct } from "../../types/product";

interface CreateDataProps {
  section: GenericKey;
  data: GenericMainData;
  isForTable?: boolean;
}

export default ({ section, data, isForTable }: CreateDataProps) => {
  if (!data || data.length < 1) {
    return null;
  }
  switch (section) {
    case "user": {
      return (data as User[]).map(
        (
          { _id, username, email, totalSpent, orders, createdAt, updatedAt },
          index
        ) => {
          const ordersCount = orders.length;
          const tableUser = {
            _id,
            username,
            email,
            totalSpent,
            ordersCount,
            createdAt,
            updatedAt,
          };
          return isForTable ? tableUser : { ...data[index], ...tableUser };
        }
      ) as TableUser[];
    }
    case "order": {
      return (data as Order[]).map(
        (
          { _id, user, totalPrice, status, items, createdAt, updatedAt },
          index
        ) => {
          const itemsCount = items.reduce(
            (count, item) => item.amount + count,
            0
          );
          const tableOrder = {
            _id,
            user: user?.username,
            totalPrice,
            productsCount: items.length,
            itemsCount,
            status,
            createdAt,
            updatedAt,
          };
          return isForTable ? tableOrder : { ...data[index], ...tableOrder };
        }
      ) as TableOrder[];
    }
    case "comment": {
      return (data as Comment[]).map(
        (
          { _id, user, seen, approved, replied, createdAt, updatedAt },
          index
        ) => {
          const tableComment = {
            _id,
            user: user?.username,
            seen,
            approved,
            replied,
            createdAt,
            updatedAt,
          };
          return isForTable
            ? tableComment
            : { ...data[index], ...tableComment };
        }
      ) as TableComment[];
    }
    case "product": {
      return (data as Product[]).map(
        ({ _id, name, price, quantity, salesNumber }, index) => {
          const revenue = price * salesNumber;
          const tableProduct = {
            _id,
            name,
            price,
            quantity,
            salesNumber,
            revenue,
          };
          return isForTable
            ? tableProduct
            : { ...data[index], ...tableProduct };
        }
      ) as TableProduct[];
    }
  }
};
