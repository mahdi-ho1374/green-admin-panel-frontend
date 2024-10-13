import { View } from "../../types/generic";

export interface CreateUrlProps {
  page: string;
  currentPage: string | number;
  searchTerm?: string;
  params: {
    [key: string]: string | number | boolean | undefined | null;
  };
  view?: View;
}

export default ({
  page,
  currentPage,
  params,
  view,
  searchTerm,
}: CreateUrlProps) => {
  const allFalsy = Object.values(params).every((value) => !value);
  params.currentPage = view === "search" ? currentPage : undefined;
  params.term = view === "search" ? searchTerm : undefined;
  const urlPath = `/${page}${view ? "/" + view : ""}${
    view !== "search" ? "/" + currentPage : ""
  }${
    allFalsy
      ? ""
      : "?" +
        Object.keys(params).reduce(
          (url, param) =>
            [undefined, null, ""].includes(params[param] as string)
              ? url
              : url + "&" + param + "=" + params[param],
          ""
        )
  }
    `;

  return urlPath;
};
