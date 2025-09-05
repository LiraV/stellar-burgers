import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { registerThunk, selectUserLoading } from '../../slices/UserSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector(selectUserLoading);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!userName || !email || !password) {
      setFormError('Введите имя, email и пароль');
      return;
    }

    try {
      await dispatch(
        registerThunk({ name: userName, email, password })
      ).unwrap();
      navigate('/', { replace: true });
    } catch (err: any) {
      setFormError(err?.message || 'Ошибка регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={formError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
