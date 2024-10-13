export interface TimeInfo {
  year: number;
  month: number;
}

export type ProductSalesSummary = { name: string; revenue: number; amount: number };
export type CustomerPurchaseSummary = {username: string; revenue: number; amount: number;}

export interface Sale {
  _id: { year: number; month: number; day?: number; };
  year?: number;
  month?: number | string;
  day?: number;
  amount: number;
  revenue: number;
}

export interface MostSoldProduct {
  _id: { year: number; month: number };
  year: number;
  month: number | string;
  revenue: ProductSalesSummary;
  amount: ProductSalesSummary;
}

export interface TopBuyer {
  _id: { year: number; month: number };
  year: number;
  month: number | string;
  revenue: CustomerPurchaseSummary;
  amount: CustomerPurchaseSummary;
}

export enum RevenueOrAmount {
  REVENUE = "revenue",
  AMOUNT = "amount",
}

export interface SaleState {
  sales: Sale[] | null;
  selectedSaleId: { year: number; month: number } | null;
  topBuyers: TopBuyer[] | null;
  mostSoldProducts: MostSoldProduct[] | null;
}
