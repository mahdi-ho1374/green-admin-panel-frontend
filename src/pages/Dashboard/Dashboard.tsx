import React, { FC, useEffect, Suspense, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import TotalIndicator from "../../components/Cards&Boxes/TotalIndicator/TotalIndicator";
import type { Last30DaysData, Totals, ChartData } from "../../types/dashboard";
import classes from "./Dashboard.module.css";
import Select from "../../components/FormFields/Select/Select";
import { useLocation, useLoaderData, useSearchParams } from "react-router-dom";
import { formActions } from "../../store/slices/form";
import createWrongKeywordError from "../../helpers/url/createWrongKeywordError";
import MixedChartProvider from "../../components/ChartProvider/MixedChartProvider";
import PieChartProvider from "../../components/ChartProvider/PieChartProvider";
import BoxError from "../../components/Error/BoxError";
import {
  fetchChartData,
  fetchLast30DaysData,
  fetchTotalsData,
} from "../../store/actions/dashboard";

interface FetchedData {
  fetchedChartData: ChartData;
  fetchedLast30Days: Last30DaysData;
  fetchedTotals: Totals;
}

const Dashboard: FC = () => {
  const { totals, last30Days, chartData } = useAppSelector(
    (state) => state.dashboard
  );
  const chartEntries = chartData ? Object.keys(chartData) : null;
  const chartEntry: string = useAppSelector(
    ({ form }) => form?.dashboard?.chartEntry?.value
  );
  const { fetchStatus, isDarkMode } = useAppSelector((state) => state.ui);
  const {
    fetchChartData: fetchChartDataStatus,
    fetchLast30DaysData: fetchLast30DaysDataStatus,
    fetchTotalsData: fetchTotalsDataStatus,
  } = fetchStatus;
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const chartEntryParam = params.get("chartEntry");
  const { fetchedChartData } = useLoaderData() as FetchedData;
  const memoizedChartData = useMemo(() => fetchedChartData, [fetchedChartData]);
  const dispatch = useAppDispatch();
  const chartEntryPath = ["dashboard", "chartEntry"];

  useEffect(() => {
    if (
      chartEntries &&
      chartEntries.includes(chartEntryParam || "") &&
      chartEntryParam !== chartEntry
    ) {
      dispatch(
        formActions.changeValue({
          path: chartEntryPath,
          value: chartEntryParam!,
        })
      );
    } else if (
      chartEntryParam &&
      chartEntries &&
      !chartEntries.includes(chartEntryParam || "")
    ) {
      const error = createWrongKeywordError(
        "Invalid chart entry",
        chartEntryParam,
        chartEntries
      );
      throw error;
    }
  }, [memoizedChartData, location.pathname]);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        chartEntry &&
        setParams(
          (params) => {
            params.set("chartEntry", chartEntry);
            return params;
          },
          { replace: true }
        ),
      0
    );

    return () => clearTimeout(timer);
  }, [chartEntry]);

  const { _id, month, year, day, ...otherKeys } = chartEntry
    ? (chartData?.[chartEntry as keyof ChartData][0] as Record<string, any>)
    : ({} as Record<string, any>);
  const keys = Object.keys(otherKeys);

  return (
    <section className={classes["dashboard"]}>
      <div className={classes["dashboard__boxes"]}>
        {!totals &&
          new Array(8).fill(null).map((item, index) => (
            <div
              key={"totals" + index}
              className={`${classes["dashboard__box"]} ${
                classes["dashboard__box--fallback"]
              } ${
                fetchTotalsDataStatus !== "loading"
                  ? ""
                  : isDarkMode
                  ? "loader-wink"
                  : "loader-spin"
              }`}
            >
              <BoxError
                status={fetchTotalsDataStatus}
                onReload={() => dispatch(fetchTotalsData())}
              />
            </div>
          ))}
        {totals &&
          Object.keys(totals).map((key) => (
            <div className={classes["dashboard__box"]} key={key}>
              <TotalIndicator title={key} value={totals[key as keyof Totals]} />
            </div>
          ))}
        {!last30Days &&
          new Array(6).fill(null).map((item, index) => (
            <div
              key={"last30Days" + index}
              className={`${classes["dashboard__box"]} ${
                classes["dashboard__box--fallback"]
              } ${
                fetchLast30DaysDataStatus !== "loading"
                  ? ""
                  : isDarkMode
                  ? "loader-wink"
                  : "loader-spin"
              }`}
            >
              <BoxError
                status={fetchLast30DaysDataStatus}
                onReload={() => dispatch(fetchLast30DaysData())}
              />
            </div>
          ))}
        {last30Days &&
          Object.keys(last30Days).map((key) => (
            <div className={classes["dashboard__box"]} key={key}>
              <TotalIndicator
                title={key}
                value={last30Days[key as keyof Last30DaysData][1]}
                percentageChange={
                  ((last30Days[key as keyof Last30DaysData][1] -
                    last30Days[key as keyof Last30DaysData][0]) /
                    last30Days[key as keyof Last30DaysData][0]) *
                  100
                }
              />
            </div>
          ))}
      </div>
      <div className={classes["dashboard__chart"]}>
        {!chartData && (
          <div
            className={`${classes["dashboard__chart--fallback"]} ${
              fetchChartDataStatus !== "loading"
                ? ""
                : isDarkMode
                ? "loader-wink"
                : "loader-spin"
            }`}
          >
            <BoxError
              onReload={() => dispatch(fetchChartData())}
              status={fetchChartDataStatus}
            />
          </div>
        )}

        {chartData && (
          <>
            <h2 className={classes["dashboard__title"]}>Last 30 Days Data</h2>
            <div className={classes["dashboard__select"]}>
              <Select
                values={chartEntries!}
                initialValue={chartEntryParam || chartEntries![0]}
                path={chartEntryPath}
                reverseColor={true}
              />
            </div>
            {!chartEntry ? (
              ""
            ) : chartEntry !== "categories" ? (
              <MixedChartProvider
                initialPath={["dashboard", "mixedChart"]}
                data={chartData![chartEntry as keyof ChartData]}
                keys={keys as string[]}
                params={params}
                onSelectChange={setParams}
                boxShadow={false}
                aspect={false}
              />
            ) : (
              <PieChartProvider
                initialPath={["dashboard", "pieChart"]}
                data={chartData![chartEntry as keyof ChartData]}
                keys={keys as string[]}
                params={params}
                onSelectChange={setParams}
                category="category"
                boxShadow={false}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
