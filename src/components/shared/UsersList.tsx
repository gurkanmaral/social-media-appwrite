import { Models } from 'appwrite'
import UserCard from './UserCard'
import { useUserContext } from '@/context/AuthContext'
import {  useGetCurrentUser, useGetRecentRelations } from '@/lib/react-query/queriesAndMutations'

type UsersListProps = {
    users?: Models.Document[]
}

const UsersList = ({users}:UsersListProps) => {
  
    const {user} = useUserContext()
    const {data:currentUser} = useGetCurrentUser()
    const filteredUser = users?.filter((userData) => userData.$id !== user.id);

    const filteredUsers = filteredUser?.filter((user) => {
      // Check if the user's accountId is not in currentUserFollowedUsers
      return !currentUser?.followedUsers.some((followedUser:any) => followedUser.accountId === user.accountId);
    });
    
    console.log(filteredUsers);
    
   console.log(currentUser)
    

    const {data} = useGetRecentRelations()
console.log(users)
    console.log(data)

  return (
    <div className='flex flex-col gap-4 w-full'>
        {filteredUser?.map((user)=>(
            <UserCard 
            key={user.$id}
            user={user}
            />
        ))}

    </div>
  )
}

export default UsersList