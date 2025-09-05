import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients
} from '../../slices/IngredientsSlice';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '../../slices/ProfileOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const orders: TOrder[] = useSelector(selectProfileOrders);
  const loading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
