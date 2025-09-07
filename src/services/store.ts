import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredients from '../slices/IngredientsSlice';
import burgerConstructor from '../slices/ConstructorSlice';
import user from '../slices/UserSlice';
import feed from '../slices/FeedSlice';
import profileOrders from '../slices/ProfileOrdersSlice';
import { combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients,
  burgerConstructor,
  user,
  feed,
  profileOrders
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
