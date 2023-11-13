import { useAddComment, useGetComments } from '@/lib/react-query/queriesAndMutations'
import React, { useState } from 'react'
import Loader from './Loader'
import Comment from './Comment'
import { Models } from 'appwrite'

type CommentsProps = {
  post:Models.Document,
  user:string,
  currentUser:any
}


const Comments = ({post,user,currentUser}:CommentsProps) => {

    const [comment,setComment] = useState("")
    
    const {mutate:commentMutate,isPending} = useAddComment()

    const {data:commentData,isPending:commentLoading} = useGetComments(post?.$id)



    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        if(comment.trim() === ""){
            return
        }
        const userId=user;
        const postId= post.$id;
        commentMutate({userId,postId, comment})
        setComment("")
    }
   
  return (
    <div className='flex flex-col '>
        <div className='w-full'>
            <form onSubmit={(e)=>handleSubmit(e)} className='flex gap-4' >
              <div>
                <img src={currentUser?.imageUrl} 
                width={80}
                height={80}
                className='rounded-[50%]'
                alt="" />
              </div>
              <div className='flex flex-col gap-2 w-full'>
              <div className='items-center w-full flex '>
                    <textarea
                    placeholder='Add Comment..'
                    onChange={(e)=>setComment(e.target.value)}
                    value={comment} 
                    className='custom-scrollbar bg-transparent  text-white p-2 border-none outline-none w-full  break-words resize-none  h-auto  '
                    
                 >
                    </textarea> 
              </div>
                <div className=' justify-end flex'>
                
                <button type='submit' className={` ${!isPending ? 'border' : ''}  orange_gradient font-bold py-2 px-4 rounded-lg`}>
                {isPending ? (<Loader />) : 'Send' }
                 </button>
                </div>           
            </div>  
            </form>  
        </div>
        <hr className="border w-full mt-4  border-dark-4/80 " />  
        <div className=' mt-4 flex flex-col gap-4'>
           {commentLoading ? (
            <Loader />
           ): (
            commentData?.documents.map((item)=>(
                <Comment
                key={item.$id}
                user={user}
                item={item}
                currentUser={currentUser}
                />
            ))
           )}
        </div>

    </div>
  )
}

export default Comments