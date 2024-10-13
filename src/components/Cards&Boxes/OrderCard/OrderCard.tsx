import React,{FC,ReactNode} from 'react';
import classes from "./OrderCard.module.css";
import {Status, type TableOrder,type Order } from '../../../types/order';
import { BiSolidUser } from "react-icons/bi";
import { FaSackDollar } from 'react-icons/fa6';
import { AiOutlineNumber } from 'react-icons/ai';
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import { ModalType } from '../../../types/ui';

export interface OrderCardProps {
    order: Order & TableOrder;
    buttonsAndHandlers: {
      element: ReactNode;
      name: ModalType;
      handler: (id: string) => void;
    }[];
}

const OrderCard:FC<OrderCardProps> = ({order,buttonsAndHandlers}) => {
  return (
        <div className={classes["orderCard"]}>
          <div className={classes["orderCard__top"]}>
            <div
              className={classes["orderCard__profile"]}
            >Order</div>
          </div>
          <div className={classes["orderCard__props"]}>
            <div className={classes["orderCard__prop"]}>
              <BiSolidUser className={classes["orderCard__icon"]} />
              <span>{order.user}</span>
            </div> 
            <div className={classes["orderCard__prop"]}>
              <FaSackDollar className={classes["orderCard__icon"]} />
              <span>{`$${order.totalPrice}`}</span>
            </div> 
            <div className={classes["orderCard__prop"]}>
              {order?.status === Status.DELIVERED && <FaCheckCircle className={classes["orderCard__delivered-icon"]}/>}
              {order?.status === Status.CANCELED && <MdCancel className={classes["orderCard__canceled-icon"]} />}
              {order?.status === Status.PENDING && <MdLocalShipping className={classes["orderCard__pending-icon"]}/>}
              <span>{order.status}</span>
            </div> 
            <div className={`${classes["orderCard__prop"]} ${classes["orderCard__prop--text"]}`}>
              <AiOutlineNumber className={classes["orderCard__icon"]} />
              <span>Products Count:</span>
              <span>{order.productsCount}</span>
            </div>
            <div className={`${classes["orderCard__prop"]} ${classes["orderCard__prop--text"]}`}>
              <AiOutlineNumber className={classes["orderCard__icon"]} />
              <span>Items Count:</span>
              <span>{order.itemsCount}</span>
            </div>
          </div>  
          {buttonsAndHandlers.map((button, index) => (
          <button
            key={button.element + "-" + index}
            className={`actions__btn actions__btn--${button.name} ${classes[`orderCard__btn--${button.name}`]}`}
            onClick={() => button.handler(order._id)}
          >
            {button.element}
          </button>
        ))}
        </div>  
  )
}

export default OrderCard