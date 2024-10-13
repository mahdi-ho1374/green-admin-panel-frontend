import _ from "lodash";

const accumulateData = (data: any[], keys: string[]) => {
  let cumulativeKey0 = 0;
  let cumulativeKey1 = 0;
  const accumulatedData = data.map((item) => {
    cumulativeKey0 += item[keys[0]];
    let cumulativeItem = { ...item, [keys[0]]: cumulativeKey0 };
    if (keys[1]) {
      cumulativeKey1 += item[keys[1]];
      cumulativeItem[keys[1]] = cumulativeKey1;
    }
    return cumulativeItem;
  });
  return accumulatedData;
};

interface CreateChartDataProps {
  data: Record<string, any>[];
  accumulateKey: string;
  filter?: Record<string, any>;
  keys: string[];
  accumulation: "cumulative" | "discrete";
  accumulationRange?: "allTime" | "yearly" | "monthly";
}

export default ({
  data,
  accumulateKey,
  filter,
  keys,
  accumulation,
  accumulationRange,
}: CreateChartDataProps) => {
  const filterKey = filter && Object.keys(filter)[0];
  if (
    filter &&
    accumulation === "cumulative" &&
    accumulationRange === "allTime"
  ) {
    data = accumulateData(data, keys);
  }

  const filteredData = filter
    ? data.filter((item: any) => item[filterKey!] === filter[filterKey!])
    : data;

  const accumulatedData = filteredData.reduce(
    (
      accumulatedData: Record<string | number, any>,
      item: Record<string, any>
    ) => {
      if (accumulateKey in item) {
        const firstValue =
          item[accumulateKey] in accumulatedData
            ? accumulatedData[item[accumulateKey]][keys[0]]
            : 0;
        const secondValue =
          item[accumulateKey] in accumulatedData && keys[1]
            ? accumulatedData[item[accumulateKey]][keys[1]]
            : 0;

        const chartDataItem = {
          [item[accumulateKey]]: {
            [accumulateKey]: item[accumulateKey],
            [keys[0]]: item[keys[0]] + firstValue,
          },
        };
        if (keys[1]) {
          chartDataItem[item[accumulateKey]][keys[1]] =
            item[keys[1]] + secondValue;
        }
        return { ...accumulatedData, ...chartDataItem };
      } else {
        return item;
      }
    },
    {} as Record<string | number, any>
  );

  if (
    filter &&
    Object.keys(filter).includes("month") &&
    accumulationRange === "yearly"
  ) {
    Object.keys(accumulatedData).forEach((item) => {
      accumulatedData[item] = accumulateData(
        data.filter((document) => Number(item) === Number(document.year)),
        keys
      ).filter((doc) => doc.month === filter.month)[0];
    });
  }

  let finalData =
    (accumulation === "cumulative" && accumulateKey === "year" && !filter) ||
    (filter &&
      Object.keys(filter).includes("year") &&
      accumulationRange === "yearly") ||
    (filter &&
      Object.keys(filter).includes("month") &&
      accumulationRange === "monthly")
      ? accumulateData(Object.values(accumulatedData), keys)
      : Object.values(accumulatedData);
  if (accumulateKey === "day") {
    finalData = data.map((item) =>
      finalData.find(
        (entry) => entry?.[accumulateKey] === item?._id?.[accumulateKey]
      )
    );
    finalData =
      accumulation === "cumulative"
        ? accumulateData(finalData, keys)
        : finalData;
  }

  return { data: finalData, xDataKey: accumulateKey, yDataKey: keys };
};
