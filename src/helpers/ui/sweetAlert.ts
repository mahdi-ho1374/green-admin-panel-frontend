import { SwalType } from "../../types/ui";
import Swal from "sweetalert2";
import { uiColors } from "../../store";

interface SweetAlertProps {
  type: SwalType;
  title?: string;
  message?: string;
}

export default ({ type, title, message }: SweetAlertProps) => {
  if (type === SwalType.SUCCESS) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${title} successfully`,
      showConfirmButton: false,
      customClass: {
        container: "sweet-alert__container",
        popup: "sweet-alert__modal",
        title: "sweet-alert__title",
        htmlContainer: "sweet-alert__text",
      },
      timer: 3000,
      iconColor: uiColors.success,
      color: uiColors.text,
      background: uiColors.secondary,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  } else if (type === SwalType.ERROR) {
    Swal.fire({
      icon: "error",
      title: title || "Oops...",
      html: `<p class="sweetAlert__paragraph" >${
        message || "Something went wrong!"
      }</p>`,
      customClass: {
        container: "sweet-alert__container",
        popup: "sweet-alert__modal",
      },
      iconColor: uiColors.error,
      color: uiColors.text,
      background: uiColors.secondary,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
};
