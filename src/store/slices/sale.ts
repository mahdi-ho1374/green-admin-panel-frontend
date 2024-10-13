import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SaleState,MostSoldProduct,TopBuyer,Sale } from "../../types/sale";

const initialState: SaleState = {
  sales: null,
  selectedSaleId: null,
  mostSoldProducts: null,
  topBuyers: null,
};

const saleSlice = createSlice({
  name: "sale",
  initialState,
  reducers: {
    setSales(state, action: PayloadAction<Sale[]>) {
      state.sales = action.payload;
    },
    setMostSoldProducts(state,action: PayloadAction<MostSoldProduct[]>) {
      state.mostSoldProducts = action.payload;
    },
    setTopBuyers(state,action: PayloadAction<TopBuyer[]>) {
      state.topBuyers = action.payload;
    }
  },
});

export const saleActions = saleSlice.actions;

export default saleSlice;
