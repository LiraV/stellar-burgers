import { FC, useMemo, useState, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { selectIngredients } from '../../slices/IngredientsSlice';
import { selectFeed } from '../../slices/FeedSlice';
import { selectProfileOrders } from '../../slices/ProfileOrdersSlice';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const dispatch = useDispatch<AppDispatch>();

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const feedOrders = useSelector(selectFeed);
  const profileOrders = useSelector(selectProfileOrders);

  const inFeed = feedOrders.find((order) => order.number === orderNumber);
  const inProfile = profileOrders.find((order) => order.number === orderNumber);

  const [orderDirect, setOrderDirect] = useState<TOrder | null>(null);
  const [loadingDirect, setLoadingDirect] = useState(false);
  const [errorDirect, setErrorDirect] = useState<string | null>(null);

  useEffect(() => {
    if (inFeed || inProfile || loadingDirect || orderDirect) return;
    let canceled = false;
    (async () => {
      try {
        setLoadingDirect(true);
        setErrorDirect(null);
        const res = await getOrderByNumberApi(orderNumber);
        if (!canceled) setOrderDirect(res.orders?.[0] ?? null);
      } catch (error: any) {
        if (!canceled)
          setErrorDirect(error?.message ?? 'Ошибка загрузки страницы заказа');
      } finally {
        if (!canceled) setLoadingDirect(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [orderNumber, inFeed, inProfile, loadingDirect, orderDirect]);

  const orderData = inFeed ?? inProfile ?? orderDirect ?? null;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
