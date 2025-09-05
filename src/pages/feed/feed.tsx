import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  fetchFeed,
  selectFeed,
  selectFeedError,
  selectFeedLoading
} from '../../slices/FeedSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../slices/IngredientsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const orders: TOrder[] = useSelector(selectFeed);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchFeed());
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, []);

  const handleGetFeeds = () => {
    if (!loading) {
      dispatch(fetchFeed());
    }
  };

  if (loading && orders.length === 0) {
    return <Preloader />;
  }
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
