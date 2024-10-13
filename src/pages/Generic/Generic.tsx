import classes from "./Generic.module.css";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useReduxHooks";
import { UserFormKeys } from "../../types/user";
import { updateData, addData } from "../../store/actions/generic";
import { ModalType } from "../../types/ui";
import createFormData from "../../helpers/form/createData";
import sortObjectKeys from "../../helpers/ui/sortObjectKeys";
import Select from "../../components/FormFields/Select/Select";
import useViewManagement from "../../hooks/useViewManagement";
import viewOptionsInfos from "../../helpers/viewOptionsInfos";
import Tooltip from "../../components/Tooltip/ToolTip";
import { BsInfoLg } from "react-icons/bs";
import { GenericDocument, GenericKey, View } from "../../types/generic";
import createOrderFormData from "../../helpers/form/createOrderData";
import { Fields } from "../../types/form";
import { Order } from "../../types/order";
import createData from "../../helpers/table/createData";
import { productFormKeys } from "../../types/product";
import { commentFormKeys } from "../../types/comment";
import { orderFormKeys } from "../../types/order";
import DataViewProvider from "../../components/DataViewProvider/DataViewProvider";
import { Status } from "../../types/order";
import useTooltipClose from "../../hooks/useTooltipClose";
import { uiActions } from "../../store/slices/ui";
import PieChartProvider from "../../components/ChartProvider/PieChartProvider";
import MixedChartProvider from "../../components/ChartProvider/MixedChartProvider";
import BoxError from "../../components/Error/BoxError";
import filterSortSearchData from "../../helpers/table/filterSortSearchData";

