import React, { FC } from "react";
import classes from "./Details.module.css";
import DetailItem from "./DetailItem/DetailItem";
import formatTitle from "../../helpers/ui/formatTitle";
import sortObjectKeys from "../../helpers/ui/sortObjectKeys";
import { MdClose } from "react-icons/md";

interface DetailsProps {
  fullData: Record<string, any>;
  id: string;
  closeModal?: () => void;
}

const Details: FC<DetailsProps> = ({ fullData, id, closeModal }) => {
  fullData = sortObjectKeys(fullData);
  return (
    <div
      className={`${classes.details} ${classes["details__grid-system"]}`}
      id={id}
    >
      {Object.keys(fullData).map((key, index) => {
        const title = formatTitle(key);
        return <DetailItem key={key} title={title} value={fullData[key]} />;
      })}
        <MdClose
          className={classes["details__close-icon"]}
          onClick={closeModal}
        />
    </div>
  );
};

export default Details;
