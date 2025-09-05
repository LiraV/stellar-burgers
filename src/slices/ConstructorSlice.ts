import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../services/store';
import { v4 as uuid } from 'uuid';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  counter: number;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  counter: 0,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const placeOrderThunk = createAsyncThunk<
  TOrder,
  void,
  { state: RootState }
>('constructor/placeOrder', async (_arg, { getState }) => {
  const { bun, ingredients } = getState().burgerConstructor;
  if (!bun) {
    throw new Error('Не выбрана булка');
  }
  const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
  const res = await orderBurgerApi(ids);
  return res.order;
});

const ConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;
      state.ingredients.push({
        ...ingredient,
        id: `${uuid()}`
      } as TConstructorIngredient);
    },
    removeIngredientById(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    clearOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrderThunk.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(placeOrderThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      state.bun = null;
      state.ingredients = [];
    });
    builder.addCase(placeOrderThunk.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message ?? 'Ошибка обработки заказа';
    });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredientById,
  moveIngredient,
  clearConstructor,
  clearOrderModal
} = ConstructorSlice.actions;

export default ConstructorSlice.reducer;

export const selectBun = (state: RootState) => state.burgerConstructor.bun;
export const selectOtherIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectConstructorItems = createSelector(
  [selectBun, selectOtherIngredients],
  (bun, ingredients) => ({ bun, ingredients })
);

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;
