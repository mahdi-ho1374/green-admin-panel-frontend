import React, { FC } from "react";
import classes from "../Details.module.css";
import formatTitle from "../../../helpers/ui/formatTitle";
import { MdExpandMore } from "react-icons/md";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import sortObjectKeys from "../../../helpers/ui/sortObjectKeys";

interface DetailItemProps {
  title: string;
  value: any;
}

const DetailItem: FC<DetailItemProps> = ({ title, value }) => {
  if (typeof value !== "object" || value === null) {
    return (
      <div className={classes["details__prop-value"]}>
        <div className={`${classes.details__prop}`}>{title}:</div>
        <div className={classes.details__value}>{value}</div>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Accordion
        className={`${classes.details__accordion}`}
        id="accordion"
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          className={classes["details__accordion-header"]}
          expandIcon={
            <div
              className={classes["details__icon-container"]}
              id="icon-container"
            >
              <MdExpandMore className={classes.details__icon} />
            </div>
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes["details__mega-prop"]} id="mega-prop">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          className={classes["details__accordion-content"]}
          id="accordion-content"
        >
          <Typography>
            <div className={classes["details__grid-system"]}>
              {value.map((item, index) => (
                <DetailItem
                  key={item}
                  title={`${title.split("").slice(0, -1).join("")} ${
                    index + 1
                  }`}
                  value={item}
                />
              ))}
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  value = sortObjectKeys(value);

  return (
    <Accordion
      className={classes.details__accordion}
      id="accordion"
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        className={classes["details__accordion-header"]}
        expandIcon={
          <div
            className={classes["details__icon-container"]}
            id="icon-container"
          >
            <MdExpandMore className={classes.details__icon} />
          </div>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes["details__big-prop"]} id="big-prop">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        className={classes["details__accordion-content"]}
        id="accordion-content"
      >
        <Typography>
          <div className={classes["details__grid-system"]}>
            {Object.keys(value).map((key, index) => (
              <DetailItem
                key={value[key]}
                title={formatTitle(key)}
                value={value[key]}
              />
            ))}
          </div>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default DetailItem;
