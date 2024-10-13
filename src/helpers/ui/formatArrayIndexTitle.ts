export default (title: string, index: number) => {
  return title.split("").slice(0, -1).join("") + ` ${index + 1}`;
};
