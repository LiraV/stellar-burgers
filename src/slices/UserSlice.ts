import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';
import { getUserApi } from '@api';
import type { RootState } from '../services/store';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const loginThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const getUserThunk = createAsyncThunk('user/get', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
});

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    const start = (state: UserState) => {
      state.isLoading = true;
      state.error = null;
    };
    const fail = (state: UserState, message?: string) => {
      state.isLoading = false;
      state.error = message ?? 'Ошибка';
    };

    builder.addCase(registerThunk.pending, start);
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerThunk.rejected, (state, action) =>
      fail(state, action.error.message)
    );

    builder.addCase(loginThunk.pending, start);
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(loginThunk.rejected, (state, action) =>
      fail(state, action.error.message)
    );

    builder.addCase(getUserThunk.pending, start);
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.error = action.error.message ?? 'Ошибка';
      state.user = null;
    });

    builder.addCase(updateUserThunk.pending, start);
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) =>
      fail(state, action.error.message)
    );

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthChecked = true;
    });
  }
});

export default UserSlice.reducer;
export const { setAuthChecked } = UserSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
