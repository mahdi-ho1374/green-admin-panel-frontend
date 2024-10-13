import React, { FC, ReactElement } from "react";
import classes from "./TotalIndicator.module.scss";
import formatTitle from "../../../helpers/ui/formatTitle";
import { HiUsers } from "react-icons/hi";
import { BsBoxFill } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { BiSolidComment } from "react-icons/bi";
import { AiOutlineNumber } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoTrendingUp } from "react-icons/io5";
import { IoTrendingDown } from "react-icons/io5";

interface TotalIndicatorProps {
  title: string;
  value: string | number;
  percentageChange?: number;
}

const TotalIndicator: FC<TotalIndicatorProps> = ({
  title,
  value,
  percentageChange,
}) => {
  const icons = {
    user: <HiUsers className={classes["totalIndicator__main-icon"]} />,
    customer: <HiUsers className={classes["totalIndicator__main-icon"]} />,
    product: <BsBoxFill className={classes["totalIndicator__main-icon"]} />,
    order: <FaCartShopping className={classes["totalIndicator__main-icon"]} />,
    comment: (
      <BiSolidComment className={classes["totalIndicator__main-icon"]} />
    ),
    amount: (
      <AiOutlineNumber className={classes["totalIndicator__main-icon"]} />
    ),
    revenue: (
      <BsCurrencyDollar className={classes["totalIndicator__main-icon"]} />
    ),
  };

  const icon = Object.keys(icons).reduce(
    (icon: ReactElement | string, key) =>
      title.toLowerCase().includes(key)
        ? icons[key as keyof typeof icons]
        : icon,
    ""
  );

  return (
    <div className={classes["totalIndicator"]}>
      <h2 className={classes["totalIndicator__title"]}>{formatTitle(title)}</h2>
      <div className={classes["totalIndicator__value"]}>
        <span>{`${
          title.toLowerCase().endsWith("revenue") ? "$" : ""
        }${value}`}</span>
        {![undefined, null].includes(percentageChange as any) && (
          <div className={classes["totalIndicator__trend"]}>
            {percentageChange! > 0 ? (
              <IoTrendingUp
                className={`${classes["totalIndicator__trend-icon"]} ${classes["totalIndicator__trend-icon--up"]}`}
              />
            ) : (
              <IoTrendingDown
                className={`${classes["totalIndicator__trend-icon"]} ${classes["totalIndicator__trend-icon--down"]}`}
              />
            )}
            {
              <span
                className={`${classes["totalIndicator__trend-percentage"]} ${
                  percentageChange! > 0
                    ? classes["totalIndicator__trend-percentage--up"]
                    : classes["totalIndicator__trend-percentage--down"]
                }`}
              >{`${percentageChange!.toFixed(2)}%`}</span>
            }
            {
              <span className={classes["totalIndicator__trend-label"]}>
                <span>Month</span> <span>Over</span> <span>Month</span>
              </span>
            }
          </div>
        )}
      </div>
      <div className={classes["totalIndicator__main-icon-container"]}>
        {icon}
      </div>
    </div>
  );
};

export default TotalIndicator;
