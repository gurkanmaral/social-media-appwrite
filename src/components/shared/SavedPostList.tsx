
import { Models } from 'appwrite'
type GridPostListProps = {
  posts:Models.Document[];
}

const SavedPostList = ({posts}:GridPostListProps) => {



  return (
   <ul className='w-full flex flex-col gap-10'>
    {posts.map((post)=>(
        <p>{post.caption}</p>
    ))}
   </ul>
  )
}

export default SavedPostList