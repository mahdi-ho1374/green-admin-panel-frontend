import React, { FC, ReactElement, MouseEvent } from "react";
import classes from "../Sidebar.module.css";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import { NavLink as Link } from "react-router-dom";
import formatTitle from "../../../helpers/ui/formatTitle";
import { GenericKey } from "../../../types/generic";
import { useLocation, useRouteError } from "react-router-dom";

export interface NavLinkProp {
  text: string;
  icon: ReactElement;
}

const NavLink: FC<NavLinkProp> = ({ icon, text }) => {
  const error = useRouteError() as
    | any
    | { message: string; title: string; status: number };
  const sectionName = text.endsWith("s")
    ? text.split("").slice(0, -1).join("")
    : text;
  const location = useLocation();
  const path = useAppSelector(
    (state) => state?.generic[sectionName as GenericKey]?.lastPath?.all
  );
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode);

  const isNavWide = useAppSelector((state) => state.ui.isNavWide);
  let isActive = location.pathname.includes(text);
  if (error?.status === 404) {
    isActive = false;
  }

  const clickHandler = (e: React.MouseEvent) => {
    if (isActive) {
      e.preventDefault();
    }
  };

  return (
    <li className={classes.nav__item}>
      <Link
        to={path || text}
        className={`${classes.nav__link} ${
          isDarkMode ? classes["nav__link-dark"] : classes["nav__link-light"]
        } ${isNavWide ? "" : classes["nav__link--just-icon"]} ${
          !isActive
            ? ""
            : isDarkMode
            ? classes["nav__link-dark--active"]
            : classes["nav__link-light--active"]
        }`}
        onClick={clickHandler}
      >
        {icon}
        {isNavWide ? formatTitle(text) : ""}
      </Link>
    </li>
  );
};

export default NavLink;
