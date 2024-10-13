import React, { FC, ReactNode } from "react";
import type { Product, TableProduct } from "../../../types/product";
import classes from "./ProductCard.module.css";
import { IoPricetags } from "react-icons/io5";
import { FaSackDollar } from "react-icons/fa6";
import { ModalType } from "../../../types/ui";
import { BiSolidCategory } from "react-icons/bi";
import { FaCubesStacked } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";

interface ProductCardProps {
  product: Product & TableProduct;
  buttonsAndHandlers: {
    element: ReactNode;
    name: ModalType;
    handler: (id: string) => void;
  }[];
}

const ProductCard: FC<ProductCardProps> = ({ product, buttonsAndHandlers }) => {
  return (
    <div className={classes["productCard"]}>
      <div className={classes["productCard__top"]}>
        <img
          className={classes["productCard__profile"]}
          src={`/plant-${Math.floor(Math.random() * 5) + 1}.jpg`}
          alt="product"
        />
      </div>
      <div className={classes["productCard__props"]}>
        <div className={classes["productCard__prop"]}>
          <span>{product.name}</span>
        </div>
        <div className={classes["productCard__prop"]}>
          <IoPricetags />
          <span>{`$${product.price}`}</span>
        </div>
        <div className={classes["productCard__prop"]}>
          <FaSackDollar />
          <span>{product.revenue ? `$${product.revenue}` : "---"}</span>
        </div>
        <div className={classes["productCard__prop"]}>
          <FaCubesStacked />
          <span>{product.quantity || "---"}</span>
        </div>
        <div className={classes["productCard__prop"]}>
          <IoStatsChart />
          <span>{product.salesNumber || "---"}</span>
        </div>
        <div
          className={`${classes["productCard__prop"]} ${classes["productCard__prop--column-2"]}`}
        >
          <BiSolidCategory />
          <span>{product.category}</span>
        </div>
      </div>
      {buttonsAndHandlers.map((button, index) => (
          <button
            key={button.element + "-" + index}
            className={`actions__btn actions__btn--${button.name} ${classes[`productCard__btn--${button.name}`]}`}
            onClick={() => button.handler(product._id)}
          >
            {button.element}
          </button>
        ))}
    </div>
  );
};

export default ProductCard;
