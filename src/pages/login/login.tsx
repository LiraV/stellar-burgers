import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { loginThunk, selectUserLoading } from '../../slices/UserSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectUserLoading);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading) return;
    void dispatch(loginThunk({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
        setFormError('');
      })
      .catch((err) => {
        setFormError(err?.message || 'Ошибка авторизации:');
      });
  };

  return (
    <LoginUI
      errorText={formError}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
