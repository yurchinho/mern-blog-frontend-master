import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector } from 'react-redux'
import {useNavigate ,Navigate , useParams} from 'react-router-dom'
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from "../../redux/slices/auth";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl , setImageUrl] = React.useState('');
  const [isLoading , setLoading] = React.useState(false);
  const inputFileRef =  React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    }catch(err){
      console.warn(err);
      alert('Помилка при завантаженні файла!')
    }
  };


  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text, 
      }

      const {data } = isEditing ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields)

      const _id = isEditing? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert('Помилка при створенні статті!')
    }
  }

  React.useEffect(() => {
   if(id){
    axios.get(`/posts/${id}`).then(data => {
      setTitle(data.title);
      setText(data.text);
      setImageUrl(data.imageUrl);
      setTags(data.tags.join(','));
    }).catch(err => {
      console.log(err);
      alert('Помилка при отриманні статті!')
    })
   } 
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введіть текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!window.localStorage.getItem('token') && !isAuth){
    return <Navigate to="/"/>
  }

  console.log(title, tags ,text)

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
       Завантажити  фото
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
       <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Видалити
        </Button>
        <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
       </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статті..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
       value={tags}
       onChange={(e) => setTags(e.target.value)}
      classes={{ root: styles.tags }} 
      variant="standard" placeholder="Теги" 
      fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          { isEditing ? 'Зберегти' : 'Опублікувати'}
        </Button>
        <a href="/">
          <Button size="large">Відміна</Button>
        </a>
      </div>
    </Paper>
  );
};
