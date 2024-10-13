import { SelectProps, Path } from "../../types/form";

export default (values: (string | number)[], path: Path, disabled = false) => {
  return {
    reverseColor: true,
    values,
    initialValue: values[0],
    path,
    disabled,
  } as SelectProps;
};
