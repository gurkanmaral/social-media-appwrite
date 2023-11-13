import { useGetCurrentUser, useGetUsersSavedPost } from '@/lib/react-query/queriesAndMutations'
import { formatDateString, multiFormatDateString } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Notification = () => {

    const {data:currentUser,isLoading} = useGetCurrentUser()
    console.log(currentUser)
    
   


   
const combinedNotifications = [];
// Add followed user notifications
if (currentUser?.followedUsers && Array.isArray(currentUser.followedUsers)) {
    currentUser.followedUsers.forEach((item) => {
      combinedNotifications.push({
        type: 'followed',
        name: item.followers.name,
        createdAt: item.$createdAt,
        imageUrl: item.followers.imageUrl,
        id:item.followers.$id,
        seen:false,
      });
    });
  }
  
  // Add liked post notifications if they exist
  if (currentUser?.posts && Array.isArray(currentUser.posts)) {
    currentUser.posts.forEach((post) => {
      if (Array.isArray(post?.likes)) {
        post.likes.forEach((item) => {
          if(item.$id === currentUser.$id){
              return
          }
          else{combinedNotifications.push({
            type: 'liked',
            name: item.name,
            postCaption: post?.caption,
            createdAt: post.$updatedAt,
            imageUrl:item?.imageUrl,
            id:post?.$id,
            seen:false,
          });}
        });
      }
    });
  }
  if(currentUser?.comments && Array.isArray(currentUser.comments)){
    currentUser.comments.forEach((comment)=>{
      if(Array.isArray(comment?.commentLikes)){
        comment.commentLikes.forEach((item)=>{
          if(item.username === currentUser.username){
            return
        }else{
          combinedNotifications.push({
              type: "comment",
              name:item.name,
              createdAt:comment?.$updatedAt,
              imageUrl:item?.imageUrl,
              id:comment.postId.$id,
              seen:false,
          })
        }
        })
      }
    })
  }
  combinedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  console.log(combinedNotifications)
  return (
    <div className='flex flex-1'>
        <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
                <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                            Notifications
                    </h2>
                </div>
                <div className='w-full gap-4    max-w-5xl flex flex-col py-7 px-5 md:px-7 '>
                {combinedNotifications?.map((notification, index) => (
                  <div key={index} className='flex items-center gap-4  py-7 px-5 text-[16px] bg-gradient-to-t from-dark-3 to-transparent  border border-dark-4 rounded-[20px]'>
                    {notification.type === "liked" ? <img src="/assets/icons/liked.svg" alt="" /> : notification.type === "followed" ? <img src="/assets/icons/people1.svg" /> :  <img src="/assets/icons/liked.svg" alt="" /> }
                    <Link to={`/profile/${notification.id}`}>
                      <img src={notification.imageUrl} alt="" 
                      className='w-12 h-12 rounded-full ' 
                      />
                    </Link>
                    <Link  to={notification.tpye ==="followed" ? `/profile/${notification.id}` : `/posts/${notification.id}`} className=''>
                     {notification.type === 'followed'
                    ? `${notification.name} followed you.` : notification.type === 'liked' ? <span> {notification.name} liked your post <span className='font-bold'>{notification.postCaption  && notification.postCaption}</span></span> 
                    : <span>{notification.name} liked your comment </span> }
                     </Link>
                     <p>
                      {multiFormatDateString(notification.createdAt)}
                     </p>
                  </div>
                ))}
                </div>
        </div>
    </div>
  )
}

export default Notification