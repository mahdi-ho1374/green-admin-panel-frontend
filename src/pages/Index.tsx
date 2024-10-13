import React, { FC, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { Outlet } from "react-router-dom";
import classes from "./Index.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import { useNavigate, useLocation } from "react-router-dom";
import { uiActions } from "../store/slices/ui";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import useTheme from "../hooks/useTheme";
import useGeneralStyles from "../hooks/useGeneralStyles";
import Swal from "sweetalert2";
import CheckBox from "../components/FormFields/CheckBox/CheckBox";
import Modal from "../components/Modal/Modal";

const Index: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isNavVisible, showModal } = useAppSelector((state) => state.ui);
  const muiTheme = useTheme();
  const dispatch = useAppDispatch();

  const restrictedAlertShowLS = JSON.parse(
    localStorage.getItem("restrictedAlert") || "true"
  );
  useGeneralStyles("page");

  useEffect(() => {
    if (location.pathname.trim() === "/") {
      navigate("dashboard", { replace: true });
    }
  }, []);

  const closeNav = () => dispatch(uiActions.toggleNavVisibility());

  return (
    <ThemeProvider theme={muiTheme}>
      <div className={classes.container}>
        <IoArrowUpCircleOutline
          className={classes.scrollUp}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <Sidebar />
        <div
          className={classes.page}
          id="page"
          onClick={
            isNavVisible && window.innerWidth < 992 ? closeNav : () => {}
          }
        >
          <TopBar />
          <main
            className={`${classes.main} ${
              isNavVisible ? "" : classes["main--invisible-nav"]
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
