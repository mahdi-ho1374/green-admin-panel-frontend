import React, { FC } from "react";
import classes from "./Error.module.css";
import { useAppSelector } from "../../hooks/useReduxHooks";
import { FetchStatus } from "../../types/ui";
import { IoReload } from "react-icons/io5";

interface BoxErrorProps {
  onReload: () => void;
  status: FetchStatus;
}

const BoxError: FC<BoxErrorProps> = ({ status, onReload }) => {
  const connectionError = useAppSelector((state) => state.ui.connectionError);

  return (
    <div>
      {status === "error" && connectionError && (
        <div className={classes["error__box"]}>
          {connectionError!.message}{" "}
          <IoReload
            className={classes["error__reload-icon"]}
            onClick={onReload}
          />
        </div>
      )}
      {status === "error" && !connectionError && (
        <IoReload
          className={classes["error__reload-icon"]}
          onClick={onReload}
        />
      )}
    </div>
  );
};

export default BoxError;
