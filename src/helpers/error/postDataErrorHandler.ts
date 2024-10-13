import sweetAlert from "../ui/sweetAlert";
import { SwalType } from "../../types/ui";

export interface postDataErrorHandlerProps {
  response: any;
  data: { error: string } | null;
}

export default ({ response, data }: postDataErrorHandlerProps) => {
  let title = "";
  if ((!response && !data) || response.status === 500) {
    sweetAlert({ type: SwalType.ERROR });
    return;
  }
  if (response.status === 422) {
    title = "Invalid data";
  }
  if (response.status === 400) {
    title = "Bad Request";
  }
  if (response.status === 409) {
    title = "Conflict data";
  }
  if (response.status === 404) {
    title = "Not found";
  }
  if (response.status >= 400) {
    sweetAlert({
      type: SwalType.ERROR,
      title: title,
      message: data!.error,
    });
    return;
  }
};
