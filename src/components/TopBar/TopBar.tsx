import React, { FC, useEffect, useState } from "react";
import classes from "./TopBar.module.css";
import SearchInput from "../FormFields/SearchInput/SearchInput";
import { useLocation, useNavigate } from "react-router-dom";
import createKey from "../../helpers/createKey";
import Switch from "../FormFields/Switch/Switch";
import { MdColorLens } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { IoMdSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";
import { uiActions } from "../../store/slices/ui";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { FaTextSlash } from "react-icons/fa6";
import { BiText } from "react-icons/bi";

const TopBar: FC = () => {
  const [isOnSmallDevices, setIsOnSmallDevices] = useState(
    window.innerWidth < 768
  );
  const location = useLocation();
  const navigate = useNavigate();
  const {
    colors: uiColors,
    isBackgroundMode,
    isDarkMode,
    isNavVisible,
  } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const page = location.pathname.split("/")[1];
  const path = [page];
  const text = page.split("").slice(0, -1).join("");
  const url = `${process.env.REACT_APP_BACKEND_URL}/admin/${page}/search`;

  useEffect(() => {
    let resizeTimeout: any;

    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 768 && !isOnSmallDevices) {
          setIsOnSmallDevices(true);
        }
        if (window.innerWidth >= 768 && isOnSmallDevices) {
          setIsOnSmallDevices(false);
        }
      }, 200);
    };

    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [isOnSmallDevices]);

  const searchHandler = async (value: string) => {
    navigate(`/${page}/search?term=${value}`);
  };

  const menuVisibilityHandler = () => dispatch(uiActions.toggleNavVisibility());
  const menuButtonColor = isDarkMode ? uiColors.primary : uiColors.tertiary;

  const navWidthSwitch = (
    <Switch
      uncheckedIcon={<FaTextSlash fill={uiColors.text} />}
      checkedIcon={<BiText fill={uiColors.text} />}
      prop={"isNavWide"}
      action={uiActions.toggleNavWidth}
    />
  );
  const searchInput = (
    <div className={classes["header__input-group"]}>
      <SearchInput
        key={createKey(path, "url")}
        url={url}
        onSearch={searchHandler}
        path={[...path, "search"]}
        text={text}
        icon={true}
        autoComplete={true}
      />
    </div>
  );

  return (
    <header
      className={`${classes.header} ${
        isBackgroundMode ? "" : classes["header--withBackground"]
      }`}
    >
      <div className={classes["header__top"]}>
        {isNavVisible ? (
          <MdClose
            className={classes["header__icon"]}
            fill={menuButtonColor}
            onClick={menuVisibilityHandler}
          />
        ) : (
          <GiHamburgerMenu
            className={classes["header__icon"]}
            fill={menuButtonColor}
            onClick={menuVisibilityHandler}
          />
        )}

        {!isOnSmallDevices && searchInput}
        <div className={classes["header__right"]}>
          {navWidthSwitch}
          <Switch
            uncheckedIcon={<MdColorLens fill={uiColors.text} />}
            checkedIcon={<AiFillPicture fill={uiColors.text} />}
            prop="isBackgroundMode"
            action={uiActions.toggleBackgroundMode}
          />
          <Switch
            uncheckedIcon={<IoMdSunny fill={uiColors.text} />}
            checkedIcon={<IoMdMoon fill={uiColors.text} />}
            prop="isDarkMode"
            action={uiActions.toggleTheme}
          />
          <figure className={classes.header__profile}>
            <img
              src="/profile.jpg"
              alt="profile-image"
              className={classes["header__profile-img"]}
            />
            <figcaption
              className={classes["header__profile-caption"]}
            ></figcaption>
          </figure>
        </div>
      </div>
      {isOnSmallDevices && (
        <div className={classes["header__bottom"]}>{searchInput}</div>
      )}
    </header>
  );
};

export default TopBar;
