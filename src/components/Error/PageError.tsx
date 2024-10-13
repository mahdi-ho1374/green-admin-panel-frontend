import React, { FC } from "react";
import classes from "./Error.module.css";
import { CustomError, FetchStatus } from "../../types/ui";
import { useAppSelector } from "../../hooks/useReduxHooks";
import { IoReload } from "react-icons/io5";

interface ConnectionErrorType {
  status: FetchStatus;
  onReload: () => void;
  customError?: CustomError;
}

interface CustomErrorType {
  customError: CustomError;
  status?: FetchStatus;
  onReload: () => void;
}

type PageErrorProps = ConnectionErrorType | CustomErrorType;

const PageError: FC<PageErrorProps> = ({ customError, status, onReload }) => {
  const connectionError = useAppSelector((state) => state.ui.connectionError);
  const error = customError || connectionError;

  if (customError || (status === "error" && connectionError)) {
    return (
      <div className={classes["error__container"]}>
        <div>
        <div className={classes["error__top"]}>
          <div className={classes["error__status"]}>{error!.status}</div>
          <div className={classes["error__title"]}>{error!.title}</div>
        </div>
        <div className={classes["error__message"]}>{error!.message}</div>
        </div>
        {connectionError && <IoReload
          className={`${classes["error__reload-icon"]} ${classes["error__reload-icon--page"]}`}
          onClick={onReload}
        />}
      </div>
    );
  } else {
    return <></>;
  }
};

export default PageError;