const Generic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const genericPage = location.pathname.split("/")[1];
  const section = genericPage.split("").slice(0, -1).join("") as GenericKey;
  const {
    modalType,
    isDarkMode,
    colors: uiColors,
    openedTooltipId,
    fetchStatus,
  } = useAppSelector((state) => state.ui);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const view: View = useAppSelector(
    (state) => state.form?.[genericPage]?.view?.value
  );
  const { data, perPage, dataChanged } = useAppSelector(
    (state) => state.generic?.[section]
  );
  const fetchChartDataStatus = fetchStatus.fetchChartData;
  const { main: mainData, chart: chartData, search: searchData } = data;
  const viewPath = [genericPage, "view"];
  const filteredSortedSearchData = filterSortSearchData({
    view,
    searchData,
    perPage,
    section,
    params,
  });
  useTooltipClose();
  useViewManagement({
    section,
    view,
    path: viewPath,
    dataChanged,
    setParams,
    searchData: filteredSortedSearchData,
    params,
  });
  const lastPage =
    Math.ceil((filteredSortedSearchData?.length || 0) / perPage) || undefined;

  const provideFormEditData = async (selectedDocumentId: string) => {
    if (section === "order") {
      const formData = (await createOrderFormData({
        orderId: selectedDocumentId,
        orders:
          view === "search" ? (searchData as Order[]) : (mainData as Order[]),
      })) as Fields;
      return formData;
    }
    const selectedDocument = sortObjectKeys(
      (view === "search"
        ? (searchData as Record<string, any>[])
        : (mainData as Record<string, any>[])
      ).filter((document) => document._id === selectedDocumentId)
    )[0];
    const formData = createFormData<GenericDocument>(selectedDocument);
    return formData;
  };

  const formSubmitHandler = (document: GenericDocument) => {
    if ("user" in document) {
      (document as unknown as Record<string, any>).userId = document!.user!._id;
    }
    return modalType === ModalType.EDIT
      ? dispatch(updateData(section, document))
      : dispatch(addData(section, document));
  };

  const searchPage =
    view === "search" ? Number(params.get("currentPage") || 1) : 1;
  const tableData =
    (view === "main" && mainData) ||
    (view === "search" && searchData && searchData?.length > perPage)
      ? createData({
          section,
          data:
            view !== "search"
              ? mainData!
              : filteredSortedSearchData!.slice(
                  (searchPage - 1) * perPage,
                  searchPage * perPage
                ),
          isForTable: true,
        })
      : undefined;
  const cardData =
    (view === "card" && mainData) ||
    (view === "search" && searchData && searchData?.length <= perPage) ||
    searchData?.length === perPage
      ? createData({
          section,
          data: view === "search" ? searchData! : mainData!,
        })
      : undefined;

  const { _id, month, year, ...chartKeysObj }: Record<string, any> = chartData
    ? chartData[0]
    : {};
  const chartKeys = Object.keys(chartKeysObj);

  const priceFields = {
    user: ["totalSpent"],
    product: ["price", "revenue"],
    order: ["totalPrice"],
    comment: [],
  };

  const formKeys = {
    user: UserFormKeys,
    product: productFormKeys,
    order: orderFormKeys,
    comment: commentFormKeys,
  };

  const connectionErrorProps = {
    status: fetchChartDataStatus,
    onReload: () =>
      navigate(`${location.pathname}${location.search}`, { replace: true }),
  };

  return (
    <section
      className={`${classes["generic"]} ${
        cardData ? classes["generic--card"] : ""
      } ${section == "user" && cardData ? classes["generic--card-user"] : ""}`}
    >
      <div className={classes["generic__select"]}>
        <Select
          values={["main", "card", "chart"].concat(
            searchData ? ["search"] : []
          )}
          initialValue={view}
          path={viewPath}
          reverseColor={!isDarkMode}
        />
        <Tooltip
          title={viewOptionsInfos[view as keyof typeof viewOptionsInfos]}
          backgroundColor={uiColors.secondary}
          color={uiColors.text}
          fontSize={16}
          open={openedTooltipId === view}
          onClick={() =>
            dispatch(
              uiActions.setOpenedTooltipId(view === openedTooltipId ? "" : view)
            )
          }
        >
          <div className="info info--primary" id={`tooltip-${view}`}>
            <BsInfoLg className="info__icon " />
          </div>
        </Tooltip>
      </div>
      {view === "chart" && section !== "product" && !chartData && (
        <div
          className={`${classes["generic__chart-fallback--mixed"]} ${
            fetchChartDataStatus !== "loading"
              ? ""
              : isDarkMode
              ? "loader-wink"
              : "loader-spin"
          }`}
        >
          {fetchStatus.fetchChartData === "error" && (
            <BoxError {...connectionErrorProps} />
          )}
        </div>
      )}
      {view === "chart" && section !== "product" && chartData && (
        <MixedChartProvider
          initialPath={[genericPage, "chart"]}
          keys={chartKeys}
          data={chartData!}
          params={params}
          onSelectChange={setParams}
        />
      )}
      {view === "chart" && section === "product" && !chartData && (
        <div
          className={`${classes["generic__chart-fallback--pie"]} ${
            fetchChartDataStatus !== "loading"
              ? ""
              : isDarkMode
              ? "loader-wink"
              : "loader-spin"
          }`}
        >
          {fetchStatus["fetchChartData"] === "error" && (
            <BoxError {...connectionErrorProps} />
          )}
        </div>
      )}
      {view === "chart" && section === "product" && chartData && (
        <PieChartProvider
          initialPath={[genericPage, "chart"]}
          keys={chartKeys}
          data={chartData!}
          params={params}
          onSelectChange={setParams}
          category="category"
        />
      )}
      {view !== "chart" && (
        <DataViewProvider
          section={section}
          tableData={tableData}
          cardData={cardData}
          formKeys={formKeys[section]}
          onSubmit={formSubmitHandler}
          onEdit={provideFormEditData}
          priceFields={priceFields[section]}
          lastSearchPage={view === "search" ? lastPage : undefined}
          currentSearchPage={view === "search" ? searchPage : undefined}
          view={view}
          filterProp={
            section === "order"
              ? { key: "status", values: Object.values(Status) }
              : undefined
          }
        />
      )}
    </section>
  );
};

export default Generic;
