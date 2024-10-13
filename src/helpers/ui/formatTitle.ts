const formatTitle = (title: string) => {
  if (title && title !== "undefined") {
    const wordsString = title.replace(/([A-Z])/g, " $1").replace(/_/g, "");
    return wordsString
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return title;
};

export default formatTitle;

export function formatObjectProperties(obj: Record<string, any>) {
  const transformedObj: Record<string, any> = {};

  for (let key in obj) {
    if (key !== undefined && key !== "undefined") {
      const formattedKey = formatTitle(key);
      transformedObj[formattedKey] = obj[key];
    } else {
      transformedObj[key] = obj[key];
    }
  }
  return transformedObj;
}
