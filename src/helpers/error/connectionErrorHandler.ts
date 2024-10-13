import { Dispatch } from "@reduxjs/toolkit";
import { uiActions } from "../../store/slices/ui";

const connectionErrorHandler = (dispatch: Dispatch, key: string) => {
  const storedTimestamps = localStorage.getItem("connectionTimestamps");
  const connectionTimestamps = storedTimestamps
    ? JSON.parse(storedTimestamps)
    : [];
  const lastIndex = connectionTimestamps.length - 1;
  const lastTimestamp = connectionTimestamps?.[lastIndex] || 0;
  if (Date.now() - lastTimestamp > 20000) {
    connectionTimestamps.push(Date.now());
  }
  if (connectionTimestamps.length > 3) {
    dispatch(
      uiActions.setError({
        title: "Oops",
        status: navigator.onLine ? 500 : 400,
        message: navigator.onLine
          ? "Something went wrong.Please try again in a few minutes!"
          : "Make sure you are online and try again",
      })
    );
  }
  localStorage.setItem(
    "connectionTimestamps",
    JSON.stringify(connectionTimestamps)
  );
  dispatch(uiActions.setFetchStatus({ key, status: "error" }));
};

export default connectionErrorHandler;
