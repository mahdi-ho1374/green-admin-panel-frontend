import React, { FC, useEffect, useState, MouseEvent } from "react";
import classes from "./DataViewProvider.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { uiActions } from "../../store/slices/ui";
import { ModalType } from "../../types/ui";
import { genericActions } from "../../store/slices/generi";
import Modal from "../Modal/Modal";
import Table from "../Table/Table";
import Details from "../Details/Details";
import Delete from "../Delete/Delete";
import Form from "../Form/Form";
import Pagination from "../Pagination/Pagination";
import { MdEdit, MdDelete, MdOutlineMoreHoriz } from "react-icons/md";
import type { Fields } from "../../types/form";
import sortObjectKeys from "../../helpers/ui/sortObjectKeys";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { GenericDocument, GenericKey, View } from "../../types/generic";
import createFormData from "../../helpers/form/createData";
import createUrlPath from "../../helpers/url/createUrlPath";
import CommentCard from "../Cards&Boxes/CommentCard/CommentCard";
import ProductCard from "../Cards&Boxes/ProductCard/ProductCard";
import UserCard from "../Cards&Boxes/UserCard/UserCard";
import type { TableComment, Comment } from "../../types/comment";
import type { TableUser, User } from "../../types/user";
import type { Product, TableProduct } from "../../types/product";
import { Status, type Order, type TableOrder } from "../../types/order";
import OrderCard from "../Cards&Boxes/OrderCard/OrderCard";
import createOrderFormData from "../../helpers/form/createOrderData";
import BoxError from "../Error/BoxError";
import _ from "lodash";
import PageError from "../Error/PageError";
import { formActions } from "../../store/slices/form";

interface DataViewProviderProps {
  section: GenericKey;
  tableData?: Record<string, any>[] | null;
  cardData?: Record<string, any>[] | null;
  formKeys: string[];
  onEdit: (documentId: string) => any;
  onSubmit: (data: any) => void;
  filterProp?: { key: string; values: string[] };
  priceFields?: string[];
  view: View;
  lastSearchPage?: number;
  currentSearchPage?: number;
  onDelete: () => void;
}

