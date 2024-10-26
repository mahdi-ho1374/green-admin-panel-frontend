import React, { FC } from "react";
import classes from "./Delete.module.css";
import { PiWarningCircleBold } from "react-icons/pi";

interface DeleteProps {
  id: string;
  onDelete: () => void;
  closeModal?: () => {};
}

const Delete: FC<DeleteProps> = ({ id,closeModal,onDelete}) => {

  return (
    <div id={id} className={classes.delete}>
      <PiWarningCircleBold className={classes.delete__warning} />
      <div className={classes.delete__content}>
        <div className={classes.delete__title}>Are you sure?</div>
        <div className={classes.delete__paragraph}>
          After deleting you can not retrieve this data
        </div>
        <div className={classes.delete__btns}>
          <button
            className="modal__btn modal__btn--cancel"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="modal__btn modal__btn--delete"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
