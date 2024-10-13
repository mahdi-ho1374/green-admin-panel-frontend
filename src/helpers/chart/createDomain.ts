export const roundToNearestAbove = (value: number) => {
  const stringNumber = value.toString();
  const arrayNumber: string[] = stringNumber.split("");
  if (arrayNumber.length > 2) {
    let spliceIndex = 0;
    if (arrayNumber[0] === "9") {
      arrayNumber.unshift("1");
      spliceIndex = 1;
      const firstValues = arrayNumber.splice(0, spliceIndex);
      const otherValues = arrayNumber.map((number) => "0");
      return Number([...firstValues, ...otherValues].join(""));
    } else if (arrayNumber[1] === "9") {
      arrayNumber[0] = String(Number(arrayNumber[0]) + 1);
      spliceIndex = 1;
    } else {
      arrayNumber[1] = String(Number(arrayNumber[1]) + 1);
      spliceIndex = 2;
    }
    const firstValues = arrayNumber.splice(0, spliceIndex);
    const otherValues = arrayNumber.map((number) => "0");
    return Number([...firstValues, ...otherValues].join(""));
  } else {
    if (Number(arrayNumber[1]) > 5) {
      arrayNumber[0] = String(Number(arrayNumber[0]) + 1);
      arrayNumber[1] = "0";
    } else if (Number(arrayNumber[1]) < 5 && Number(arrayNumber[1]) > 1) {
      arrayNumber[1] = "5";
    }
    return Number(arrayNumber.join(""));
  }
};

export const roundToNearestUnder = (value: number) => {
  const stringNumber = value.toString();
  const arrayNumber: string[] = stringNumber.split("");
  if (arrayNumber.length > 2) {
    let spliceIndex = 0;
    if (arrayNumber[1] === "0") {
      spliceIndex = 1;
    } else {
      arrayNumber[1] = "0";
      spliceIndex = 2;
    }
    const firstValues = arrayNumber.splice(0, spliceIndex);
    const otherValues = arrayNumber.map((number) => "0");
    return Number([...firstValues, ...otherValues].join(""));
  } else {
    if (Number(arrayNumber[1]) > 5) {
      arrayNumber[1] = "5";
    } else if (Number(arrayNumber[1]) < 5 && Number(arrayNumber[1]) > 1) {
      arrayNumber[1] = "0";
    }
    return Number(arrayNumber.join(""));
  }
};

export default (data: Record<string, any>, key: string) => {
  const domain = { min: Infinity, max: -Infinity };
  data.reduce((domain: { min: number; max: number }, item: any) => {
    domain.max = item[key] > domain.max ? item[key] : domain.max;
    domain.min = item[key] < domain.min ? item[key] : domain.min;
    return domain;
  }, domain);
  let difference = domain.max - domain.min;
  domain.min -= difference / 10;
  domain.max += difference / 10;
  domain.min = Math.floor(domain.min);
  domain.max = Math.ceil(domain.max);

  domain.min = roundToNearestUnder(domain.min);
  domain.max = roundToNearestAbove(domain.max);
  if (domain.min < 0) {
    domain.min = 0;
  }
  return domain;
};
