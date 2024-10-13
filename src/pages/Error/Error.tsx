import React from "react";
import { useRouteError } from "react-router-dom";
import classes from "./Error.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopBar from "../../components/TopBar/TopBar";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { uiActions } from "../../store/slices/ui";
import useGeneralStyles from "../../hooks/useGeneralStyles";

const Error = () => {
  const isNavVisible = useAppSelector((state) => state.ui.isNavVisible);
  const dispatch = useAppDispatch();
  const error = useRouteError() as
    | any
    | { message: string; title: string; status: number };
  useGeneralStyles("error-page");
  const customError =
    "title" in error
      ? error
      : "statusText" in error
      ? {
          status: error.status,
          title: error.statusText,
          message: error.message,
        }
      : {
          status: 500,
          title: error.name,
          message: error.message,
        };

  const closeNav = () => dispatch(uiActions.toggleNavVisibility());

  return (
    <div className={classes.container}>
      <Sidebar />
      <div
        className={classes.page}
        id="error-page"
        onClick={isNavVisible && window.innerWidth < 992 ? closeNav : () => {}}
      >
        <TopBar />
        <main
          className={`${classes.main} ${
            isNavVisible ? "" : classes["main--invisible-nav"]
          }`}
        >
          <section className={classes["error__section"]}>
            <div className={classes["error__container"]}>
              <div className={classes["error__top"]}>
                <div className={classes["error__status"]}>
                  {customError.status}
                </div>
                <div className={classes["error__title"]}>
                  {customError.title}
                </div>
              </div>
              <div className={classes["error__message"]}>
                {customError.message}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Error;
