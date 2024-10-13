export default (path: string[], ...restArgs: any[]) => {
  
  const key = (
    Array.isArray(path) ? [...path, ...restArgs] : [path, ...restArgs]
  ).reduce(
    (result, item, index,array) =>
    {
      return index !== array.length - 1 ? result + item + "-" : result + item
    },
    ""
  );
  return key;
};
