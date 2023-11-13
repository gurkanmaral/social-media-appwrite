import { Models } from 'appwrite'
import PostCard from './PostCard'

type GridPostListProps = {
  posts?:Models.Document[];

}

const HomePostList = ({posts}:GridPostListProps) => {


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