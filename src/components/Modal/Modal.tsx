import React, {
  FC,
  ReactNode,
  MouseEvent,
  useEffect,
  ReactElement,
} from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHooks";
import { uiActions } from "../../store/slices/ui";
import { formActions } from "../../store/slices/form";
import { genericActions } from "../../store/slices/generi";
import { useLocation } from "react-router-dom";
import { GenericKey } from "../../types/generic";

interface modalProps {
  children: ReactElement;
  id: string;
  genericKey: GenericKey;
  closeModalFunc?: () => void;
}

const Modal: FC<modalProps> = (props) => {
  const id = props.id;
  const genericKey = props.genericKey;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const section = location.pathname
    .split("/")[1]
    .split("")
    .slice(0, -1)
    .join("");

  useEffect(() => {
    const exitModal = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", exitModal);

    return () => {
      window.removeEventListener("keydown", exitModal);
    };
  }, []);

  function closeModal(): void {
    dispatch(uiActions.toggleModal());
    if (props.closeModalFunc) {
      props.closeModalFunc();
    }
  }

  const closeByClickingOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(`#${id}`)) {
      closeModal();
    }
  };

  const renderChildren = () => {
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child as ReactElement, {
        closeModal: closeModal,
      });
    });
  };

  return ReactDOM.createPortal(
    <div className={classes.modal} onClick={closeByClickingOutside}>
      {renderChildren()}
    </div>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default Modal;
