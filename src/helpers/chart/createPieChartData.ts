import _ from "lodash";

const accumulateData = (data: any[], keys: string[], category: string) => {
  const firstKey = keys[0];
  const secondKey = keys[1];
  type PieItem = {
    [K in typeof category | typeof firstKey]: string | number;
  };
  const categoryNames = data[0]?.[firstKey]?.map((item: any) => item[category]);
  const accumulatedValueOfFirstKey: Record<string, number> = {};
  const accumulatedValueOfSecondKey: Record<string, number> = {};
  categoryNames?.forEach((name: string) => {
    accumulatedValueOfFirstKey[name] = 0;
    accumulatedValueOfSecondKey[name] = 0;
  });

  data?.forEach((item) => {
    (item[firstKey] as PieItem[]).forEach((pieItem) => {
      accumulatedValueOfFirstKey[pieItem[category]] += pieItem[
        firstKey
      ] as number;
      pieItem[firstKey] = Math.round(
        accumulatedValueOfFirstKey[pieItem[category]]
      );
    });
    if (secondKey) {
      (item[secondKey] as PieItem[]).forEach((pieItem) => {
        accumulatedValueOfSecondKey[pieItem[category]] += pieItem[
          secondKey
        ] as number;
        pieItem[secondKey] = Math.round(
          accumulatedValueOfSecondKey[pieItem[category]]
        );
      });
    }
  });
};

interface CreateChartDataProps {
  data: Record<string, any>[];
  category: string;
  filter: Record<string, any>;
  keys: string[];
  accumulationRange?: "allTime" | "yearly" | "monthly";
}

export default ({
  data,
  category,
  filter,
  keys,
  accumulationRange,
}: CreateChartDataProps) => {
  if (filter?.month === "all") {
    filter =
      filter.year === "all"
        ? { month: data[data.length - 1] }
        : {
            month: data.reduce(
              (lastMonth, item) =>
                item.year === filter.year ? item.month : lastMonth,
              ""
            ),
            year: filter.year,
          };
  }

  if (
    filter?.year !== "all" &&
    filter?.month !== "all" &&
    !data.some(
      (item) => item.year === filter?.year && item.month === filter?.month
    )
  ) {
    return {};
  }
  if (
    accumulationRange === "monthly" &&
    ![filter?.month, filter?.year].includes("all")
  ) {
    data = data.filter(
      (item) => item.month === filter?.month && item.year <= filter?.year
    );
    accumulateData(data, keys, category);
  }
  if (filter?.year === "all" && filter?.month !== "all") {
    if (accumulationRange !== "monthly") {
      return {};
    }

    filter = { month: filter.month };
    data = data.filter((item) => item.month === filter.month);
    accumulateData(data, keys, category);
    data = data.slice(-1);
  }
  if (accumulationRange === "yearly") {
    data = data.filter((item) => item.year === filter?.year);
    accumulateData(data, keys, category);
  }
  if (accumulationRange === "allTime") {
    data = data.filter((item) => item.year <= filter?.year);
    accumulateData(data, keys, category);
  }

  const filterKeys = Object.keys(filter);
  const filteredData = filterKeys?.reduce(
    (filteredData, filterKey) =>
      filteredData.filter(
        (item: any) => item[filterKey!] === filter[filterKey!]
      ),
    data
  );
  const unSortedData = {
    [keys[0]]: filteredData![0]?.[keys[0]],
    [keys[1]]: filteredData![0]?.[keys[1]],
  };
  const finalData: Record<string, any> = {};
  Object.keys(unSortedData).map((key) => {
    const sortedPieData = unSortedData[key]?.sort((a: any, b: any) => {
      const categoryA = a[category].toLowerCase();
      const categoryB = b[category].toLowerCase();

      if (categoryA < categoryB) {
        return -1;
      }
      if (categoryA > categoryB) {
        return 1;
      }
      return 0;
    });
    finalData[key] = sortedPieData;
  });

  return finalData;
};
