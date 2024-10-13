import { Path } from "../types/form";

export default (path: Path, regular?: boolean | null | undefined) => {
  if (!regular) {
    return path.reduce(
      (str: string, prop , index) =>
        isNaN(Number(prop)) ? str + `${index === 0 ? "" : "."}` + prop : str + `[${Number(prop)}]`,
      ""
    );
  }
  else {
    return path.reduce((str:string,prop) => str+prop , "");
  }
};
