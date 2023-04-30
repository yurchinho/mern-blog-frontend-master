import React from 'react';
import {useDispatch, useSelector } from 'react-redux'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {Navigate} from 'react-router-dom'
import {useForm} from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import { fetchAuth, fetchRegister, selectIsAuth } from "../../redux/slices/auth";

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch();  

  const {
    register , handleSubmit,  formState : {
      errors,
      isValid
    }}  = useForm({
    defaultValues:{
      fullName: 'Yura Popiuk',
      email: 'yura@gmail.com',
      password: 'yurapopiuk',
    },
    mode: 'onChange',
  });


  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))

    if(!data.payload){
      alert('Не вдалося зареєструватися!')
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    }
  };


  if(isAuth){
    return <Navigate to="/"/>
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
     <form onSubmit={handleSubmit(onSubmit)}>
     <TextField   error={Boolean(errors.fullName ?.message)}
        helperText={errors.fullName ?.message}
        {... register('fullName', {required: 'Вкажіть повне ім*я'})}
         className={styles.field} label="Повне ім*я" fullWidth />
      <TextField   error={Boolean(errors.email ?.message)}
        helperText={errors.email ?.message}
        type="email"
        {... register('email', {required: 'Вкажіть пошту'})}
         className={styles.field} label="E-Mail" fullWidth />
      <TextField   error={Boolean(errors.password ?.message)}
        helperText={errors.password ?.message}
        {... register('password', {required: 'Вкажіть пароль'})}
         className={styles.field} label="Пароль" fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Зареєструватися
      </Button>
     </form>
    </Paper>
  );
};
