import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import PostCard from './PostCard'

type GridPostListProps = {
  posts:Models.Document[];
  showUser?:boolean;
  showStats?:boolean;
}

const HomePostList = ({posts,showUser=true,showStats=true}:GridPostListProps) => {






  return (
   <ul className='w-full flex flex-col gap-10'>
      {posts?.map((post)=>(
       <PostCard 
        post={post}
        key={post.$id}

       />
      ))}
   </ul>
  )
}

export default HomePostList