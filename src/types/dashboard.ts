import { ChartComment } from "./comment";
import { ChartOrder } from "./order";
import { ChartProduct } from "./product";
import { Sale } from "./sale";
import { ChartUser } from "./user";

export interface Totals {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalAmounts: number;
  totalComments: number;
}

export type Last30DaysDataValue = [previousPeriod: number,currentPeriod: number];

export interface Last30DaysData {
  last30daysCustomers: Last30DaysDataValue;
  last30DaysProducts: Last30DaysDataValue;
  last30DaysRevenue: Last30DaysDataValue;
  last30DaysComments: Last30DaysDataValue;
  last30DaysAmount: Last30DaysDataValue;
  last30DaysUsers: Last30DaysDataValue;
};

export interface ChartData {
  orders: ChartOrder[];
  comments: ChartComment[];
  users: ChartUser[];
  sales: Sale[];
  categories: ChartProduct[];
};

export interface DashboardState {
  totals: Totals | null;
  last30Days: Last30DaysData | null;
  chartData: ChartData | null;
};
