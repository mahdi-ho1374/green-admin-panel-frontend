import React, { FC } from "react";
import classes from "./Sales.module.css";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import MixedChartProvider from "../../components/ChartProvider/MixedChartProvider";
import BestItem from "../../components/Cards&Boxes/BestItem/BestItem";
import { RevenueOrAmount } from "../../types/sale";
import {
  fetchSalesData,
  fetchTopBuyersData,
  fetchMostSoldProductsData,
} from "../../store/actions/sale";
import BoxError from "../../components/Error/BoxError";

const Sales: FC = () => {
  const { sales, topBuyers, mostSoldProducts } = useAppSelector(
    (state) => state.sale
  );
  const { fetchStatus, isNavWide, isNavVisible, isDarkMode } = useAppSelector(
    (state) => state.ui
  );
  const {
    fetchSalesData: fetchSalesDataStatus,
    fetchTopBuyersData: fetchTopBuyersDataStatus,
    fetchMostSoldProductsData: fetchMostSoldProductsDataStatus,
  } = fetchStatus;
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  return (
    <section
      className={`${classes["sales"]} ${
        isNavWide && isNavVisible ? classes["sales--narrow"] : ""
      }`}
    >
      <div
        className={`${classes["sales__chart"]} ${
          isNavWide && isNavVisible ? classes["sales__chart--narrow"] : ""
        }`}
      >
        {!sales && (
          <div
            className={`${classes["sales__fallback"]} ${
              fetchSalesDataStatus !== "loading"
                ? ""
                : isDarkMode
                ? "loader-wink"
                : "loader-spin"
            }`}
          >
            <BoxError
              status={fetchSalesDataStatus}
              onReload={() => dispatch(fetchSalesData())}
            />
          </div>
        )}

        {sales && (
          <MixedChartProvider
            initialPath={["sales", "chart"]}
            data={sales!}
            keys={Object.values(RevenueOrAmount)}
            params={params}
            onSelectChange={setParams}
            heights={
              isNavWide && isNavVisible ? ["100%", 400] : ["100%", "100%"]
            }
          />
        )}
      </div>
      <div
        className={`${classes["sales__items"]} ${
          isNavWide && isNavVisible ? classes["sales__item--narrow"] : ""
        }`}
      >
        <div className={`${classes["sales__item"]}`}>
          {!mostSoldProducts && (
            <div
              className={`${classes["sales__fallback"]} ${
                fetchMostSoldProductsDataStatus !== "loading"
                  ? ""
                  : isDarkMode
                  ? "loader-wink"
                  : "loader-spin"
              }`}
            >
              <BoxError
                status={fetchMostSoldProductsDataStatus}
                onReload={() => dispatch(fetchMostSoldProductsData())}
              />
            </div>
          )}

          {mostSoldProducts && (
            <BestItem
              initialPath={["sales", "mostSoldProducts"]}
              data={mostSoldProducts!}
              title="Product of the month"
              keys={Object.values(RevenueOrAmount)}
              params={params}
              onSelectChange={setParams}
            />
          )}
        </div>

        <div className={`${classes["sales__item"]}`}>
          {!topBuyers && (
            <div
              className={`${classes["sales__fallback"]} ${
                fetchTopBuyersDataStatus !== "loading"
                  ? ""
                  : isDarkMode
                  ? "loader-wink"
                  : "loader-spin"
              }`}
            >
              <BoxError
                status={fetchTopBuyersDataStatus}
                onReload={() => dispatch(fetchTopBuyersData())}
              />
            </div>
          )}
          {topBuyers && (
            <BestItem
              initialPath={["sales", "topBuyers"]}
              data={topBuyers!}
              title="Customer of the month"
              keys={Object.values(RevenueOrAmount)}
              params={params}
              onSelectChange={setParams}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Sales;
