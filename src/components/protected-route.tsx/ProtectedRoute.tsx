import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthChecked, selectUser } from '../../slices/UserSlice';
import { Preloader } from '@ui';

type Props = { onlyGuests?: boolean };

export const ProtectedRoute: FC<Props> = ({ onlyGuests }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectAuthChecked);

  if (!isAuthChecked) return <Preloader />;

  if (onlyGuests && user) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyGuests && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
