import { Sale } from "../../types/sale";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default (object: any) => {
  const numericMonth = object.month as number;
  if (numericMonth >= 1 && numericMonth <= 12) {
    object.month = months[numericMonth - 1];
  }
  return object;
};
