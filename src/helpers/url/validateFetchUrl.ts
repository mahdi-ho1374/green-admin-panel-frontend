import { TbError404Off } from "react-icons/tb";
import { sortType } from "../../types/generic";
import { numberFields } from "../../types/generic";
import { booleanFields } from "../../types/generic";
import { statusField } from "../../types/generic";
import { dateFields } from "../../types/generic";
import { Status } from "../../types/order";
import createWrongKeywordError from "./createWrongKeywordError";

export interface FetchUrlValidateProps {
  parameters: URLSearchParams;
  allowedSortProps: Record<string, string>;
  allowedFilterProps: Record<string, string>;
}

export const fetchUrlValidate = ({
  parameters,
  allowedSortProps,
  allowedFilterProps,
}: FetchUrlValidateProps) => {
  const allowedQueryParameters = new Set([
    "sortField",
    "sortBy",
    "filterField",
    "filterTerm",
    "perPage",
    "withinRange",
  ]);
  const invalidParams: string[] = [];
  Array.from(parameters.keys()).forEach((param, index) => {
    if (index === 0) {
      return;
    }
    if (!allowedQueryParameters.has(param)) {
      invalidParams.push(param);
    }
  });
  if (invalidParams.length > 0) {
    const invalidKeywords = invalidParams.join(",");
    const error = {
      title: "Invalid ulr options",
      status: 400,
      message: `"${invalidKeywords}" ${
        invalidParams.length > 1 ? "keywords are" : "keyword is"
      } not valid.Please use ${Array.from(allowedQueryParameters).join(
        ","
      )} keywords.`,
    };
    throw error;
  }
  const sortField = parameters.get("sortField")?.trim().toLowerCase();
  const sortBy = parameters.get("sortBy")?.trim().toLowerCase();
  const filterField = parameters.get("filterField")?.trim().toLowerCase();
  const filterTerm = parameters.get("filterTerm")?.trim().toLowerCase();
  const withinRange = parameters.get("withinRange")?.trim().toLowerCase();
  if (!!sortField !== !!sortBy) {
    const error = {
      title: "Invalid sorting options",
      status: 400,
      message:
        "Please provide both sortField keyword and sortBy keyword, or leave both empty.",
    };
    throw error;
  }
  if (!!filterField !== !!filterTerm) {
    const error = {
      title: "Invalid filter options",
      status: 400,
      message:
        "Please provide both filterField keyword and filterTerm keyword, or leave both empty.",
    };
    throw error;
  }
  if (![undefined, "true", "false"].includes(withinRange)) {
    const error = createWrongKeywordError(
      "Invalid filter options",
      withinRange as string,
      ["true", "false"]
    );
    throw error;
  }
  if (filterField && !Object.keys(allowedFilterProps).includes(filterField)) {
    const error = createWrongKeywordError(
      "Invalid filter options",
      filterField,
      Object.keys(allowedFilterProps)
    );
    throw error;
  }
  if (sortField && !Object.keys(allowedSortProps).includes(sortField)) {
    const error = createWrongKeywordError(
      "Invalid sorting options",
      sortField,
      Object.keys(allowedSortProps)
    );
    throw error;
  }
  if (sortBy && !Object.keys(sortType).includes(sortBy as string)) {
    const error = {
      title: "Invalid sorting options",
      status: 400,
      message: `Please specify whether you want to sort in ascending or descending order. Use one of the following keywords: "${Object.keys(
        sortType
      ).join(",")}"`,
    };
    throw error;
  }
  if (filterTerm && Object.keys(numberFields).includes(filterField!)) {
    const areNumbers = filterTerm
      ?.split(",")
      ?.every((item) => !isNaN(parseFloat(item)));

    const error = {
      title: "Invalid filter options",
      status: 400,
      message: `The keyword "${filterTerm}" is not valid. Please provide two numbers separated with "," for filterTerm's keyword`,
    };
    if (!areNumbers) {
      throw error;
    }
  }
  if (filterTerm && Object.keys(booleanFields).includes(filterField!)) {
    const isBoolean = ["true", "false"].includes(filterTerm);
    const error = createWrongKeywordError(
      "Invalid filter options",
      filterTerm,
      ["true", "false"]
    );
    if (!isBoolean) {
      throw error;
    }
  }
  if (filterTerm && Object.keys(dateFields).includes(filterField!)) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const areDates = filterTerm?.split(",")?.every((item) => regex.test(item));
    const error = {
      title: "Invalid filter options",
      status: 400,
      message: `The keyword "${filterTerm}" is not valid. Please provide two dates separated with "," using format (yyyy-mm-dd) for filterTerm's keyword`,
    };
    if (!areDates) {
      throw error;
    }
  }

  if (filterTerm && filterField === "status") {
    const isValidValue = Object.values(Status).includes(
      filterTerm as (typeof Status)[keyof typeof Status]
    );
    const error = createWrongKeywordError(
      "Invalid filter options",
      filterTerm,
      Object.values(Status)
    );
    if (!isValidValue) {
      throw error;
    }
  }
};
