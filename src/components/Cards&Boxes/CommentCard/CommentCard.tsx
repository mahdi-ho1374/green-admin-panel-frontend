import React, { FC, ReactNode } from "react";
import classes from "./CommentCard.module.css";
import { BiSolidUser } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import type { Comment, TableComment } from "../../../types/comment";
import { ModalType } from "../../../types/ui";
import { FaComment } from "react-icons/fa";

export interface commentCardProps {
  comment: Comment & TableComment;
  buttonsAndHandlers: {
    element: ReactNode;
    name: ModalType;
    handler: (id: string) => void;
  }[];
}

const CommentCard: FC<commentCardProps> = ({ comment, buttonsAndHandlers }) => {
  return (
    <div className={classes["commentCard"]}>
      <div className={classes["commentCard__top"]}>
        <div className={classes["commentCard__profile"]}><FaComment /></div>
      </div>
      <div className={classes["commentCard__props"]}>
        <div className={`${classes["commentCard__prop"]} ${classes["commentCard__prop--column-3"]}`}>
          <BiSolidUser className={classes["commentCard__icon"]} />
          <span>{comment.user}</span>
        </div>
        <div
          className={`${classes["commentCard__prop"]} `}
        >
          {comment?.seen === true ? (
            <FaEye className={classes["commentCard__icon"]} />
          ) : (
            <FaEyeSlash className={classes["commentCard__icon"]} />
          )}
        </div>
        <div
          className={`${classes["commentCard__prop"]} ${classes["commentCard__prop--center"]}`}
        >
          {comment?.approved === true ? (
            <FaThumbsUp className={classes["commentCard__icon"]} />
          ) : (
            <FaThumbsDown className={classes["commentCard__icon"]} />
          )}
        </div>
        <div
          className={`${classes["commentCard__prop"]} ${classes["commentCard__prop--end"]}`}
        >
          {comment?.replied === true ? (
            <FaReply className={classes["commentCard__icon"]} />
          ) : (
            <FaReply
              className={`${classes["commentCard__icon"]} ${classes["commentCard__icon--notReplied"]}`}
            />
          )}
        </div>
        <div
          className={`${classes["commentCard__prop"]} ${classes["commentCard__prop--column-3"]}`}
        >
          {buttonsAndHandlers.map((button, index) => (
            <button
              key={button.element + "-" + index}
              className={`actions__btn actions__btn--${button.name} ${
                classes[`commentCard__btn--${button.name}`]
              }`}
              onClick={() => button.handler(comment._id)}
            >
              {button.element}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
