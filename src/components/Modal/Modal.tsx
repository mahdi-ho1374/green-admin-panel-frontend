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
  const dispatch = useAppDispatch();

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
      return React.cloneElement(props.children, {
        closeModal,
      });
  }

  return ReactDOM.createPortal(
    <div className={classes.modal} onClick={closeByClickingOutside}>
      {renderChildren()}
    </div>,
    document.getElementById("modal") as HTMLDivElement
  );
};

export default Modal;
