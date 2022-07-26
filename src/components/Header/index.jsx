import React from 'react';
import Button from '@mui/material/Button';
import {useSelector, useDispatch} from 'react-redux'
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import {Link} from 'react-router-dom'
import { logout, selectIsAuth } from '../../redux/Slices/auth';

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch()

  const onClickLogout = () => {
    if (window.confirm('are you sure to exit')) {
    dispatch(logout())
    localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to='/'>
            <div>ARCHAKOV BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
