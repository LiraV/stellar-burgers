import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/fetch',
  async () => await getOrdersApi()
);

const ProfileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchProfileOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка заказов профиля';
    });
  }
});

export default ProfileOrdersSlice.reducer;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
