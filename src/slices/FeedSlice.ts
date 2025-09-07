import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { stat } from 'fs';
import { RootState } from 'src/services/store';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async () => await getFeedsApi()
);

const FeedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeed.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка в ленте заказов';
    });
  }
});

export default FeedSlice.reducer;

export const selectFeed = (state: RootState) => state.feed.orders;
export const selectTotal = (state: RootState) => state.feed.total;
export const selectTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedTotals = createSelector(
  [selectTotal, selectTotalToday],
  (total, totalToday) => ({ total, totalToday })
);
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export const selectFeedStatuses = createSelector([selectFeed], (orders) => {
  const done = [] as number[];
  const pending = [] as number[];
  for (const order of orders) {
    if (order.status === 'done') done.push(order.number);
    else pending.push(order.number);
  }
  return {
    done: done.slice(0, 10),
    pending: pending.slice(0, 10)
  };
});
