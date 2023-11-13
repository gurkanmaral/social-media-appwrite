import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import PostCard from './PostCard'

type GridPostListProps = {
  posts:Models.Document[];
}

const SavedPostList = ({posts}:GridPostListProps) => {

  const {user} = useUserContext();

  console.log(posts)


  return (
   <ul className='w-full flex flex-col gap-10'>
    {posts.map((post)=>(
        <p>{post.caption}</p>
    ))}
   </ul>
  )
}

export default SavedPostList