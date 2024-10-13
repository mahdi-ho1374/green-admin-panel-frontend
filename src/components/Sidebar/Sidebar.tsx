import React, { FC } from "react";
import classes from "./Sidebar.module.css";
import { BiSolidDashboard } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";
import { BsBoxFill } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { BiSolidComment } from "react-icons/bi";
import NavLink from "./NavLink/NavLink";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { FaDollarSign } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { uiActions } from "../../store/slices/ui";

const navLinksData = [
  {
    text: "dashboard",
    icon: <BiSolidDashboard className={classes["nav__icon"]} />,
  },
  { text: "users", icon: <HiUsers className={classes["nav__icon"]} /> },
  { text: "products", icon: <BsBoxFill className={classes["nav__icon"]} /> },
  { text: "orders", icon: <FaCartShopping className={classes["nav__icon"]} /> },
  {
    text: "comments",
    icon: <BiSolidComment className={classes["nav__icon"]} />,
  },
  {
    text: "sales",
    icon: <FaDollarSign className={classes["nav__icon"]} />,
  },
];

const Sidebar: FC = () => {
  const { isNavVisible, isNavWide } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return isNavVisible ? (
    <nav
      className={`${classes.nav} ${
        isNavWide ? "" : `${classes["nav--narrow"]}`
      }`}
      id="nav"
    >
      {isNavWide ? (
        <img src="/my-logo.jpg" alt="logo" className={classes.logo} />
      ) : (
        ""
      )}
      <ul className={classes.nav__items}>
        {navLinksData.map((data) => (
          <NavLink key={`navLink-${data.text}`} {...data} />
        ))}
      </ul>
      {window.innerWidth < 992 && isNavVisible && (
        <MdClose
          className={classes["nav__close-btn"]}
          onClick={() => dispatch(uiActions.toggleNavVisibility())}
        />
      )}
    </nav>
  ) : (
    <></>
  );
};

export default Sidebar;
