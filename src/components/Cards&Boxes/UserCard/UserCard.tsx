import React, { FC, ReactNode } from "react";
import classes from "./UserCard.module.css";
import { IoMdMail } from "react-icons/io";
import { AiFillPhone } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { ImLocation } from "react-icons/im";
import { FaSackDollar } from "react-icons/fa6";
import type { TableUser, User } from "../../../types/user";
import { ModalType } from "../../../types/ui";
import { AiOutlineNumber } from "react-icons/ai";

interface UserCardProps {
  user: User & TableUser;
  buttonsAndHandlers: {
    element: ReactNode;
    name: ModalType;
    handler: (id: string) => void;
  }[];
}

const UserCard: FC<UserCardProps> = ({ user, buttonsAndHandlers }) => {
  return (
    <div className={classes["userCard"]}>
      <div className={classes["userCard__top"]}>
        <img
          className={classes["userCard__profile"]}
          src="https://thispersondoesnotexist.com"
          alt="User-photo"
        />
        <div
          className={classes["userCard__title"]}
        >{`${user.firstName} ${user.lastName}`}</div>
      </div>
      <div className={classes["userCard__props"]}>
        <div className={classes["userCard__prop"]}>
          <BiSolidUser />
          <span>{user.username}</span>
        </div>
        <div className={classes["userCard__prop"]}>
          <IoMdMail />
          <span>{user.email}</span>
        </div>
        <div className={classes["userCard__prop"]}>
          <AiFillPhone />
          <span>{user.phone}</span>
        </div>

        <div className={classes["userCard__prop"]}>
          <ImLocation />
          <span>{user.address}</span>
        </div>
        <div className={`${classes["userCard__prop"]} ${classes["userCard__prop--column-1"]}`}>
          <FaSackDollar />
          <span>{user.totalSpent !== 0 ? `$${user.totalSpent}` : "---"}</span>
        </div>
        <div className={`${classes["userCard__prop"]} ${classes["userCard__prop--column-1"]}`}>
          <AiOutlineNumber />
          <span>{user.ordersCount !== 0 ? user.ordersCount : "---"}</span>
        </div>
      </div>
      <div className={`${classes["userCard__actions"]} actions`}>
        {buttonsAndHandlers.map((button, index) => (
          <button
            key={button.element + "-" + index}
            className={`actions__btn actions__btn--${button.name}`}
            onClick={() => button.handler(user._id)}
          >
            {button.element}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