const DataViewProvider: FC<DataViewProviderProps> = ({
  section,
  tableData,
  cardData,
  formKeys,
  filterProp,
  priceFields,
  onEdit,
  onSubmit,
  onDelete,
  view,
  lastSearchPage,
  currentSearchPage,
}) => {
  const {
    lastPage,
    currentPage,
    selectedDocumentId,
    perPage,
    data,
    searchTerm,
  } = useAppSelector((state) => state.generic[section as GenericKey]);
  const { fetchStatus, connectionError, isDarkMode } = useAppSelector(
    (state) => state.ui
  );
  const fetchMainDataStatus = fetchStatus.fetchMainData;
  const fetchSearchDataStatus = fetchStatus.fetchSearchData;
  const { main: mainData, search: searchData } = data;
  const { showModal, modalType } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [formData, setFormData] = useState<null | Fields>(null);
  const page = section + "s";
  const currentPath = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (!modalType && formData) {
      setFormData(null);
    }
  }, [modalType]);

  const paginate = (selectedPage: number) => {
    const activePage =
      view === "search" ? params.get("currentPage") : currentPage;
    const filterField = params.get("filterField");
    const filterTerm = params.get("filterTerm");
    const withinRange = params.get("withinRange");
    const sortBy = params.get("sortBy");
    const sortField = params.get("sortField");
    selectedPage !== activePage &&
      navigate(
        createUrlPath({
          page,
          view,
          currentPage: selectedPage,
          searchTerm,
          params: {
            filterField,
            sortField,
            perPage,
            sortBy,
            filterTerm,
            withinRange,
          },
        })
      );
  };

  const selectedDocument = selectedDocumentId
    ? sortObjectKeys(
        (view === "search"
          ? (searchData as unknown as any[])
          : (mainData as unknown as any[])
        )?.filter((document: any) => document._id === selectedDocumentId)[0]
      )
    : {};

  const formSubmitHandler = (document: GenericDocument) => {
    onSubmit(document);
  };

  const showAddModal = async () => {
    dispatch(uiActions.toggleModal(ModalType.ADD));
    setFormData(createFormData<string[]>(formKeys, true));
  };

  const showEditModal = async (documentId: string) => {
    const formData = await onEdit(documentId);
    setFormData(formData);
    dispatch(uiActions.toggleModal(ModalType.EDIT));
    dispatch(
      genericActions.selectDocumentId({
        section,
        id: documentId,
      })
    );
  };

  const showDeleteModal = (orderId: string) => {
    dispatch(uiActions.toggleModal(ModalType.DELETE));
    dispatch(
      genericActions.selectDocumentId({
        section,
        id: orderId,
      })
    );
  };

  const showDetailsModal = (orderId: string) => {
    dispatch(uiActions.toggleModal(ModalType.DETAILS));
    dispatch(
      genericActions.selectDocumentId({
        section,
        id: orderId,
      })
    );
  };

  const addItem = async (e: MouseEvent, fields: Fields) => {
    e.preventDefault();
    const formData = await createOrderFormData({ formData: fields });
    setFormData((prevFormData) => [...formData]);
  };

  const btnAndHandler =
    section === "order" ? { title: "addItem", handler: addItem } : undefined;

  const buttonsAndHandlers = [
    {
      element: <MdEdit />,
      handler: showEditModal,
      name: ModalType.EDIT,
      disabled:
        section === "order"
          ? (["status", Status.CANCELED] as [string, string])
          : (false as false),
    },
    {
      element: <MdOutlineMoreHoriz />,
      handler: showDetailsModal,
      name: ModalType.DETAILS,
    },
  ];
  section === "comment" &&
    buttonsAndHandlers.splice(1, 0, {
      element: <MdDelete />,
      handler: showDeleteModal,
      name: ModalType.DELETE,
    });

  const fmdConnectionErrorProps = {
    status: fetchMainDataStatus,
    onReload: () => navigate(currentPath, { replace: true }),
  };

  const fsdConnectionErrorProps = {
    status: fetchSearchDataStatus,
    onReload: () => navigate(currentPath, { replace: true }),
  };

  const closeModalTasks = () => {
    dispatch(genericActions.selectDocumentId({ id: "", section }));
    if ([ModalType.ADD, ModalType.EDIT].includes(modalType as ModalType)) {
      dispatch(formActions.cleanForm(section));
    }
  };

  const cardDataShowCondition =
    !tableData &&
    (view === "card"
      ? fetchMainDataStatus === "success"
      : fetchSearchDataStatus === "success");

  return (
    <div className={classes["dataViewProvider"]}>
      {showModal && (
        <Modal id={modalType} genericKey={section} closeModalFunc={closeModalTasks}>
            {modalType === ModalType.DETAILS ? (
              <Details fullData={selectedDocument} id={modalType} />
            ) :
            modalType === ModalType.DELETE ? <Delete id={modalType} onDelete={onDelete} /> : 
            [ModalType.ADD, ModalType.EDIT].includes(modalType as ModalType) &&
              formData ? (
                <Form
                  id={modalType}
                  fields={formData as Fields}
                  onSubmit={formSubmitHandler}
                  rootPath={section}
                  btnAndHandler={btnAndHandler}
                />
              ) : <></>}
        </Modal>
      )}
      {view === "main" &&
        ["error", "loading"].includes(fetchMainDataStatus) && (
          <div
            className={`table-fallback ${
              fetchMainDataStatus !== "loading"
                ? ""
                : isDarkMode
                ? "loader-wink"
                : "loader-spin"
            }`}
          >
            {fetchMainDataStatus === "error" && (
              <BoxError {...fmdConnectionErrorProps} />
            )}
          </div>
        )}
      {tableData &&
        tableData.length < 1 &&
        fetchMainDataStatus === "success" && (
          <div className={`table-no-data`}>
            There is no data for this criteria
          </div>
        )}
      {tableData &&
        ![fetchMainDataStatus, fetchSearchDataStatus].includes("loading") && (
          <Table
            data={tableData}
            buttonsAndHandlers={buttonsAndHandlers}
            priceFields={priceFields}
            filterProp={filterProp}
            view={view}
          />
        )}
      <div
        className={`${classes["dataViewProvider__cards"]} ${
          section === "user" ? classes["dataViewProvider__cards--user"] : ""
        }`}
      >
        {section === "comment" &&
          cardDataShowCondition &&
          (cardData as unknown as (Comment & TableComment)[])?.map((doc) => (
            <CommentCard
              key={"commentCard" + doc._id}
              comment={doc!}
              buttonsAndHandlers={buttonsAndHandlers}
            />
          ))}
        {section === "user" &&
          cardDataShowCondition &&
          (cardData as unknown as (User & TableUser)[])?.map((doc) => (
            <UserCard
              key={"userCard" + doc._id}
              user={doc}
              buttonsAndHandlers={buttonsAndHandlers}
            />
          ))}
        {section === "product" &&
          cardDataShowCondition &&
          (cardData as unknown as (Product & TableProduct)[])?.map((doc) => (
            <ProductCard
              key={"productCard" + doc._id}
              product={doc}
              buttonsAndHandlers={buttonsAndHandlers}
            />
          ))}
        {section === "order" &&
          cardDataShowCondition &&
          (cardData as unknown as (Order & TableOrder)[])?.map((doc) => (
            <OrderCard
              key={"orderCard" + doc._id}
              order={doc}
              buttonsAndHandlers={buttonsAndHandlers}
            />
          ))}
      </div>
      {view === "search" &&
        fetchSearchDataStatus === "success" &&
        searchData &&
        searchData?.length === 0 && (
          <div className={classes["dataViewProvider__no-result"]}>
            No results were found. Please try entering a different word or
            phrase.
          </div>
        )}
      {((view === "search" && fetchSearchDataStatus === "loading") ||
        (view === "card" && fetchMainDataStatus === "loading")) && (
        <div className="loader-spin"></div>
      )}
      {view === "search" && fetchSearchDataStatus === "error" && (
        <>
          {connectionError ? (
            <PageError {...fsdConnectionErrorProps} />
          ) : (
            <BoxError {...fsdConnectionErrorProps} />
          )}{" "}
        </>
      )}
      {view === "card" && fetchMainDataStatus === "error" && (
        <>
          {connectionError ? (
            <PageError {...fsdConnectionErrorProps} />
          ) : (
            <BoxError {...fsdConnectionErrorProps} />
          )}{" "}
        </>
      )}
      {(["main", "card"].includes(view) &&
        (!mainData ||
          mainData.length <= 0 ||
          (mainData && mainData.length > 0 && lastPage === 1))) ||
      (view === "search" && (!searchData || searchData.length <= perPage)) ? (
        <></>
      ) : (
        <Pagination
          currentPage={view === "search" ? currentSearchPage || 1 : currentPage}
          lastPage={view === "search" ? lastSearchPage || 1 : lastPage}
          onChange={paginate}
        />
      )}
      <button
        className={`add-btn ${classes["dataViewProvider__add-btn"]}`}
        onClick={showAddModal}
      >
        {`Add ${section}`}
      </button>
    </div>
  );
};

export default DataViewProvider;
