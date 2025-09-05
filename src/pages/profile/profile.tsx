import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  selectUser,
  selectUserLoading,
  updateUserThunk
} from '../../slices/UserSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
    setErrorText('');
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading || !isFormChanged) return;
    const payload: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== (user?.name ?? '')) payload.name = formValue.name;
    if (formValue.email !== (user?.email ?? ''))
      payload.email = formValue.email;
    if (formValue.password) payload.password = formValue.password;

    try {
      await dispatch(updateUserThunk(payload)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
      setErrorText('');
    } catch (err: any) {
      setErrorText(err?.message || 'Не удалось сохранить изменеия');
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
