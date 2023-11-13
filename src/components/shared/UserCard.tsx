import { useAddRelation, useDeleteRelation, useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { Loader } from 'lucide-react'
import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'

type UserCardProps = {
    user: Models.Document
}


const UserCard = ({user}:UserCardProps) => {

    const [isFollowed,setIsFollowed] = useState(false)

    const {mutate:followUser,isPending:isFollowingUser} = useAddRelation()
    const {mutate:deleteRelation,isPending:isDeletingRelation} = useDeleteRelation()
    
    const {data:currentUser} = useGetCurrentUser()
    console.log(currentUser)
    console.log(user)

    
    const savedPostRecord = currentUser?.followerUsers.find(
        (record:Models.Document)=>record.followed.$id === user.$id)

        console.log(savedPostRecord)

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
    <div className=' bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full'>
        <div className='flex flex-between'>
            <div className='flex w-[200px] '>
               <Link to={`/profile/${user.$id}`} className='flex gap-3'>
                <img src={user.imageUrl}
                className='w-[50px] h-[50px] rounded-full'
                alt="" />
                <div className='flex flex-col'>
                    <h1 className='font-bold'>{user.name}</h1>
                    <p className='text-gray-400 text-[14px]'>@{user.username}</p>
                    <p>asdasdasdasdadas</p>
                </div>
               </Link>
            </div>
            <div className='flex cursor-pointer'
            onClick={handleFollow}
            >
               {isDeletingRelation || isFollowingUser ? (
                    <Loader />
                    ) : isFollowed ? (
                    <div className='bg-white text-black hover:bg-gray-200 font-bold p-2 rounded-[5px]'>Followed</div>
                    ) : (
                    <div  className='bg-white text-black hover:bg-gray-200 font-bold p-2 rounded-[5px]'>Follow</div>
                    )}
            </div>
        </div>

    </div>
  )
}

export default UserCard