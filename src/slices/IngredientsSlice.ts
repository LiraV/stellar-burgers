import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { stat } from 'fs';
import { RootState } from 'src/services/store';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = action.payload;
    },
    resetIngredients(state) {
      state.items = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Ошибка загрузки данных';
    });
  }
});

export const { setIngredients, resetIngredients, setLoading, setError } =
  ingredientsSlice.actions;

export default ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectOrderPriceByIds = (ids: string[]) => (state: RootState) => {
  const byId = new Map(state.ingredients.items.map((i) => [i._id, i.price]));
  return ids.reduce((sum, id) => sum + (byId.get(id) ?? 0), 0);
};
