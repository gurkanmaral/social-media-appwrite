import Loader from '@/components/shared/Loader'
import ProfilePostsCard from '@/components/shared/ProfilePostsCard'
import { Button } from '@/components/ui/button'
import { useAddRelation, useDeleteRelation, useGetCurrentUser, useGetUserById, useGetUserPosts } from '@/lib/react-query/queriesAndMutations'
import { getMonthAndYear } from '@/lib/utils'
import { Models } from 'appwrite'
import {useEffect, useState} from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Profile = () => {
  const {ref,inView} = useInView();
  const {id} = useParams()
  const {data:currentUser} = useGetCurrentUser()
  const [isFollowed,setIsFollowed] = useState(false)
  const {data:user,isLoading} = useGetUserById(id ||"")
  const {data:userPosts,fetchNextPage,hasNextPage,isPending:isPostsLoading} = useGetUserPosts(id || "")
  const [open,setOpen] = useState(false) 
  const [selectedFollow,setSelectedFollow] = useState("")
  const [hoverFollowing, setHoverFollowing] = useState(null)
  const [hoverProfile,setHoverProfile] = useState(false)

  useEffect(()=>{
    if(inView ) fetchNextPage();
  },[inView])

  const {mutate:followUser} = useAddRelation()
  const {mutate:deleteRelation} = useDeleteRelation()
  
  const followedUser = currentUser?.followerUsers.find(
    (record:Models.Document)=>record.followed.$id === user?.$id)

    const isUserFollowingYou = user?.followerUsers.find((item:any)=> item.followed.$id === currentUser?.$id)



    useEffect(()=>{
        setIsFollowed(followedUser ? true : false)
    },[currentUser,followedUser])

  const handleFollow = () =>{

    if(followedUser){
        setIsFollowed(false)
        deleteRelation(followedUser.$id)
    }else{
        setIsFollowed(true)
        followUser({followerId:currentUser?.$id || "", followedId:user?.$id || ""} )
    }
   
}
  const navigate = useNavigate()



if(isLoading){
  return (
    <Loader />
  )
}
 
  return (
    <div className=' gap-4 items-center  flex-col flex flex-1  py-10 px-5 md:p-14 custom-scrollbar overflow-scroll'>
      <div className="hidden md:flex max-w-5xl w-full ">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/left-arrow.svg"}
            alt="back"
            width={25}
            height={25}
          />       
        </Button>
      </div>
      <div className='w-full bg-dark-2    max-w-5xl rounded-[10px]  border-dark-4 flex flex-col gap-6 md:gap-4 py-5 px-7 md:px-5'>
        <h2 className='h3-bold md:h2-bold'>
            {currentUser?.$id === id ? 'My Profile' : `${user?.name} Profile`}
        </h2>
        <div className='relative flex flex-col'>
          {user?.bgImageUrl ?<img src={user?.bgImageUrl} className='w-full h-[300px] object-cover' alt="" /> 
          : <div className='bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 h-[300px] w-full'></div>}
          <div className='absolute left-[20px] bottom-[-100px] w-full max-w-5xl flex   justify-between items-end'>     
            <img src={user?.imageUrl} alt=""
            className=" bg-dark-1 h-[200px] w-[200px] rounded-full object-cover border-[4px] border-black border-solid "
            />   
          {currentUser?.$id === id ?
          <div className='px-5 pb-10'>
            <Button className='border-[0.5px] border-white  rounded-[10px]'>
            <Link to={`/update-profile/${id}`} className=''>
            Edit Profile
            </Link>
          </Button>  
          </div> : 
          <div className='px-5 pb-10 ' >
           {isFollowed 
           ? 
           <Button className='border-[0.5px] border-white hover:border-red hover:text-red  rounded-[10px]'
           onMouseEnter={()=>setHoverProfile(true)}
           onMouseLeave={()=> setHoverProfile(false)}
           onClick={handleFollow}
           >     
              {hoverProfile ? 'Unfollow' : 'Following'}
           </Button>   
           : 
           <Button className='border-[0.5px] bg-white text-black  rounded-[10px]'
           onClick={handleFollow}
           >      
           Follow
           </Button> }
          </div>}
        </div>
        </div>  
        <div className='flex flex-col pt-20   px-5'>
          <h2 className='capitalize h3-bold md:h2-bold'>{user?.name}</h2>
          <p className='mt-[-5px] text-gray-500 tracking-wide'>@{user?.username} {currentUser?.$id !== user?.$id && <span className='text-[12px]  bg-dark-4 p-1 rounded-[5px]'>{isUserFollowingYou ? 'Follows you' : ''}</span> }</p>
          <p className=' mt-4 overflow-hidden break-words '>
            {user?.bio}
          </p>
          <div className='flex gap-4 mt-4'>
            <span className='cursor-pointer'onClick={()=>{ setSelectedFollow("Followers"), setOpen(true)}} >{user?.followedUsers?.length} <span className='text-gray-600'>Followers</span></span>
            <span className='cursor-pointer' onClick={()=>{ setSelectedFollow("Following"), setOpen(true)}}>{user?.followerUsers?.length} <span className='text-gray-600'>Following</span></span>
          </div>
          <div className='mt-2 flex'>
              Joined {getMonthAndYear(user?.$createdAt || "")}
          </div>
        </div>
        {/* <div className='flex flex-col  px-4 w-full '>
          <div className='flex  gap-4 mt-2 items-center justify-center'>
           <div
              className={`  cursor-pointer w-1/3 ${selected === 'Posts' ? 'border-b-2 border-white' : 'text-gray-500'}`}
              onClick={() => handleTabClick('Posts')}>
              <p>Posts</p>
           </div>
            <div
              className={`cursor-pointer w-1/3 ${selected === 'Comments' ? 'border-b-2 border-white' : 'text-gray-500'}`}
              onClick={() => handleTabClick('Comments')}>
              <p>Comments</p>
            </div>
            <div
              className={`cursor-pointer w-1/3 ${selected === 'Likes' ? 'border-b-2 border-white' : 'text-gray-500'}`}
              onClick={() => handleTabClick('Likes')}>
              <p>Likes</p>
            </div>
          </div>
        </div> */}
      </div>
      <div className='  max-w-5xl flex w-full flex-col gap-4'>
      {
        isPostsLoading && !userPosts ? (
          <Loader />
      ) : userPosts?.pages.length === 1 ? (
          <div>
              <p>No posts</p>
          </div>
      ):
      userPosts?.pages.map((page, pageIndex) => (
                    <div key={`page-${pageIndex}`} className='flex flex-col gap-4'>
                      {page?.documents.map((post) => (
                       <ProfilePostsCard
                       post={post}
                       key={post.$id}
               
                      />
                      ))}
                    </div>
                  ))}
        </div>
        {open && <div className='absolute top-0 left-0 w-full h-full bg-black  bg-opacity-75 z-20 flex items-center justify-center   '>
          <div className=' gap-2 border flex flex-col border-dark-4 rounded-[5px] bg-black w-full md:w-1/3  h-2/3 md:h-1/2 p-1'>
              <div className='flex p-1 justify-between items-center w-full '>  
                  <div className=''>
                   <h2 className='h2-bold md:h3-bold'>{selectedFollow}</h2>
                  </div>
                  <div onClick={()=>setOpen(false)} className=' rounded-[5px] py-2  cursor-pointer'>
                   <img src="/assets/icons/close.svg" className='w-8 h-8 ' alt="" />
                  </div>
              </div>
              <hr className="border w-full  border-dark-4/80 " />  
              <div className='w-full  h-full overflow-x-auto custom-scrollbar pt-2 flex flex-col gap-4'>
                    {selectedFollow === "Followers" ?  
                    user?.followedUsers?.map((user:any)=>(
                      <Link onClick={()=>setOpen(false)} to={`/profile/${user?.followers?.$id}`} key={user.$id}                   
                      className=' flex justify-between  w-full hover:bg-dark-3 items-start gap-3 p-2 '>
                         <div className='flex  max-w-[80%] gap-2'>
                          <img src={user.followers.imageUrl} className='w-10 h-10 rounded-full' alt="" />
                          <div className='flex w-full   flex-col'>
                              <p className='font-bold'>{user?.followers?.name} </p>  
                              <p className='text-[14px] text-gray-400 mt-[-4px]'>@{user?.followers?.username}</p>
                              <div className=' break-words'>
                              <p>{user.followers.bio} </p> 
                              </div>                                     
                          </div>
                         </div>
                          {currentUser?.$id !== user.followers.$id &&  <div
                            className='border flex items-center justify-center p-2 rounded-[5px]  hover:border-red hover:text-red'
                            >
                           <p>Follow </p>
                        </div>      
                       }                       
                      </Link>
                    )) : (
                      user?.followerUsers?.map((item:any)=>(
                        <Link onClick={()=>setOpen(false)} to={`/profile/${item.followed.$id}`} key={item.$id} 
                      className=' flex justify-between  w-full hover:bg-dark-3 items-start gap-3 p-2 '>
                         <div className='flex  max-w-[80%] gap-2'>
                          <img src={item.followed.imageUrl} className='w-10 h-10 rounded-full' alt="" />
                          <div className='flex w-full   flex-col'>
                              <p className='font-bold'>{item.followed.name} </p>  
                              <p className='text-[14px] text-gray-400 mt-[-4px]'>@{item.followed.username}</p>
                              <div className=' break-words'>
                              <p>{item.followed.bio} </p> 
                              </div>                                     
                          </div>
                         </div>
                         {currentUser?.$id !== item.followed.$id && 
                         <div
                           className='border flex items-center justify-center p-2 rounded-[5px]  hover:border-red hover:text-red'
                            onMouseEnter={() => setHoverFollowing(item)}
                            onMouseLeave={() => setHoverFollowing(null)} >
                           <p>{hoverFollowing === item ? 'Unfollow' : 'Following'}</p>
                        </div>             }
                      </Link>
                      ))
                    )}
              </div>
          </div>  
        </div>}
        {hasNextPage &&  (
            <div ref={ref} className='mt-10'>
                <Loader />
            </div>
          )}  
    </div>
  )
}

export default Profile