import { useLocation } from "react-router-dom";
import {
  GenericDocument,
  GenericKey,
  GenericMainData,
  View,
} from "../../types/generic";
import createData from "./createData";
import _ from "lodash";

interface FilterSortSearchData {
  searchData: GenericMainData | null;
  view: View;
  perPage: number;
  section: GenericKey;
  params: URLSearchParams;
}

export default ({
  searchData,
  view,
  perPage,
  section,
  params,
}: FilterSortSearchData) => {
  const filterTermString = params.get("filterTerm") || "";
  const withinRangeString =
    (params.get("withinRange") as "true" | "false" | undefined) || "true";
  const filterField = (params.get("filterField") ||
    "") as keyof GenericDocument;
  const sortBy = params.get("sortBy") || "";
  const sortField = params.get("sortField") || "";
  const toBoolean = { true: true, false: false };
  const withinRange = toBoolean[withinRangeString];
  const tableSearchData = createData({
    section,
    data: searchData || [],
    isForTable: true,
  });

  let filteredSortedData = tableSearchData as unknown as any[] | null;

  let filterTerm = filterTermString.split("").includes(",")
    ? filterTermString
        .split(",")
        .map((item) =>
          item.split("").includes("-")
            ? new Date(item + "T00:00:00Z")
            : Number(item)
        )
    : Object.keys(toBoolean).includes(filterTermString)
    ? toBoolean[filterTermString as keyof typeof toBoolean]
    : filterTermString;

  if (
    view === "search" &&
    filteredSortedData &&
    tableSearchData &&
    tableSearchData?.length > perPage
  ) {
    filteredSortedData = filterField
      ? (filteredSortedData.filter((item: any) => {
          const fieldValue =
            Array.isArray(filterTerm) && typeof filterTerm[0] === "object"
              ? new Date(item[filterField])
              : item[filterField];

          return !Array.isArray(filterTerm)
            ? fieldValue === filterTerm
            : withinRange
            ? fieldValue <= filterTerm[1] && fieldValue >= filterTerm[0]
            : fieldValue > filterTerm[1] && fieldValue < filterTerm[0];
        }) as unknown as Record<string, any>[])
      : filteredSortedData;
    filteredSortedData = sortBy
      ? filteredSortedData.sort((a: any, b: any) =>
          sortBy === "asc"
            ? b[sortField] - a[sortField]
            : a[sortField] - b[sortField]
        )
      : filteredSortedData;
  }
  filteredSortedData = filteredSortedData
    ? (filteredSortedData.reduce((nonTableData: any, item: any) => {
        if (searchData) {
          const nonTableDocument = (
            searchData as unknown as Record<string, any>[]
          ).find(
            (entry: Record<string, any>) => entry._id === item._id
          ) as unknown as GenericDocument;
          nonTableDocument && nonTableData.push(nonTableDocument);
        }
        return nonTableData;
      }, []) as GenericMainData)
    : null;
  return filteredSortedData;
};
