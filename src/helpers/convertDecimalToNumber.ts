export default function convertDecimalToNumber (obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if ("$numberDecimal" in obj) {
    
    return parseFloat(parseFloat(obj["$numberDecimal"].toString()).toFixed(2));
  }

  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      
      result[key] = convertDecimalToNumber(obj[key]);
    }
  }
  return result;
};
