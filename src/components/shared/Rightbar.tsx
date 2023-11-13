import { useGetCurrentUser, useRightBarUsers } from '@/lib/react-query/queriesAndMutations'

import RightBarUserCard from './RightBarUserCard'
import Loader from './Loader'




const Rightbar = () => {

  const {data:rightbarUsers,isPending} = useRightBarUsers()
  const {data:currentUser} = useGetCurrentUser()

  console.log(rightbarUsers)

  const filteredUsers = rightbarUsers?.documents?.filter((item)=> item.$id !== currentUser?.$id)

 
  return (
    <div className='hidden lg:flex min-w-[270px] p-4'>
      <div className=' flex flex-col items-center gap-10 overflow-scroll custom-scrollbar py-5 px-5 md:px-8 lg:p-14'>
        <div className='flex flex-col w-full justify-start '>
          <h2 className='h3-bold md:h2-bold text-left w-full'>
              Who to follow</h2>
        </div>
         <div className='w-full flex gap-8 flex-col '> 
          {isPending ? (
            <Loader />
          ) : 
          filteredUsers?.map((user)=>(
            <RightBarUserCard 
            key={user.$id}
            user={user}
            currentUser={currentUser}
            />
          ))}
          </div>
      </div>
       
      
      
    

    </div>
  )
}

export default Rightbar