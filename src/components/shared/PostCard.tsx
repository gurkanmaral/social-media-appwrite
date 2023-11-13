import { useUserContext } from '@/context/AuthContext'
import { formatDateString } from '@/lib/utils'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'

type PostCardProps = {
    post:Models.Document,
}

const PostCard = ({post}:PostCardProps) => {

    const {user} = useUserContext()

    if(!post.creator) return
  
console.log(post)
  return (
    <div className='post-card gap-2 flex flex-col '>
        <div className='flex-between'> 
            <div className='flex gap-3'>
                 <Link to={`/profile/${post.creator?.$id}`}>
                    <img src={post.creator?.imageUrl || 
                    '/assets/icons/profile-placeholder.svg'}
                     alt="" 
                     className='rounded-full w-12 lg:h-12'
                     />
                 </Link>  

                 <div className='flex flex-col'>
                   <div className='flex gap-1 p-1 '>
                    <div className=''>
                        <p className='base-medium lg:body-bold text-light-1 '>
                                {post.creator.name}
                        </p>
                    </div>
                   <div className=''>
                    <p className='text-[16px]    text-gray-400'>
                            @{post.creator.username}
                        </p>
                   </div>
                    <div className='hidden md:flex items-center gap-2  text-gray-400 '>
                        <p className='subtle-semibold lg:small-regular'>
                         · {formatDateString(post.$createdAt)}
                        </p>
                        -
                       {post.location && <p className='hidden md:block subtle-semibold lg:small-regular'>
                            {post.location}
                        </p>}
                    </div>
                   </div>               
                <div className='small-medium lg:text-[16px] lg:font-normal leading-[140%] p-1'>
                    <Link to={`/posts/${post.$id}`} className='flex flex-col gap-2'>
                       {post.caption && <p className='text-[18px] font-bold'>{post.caption}</p>     }
                        {post.desc && <p>{post.desc}</p>  }
                    </Link>
                    <ul className='flex gap-1 mt-2'>
                    {post.tags.length > 1 && post.tags.map((tag:string)=>(
                        <li key={tag} className='text-gray-500'>
                            #{tag}
                        </li>
                    ))}
                    </ul>       
                 </div>
                 </div>              
            </div>
        </div>
        <Link to={`/posts/${post.$id}`}>
            {post.imageUrl && (
                  
                   post.imageUrl.includes("/preview?") ? (
                        <img src={post.imageUrl} alt="Image" className="post-card_img mt-2" />
                    ) : (
                        <div className='flex items-center justify-center'>
                            <video controls className=' rounded-[5px]   object-contain max-h-[700px]  '>
                        <source src={post.imageUrl} type="video/mp4"  />
                         Your browser does not support the video tag.
                        </video>
                        </div>
                      
                    )
                    )}
        </Link>
        <PostStats 
        post={post}
        userId={user.id}
        />
    </div>
  )
}

export default PostCard