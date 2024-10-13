export default (obj: Record<string, any> | null | undefined): Record<string, any> => {
  if(!obj) {
    return {};
  }
  const keys = Object.keys(obj);

  const primitiveKeys: string[] = [];
  const objectKeys: string[] = [];

  keys.forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      objectKeys.push(key);
    } else {
      primitiveKeys.push(key);
    }
  });

  const sortedKeys: string[] = [...primitiveKeys, ...objectKeys];

  const sortedObject: Record<string, any> = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = obj[key];
  });

  return sortedObject;
}

