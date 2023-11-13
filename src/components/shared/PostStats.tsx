import { useUserContext } from '@/context/AuthContext';
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite'
import {useState,useEffect,React} from 'react'
import Loader from './Loader';

type PostStatsProps = {
    post: Models.Document;
    userId:string;
}

const PostStats = ({post,userId}:PostStatsProps) => {

    const likesList = post?.likes?.map((user:Models.Document)=> user?.$id)

    const [likes,setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)

    
    const {mutate:likePost} = useLikePost()
    const {mutate:savePost,isPending:isSavingPost} = useSavePost()
    const {mutate:deleteSavedPost,isPending:isDeletingSaved} = useDeleteSavePost()

    const {data:currentUser} = useGetCurrentUser()

    const savedPostRecord = currentUser?.save.find(
        (record:Models.Document)=>record.post.$id === post?.$id)

    useEffect(()=>{
        setIsSaved(savedPostRecord ? true : false)
    },[currentUser])

    const handeLikePost = (e: React.MouseEvent) =>{
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes?.includes(userId)

        if(hasLiked){
            newLikes = newLikes.filter((id)=>id !== userId)
        }else{
            newLikes.push(userId)
        }
        setLikes(newLikes)
        likePost({postId:post.$id,likesArray:newLikes})
    }

    const handleSavePost = (e: React.MouseEvent) =>{
        e.stopPropagation();

       

        if(savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord?.$id)
           
        }else{
            savePost({postId:post?.$id,userId})
            setIsSaved(true)
        }
       
    }

  return (
    <div className='flex justify-between items-center z-20 '>
        <div className='flex gap-3 mr-5 items-center justify-center  '>
           <div className='items-center flex gap-1 text-gray-500   '>
                <img src={`${checkIsLiked(likes,userId) ?
                    "/assets/icons/liked.svg" 
                    : "/assets/icons/like.svg" 
                }`}
                    alt="like"
                    width={18}
                    height={18}
                    onClick={handeLikePost}
                    className='cursor-pointer ' 

                />
                <p className='small-medium lg:base-medium'>
                    {likes?.length}
                </p>
           </div>
            <div className='flex gap-1 text-gray-500  items-center  justify-center cursor-pointer '>
                 <img src="/assets/icons/comment2.svg" 
                width={18}
                height={18}  alt="" 
                className='cursor pointer'
                />
                <p>
                    {post?.comments?.length} 
                </p> 
                    </div>
        </div>
        <div className='flex gap-2 '>
         {isSavingPost || isDeletingSaved ? <Loader/> :  <img 
            src={
                isSaved ? "/assets/icons/saved.svg"
                : "/assets/icons/save.svg"
            }
            width={20}
            height={20}
            onClick={handleSavePost}
            className='cursor-pointer' 

        />  }
        </div>
    </div>
  )
}

export default PostStats