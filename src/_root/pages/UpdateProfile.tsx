import UpdateUser from '@/components/forms/UpdateUser'
import Loader from '@/components/shared/Loader'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'
import React from 'react'
import { useParams } from 'react-router-dom'

const UpdateProfile = () => {

const {id} = useParams()

const{data:user,isPending} = useGetUserById(id ||'')

 if(isPending) return <Loader />


  return (
    <div className='flex flex-1'>
        <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
            <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
            <img src="/assets/images/update-user1.svg"
          width={36}
          height={36}
          alt="add" 
          className=''
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Update User</h2>
            </div>
            <UpdateUser
            user={user}
            />
        </div>
    </div>
  )
}

export default UpdateProfile