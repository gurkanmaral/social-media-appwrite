import {useState,useEffect} from 'react'

import { useAddRelation, useDeleteRelation } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import Loader from './Loader'
import { Link } from 'react-router-dom'



type UserCardProps = {
    user: Models.Document,
    currentUser:any,
}


const RightBarUserCard = ({user,currentUser}:UserCardProps) => {

    const [isFollowed,setIsFollowed] = useState(false)

    const {mutate:followUser,isPending:isFollowingUser} = useAddRelation()
    const {mutate:deleteRelation,isPending:isDeletingRelation} = useDeleteRelation()

    const savedPostRecord = currentUser?.followerUsers.find(
        (record:Models.Document)=>record.followed.$id === user.$id)

       

        useEffect(()=>{
            setIsFollowed(savedPostRecord ? true : false)
        },[currentUser])
        
    const handleFollow = () =>{

        if(savedPostRecord){
            setIsFollowed(false)
            deleteRelation(savedPostRecord.$id)
        }else{
            setIsFollowed(true)
            followUser({followerId:currentUser.$id, followedId:user.$id})
        }
       
    }

  return (
    <div className='flex w-full gap-6 '>
        <Link to={`/profile/${user.$id}`} className='flex flex-3 gap-3 '>
            <img src={user.imageUrl} alt=""  className='w-[60px] h-[60px] object-cover rounded-[50%]'/>
            <div className='flex flex-col justify-center '>
                <p className='truncate max-w-[150px]'>{user.name}</p>
                <p  className='truncate max-w-[150px]'>@{user.username}</p>
            </div>
        </Link>
        <div className='flex flex-1 items-center justify-end  min-w-[80px] cursor-pointer'>
        {isDeletingRelation || isFollowingUser ? (
                    <Loader />
                    ) : isFollowed ? (
                    <div onClick={handleFollow} className='bg-white text-black hover:bg-gray-200 font-bold p-2 rounded-[5px]'>Followed</div>
                    ) : (
                    <div onClick={handleFollow}  className='bg-white text-black hover:bg-gray-200 font-bold p-2 rounded-[5px]'>Follow</div>
                    )}
        </div>
        
    </div>
  )
}

export default RightBarUserCard