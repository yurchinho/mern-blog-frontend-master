import React from "react";
import axios from '../axios' 
import {useParams} from 'react-router-dom'
//import { ReactMarkdown } from "react-markdown";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const FullPost = () => {

  const [data , setData] = React.useState();
  const [isLoading, setloading] = React.useState(true);

  const {id} = useParams();

  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setloading(false);
    }).catch(err => {
      console.warn(err);
      alert('Помилка при отриманні статті')
    })
  }, []);

  if(isLoading){
    return <Post isLoading={isLoading} isFullPost/>
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4000${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
      <ReactMarkdown children={data.text}/>

      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкін",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Це тестовий коментар 555555",
          },
          {
            user: {
              fullName: "Петро Іванюк",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "Я Петро Іванюк, люблю грати кс",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
