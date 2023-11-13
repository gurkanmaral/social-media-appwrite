import { useLikeComment } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

type CommentProps = {
    item: Models.Document
    user:string;
    currentUser:Models.Document
}

const Comment = ({item,user,currentUser}:CommentProps) => {

    const likesList = item.commentLikes.map((user:Models.Document)=> user.$id)

    const [likes,setLikes] = useState(likesList)

    const{mutate:likeComment,isPending} = useLikeComment()

    const handeLikePost = (e: React.MouseEvent) =>{
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(user)

        if(hasLiked){
            newLikes = newLikes.filter((id)=>id !== user)
        }else{
            newLikes.push(user)
        }
        
        setLikes(newLikes)
        likeComment({commentId:item.$id,likesArray:newLikes})
    }




console.log(likesList)
  return (
    <div className='flex items-center '>
        <div className='flex flex-col w-full gap-2'>
        <div className='flex  gap-2 '>
               <Link to={`/profile/${item?.userId.$id}`} className='flex  '>
                <img src={item?.userId?.imageUrl} alt=""  
                className='rounded-[50%] w-[75px] h-[75px] object-cover'
                />
               </Link>          
            <div className='flex flex-col max-w-[90%] overflow-hidden break-words  gap-2 '>
                <div className='flex gap-1'>                
                    <p className='font-bold'>{item?.userId?.name}</p>                
                    <p className=' text-gray-500'>@{item?.userId?.username}</p>                   
                </div>             
                   <div className=' '>
                   <p className='overflow-hidden break-words'>
                        {item?.comment}
                   </p>   
                </div>    
                <div onClick={handeLikePost} className='flex mt-2 gap-[5px] items-center '>
                  <img src={`${checkIsLiked(likes,currentUser?.$id) ?
                    "/assets/icons/liked.svg" 
                    : "/assets/icons/like.svg" 
                }`}
                    alt="like"
                    width={18}
                    height={18}
                    onClick={handeLikePost}
                    className='cursor-pointer' 
                />
                <p className='text-gray-500'>
                    {likes.length}
                </p>
                </div>                 
            </div>           
        </div>
        <hr className="border w-full  border-dark-4/80 " />  
        </div>
      
    </div>
  )
}

export default Comment