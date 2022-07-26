import React, { useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import {useNavigate, Navigate, useParams, useLocation} from 'react-router-dom'
import 'easymde/dist/easymde.min.css';
import {useSelector} from 'react-redux'
import styles from './AddPost.module.scss';
import { logout, selectIsAuth } from '../../redux/Slices/auth';
import { useState } from 'react';
import { instance } from '../../redux/axios';

export const AddPost = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const inputFileRef = useRef(null)
  const [imageUrl, setImageURL] = useState('')
  const {id} = useParams()


  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const {data} = await instance.post('/upload', formData)
      setImageURL(data.url)
    } catch (error) {
      console.log(error)
      alert('error')
    }
  };

  const onClickRemoveImage = () => {
    setImageURL('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title, imageUrl, text, tags: tags.split(' ')
      }
      const {data} = await instance.post('/posts', fields)

      const id = data._id

      navigate(`/posts/${id}`)
    } catch (error) {
      console.warn(error)
      alert('error')
    }
  }
  useEffect(() => {
    if (id) {
      const foo = async () => {
        const {data} = await instance.get(`/posts/${id}`)
        console.log(data)
        setTitle(data.title)
        setText(data.text)
        setTags(data.tags.join(' '))
        setImageURL(data.imageUrl)
      }
      foo()
    }
  }, [])
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

    if (!localStorage.getItem('token') && !isAuth) {
      return <Navigate to='/'/>
    }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange = {e => setTitle(e.target.value)}
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth value={tags}
        onChange = {e => setTags(e.target.value)}/>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
