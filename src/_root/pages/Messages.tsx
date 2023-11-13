import Chat from '@/components/shared/Chat'
import Chatbox from '@/components/shared/Chatbox'
import {  useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { Loader } from 'lucide-react'
import {useState} from 'react'

type SelectedUserState = {
  id: string;
  imageUrl: string;
  name: string;
};

const Messages = () => {

  const {data:currentUser,isLoading} = useGetCurrentUser()
  const [selectedUser,setSelectedUser] = useState<SelectedUserState>({id: '', imageUrl:'',name:'  '})
  const [selectedPage,setSelectedPage] = useState<string>("menu")


 if(isLoading) {
  return (
    <Loader />
  )
 }

  return (

    <div className='flex flex-1  '>
        <div className='flex  items-center w-full  h-full max-w-5xl mx-auto '>
            <div style={{ flex: '1' }} className={`${selectedPage === "chat" ? "hidden md:flex " : ""} border-l-[1px]  border-dark-4 flex-col  h-full flex  overflow-x-auto  custom-scrollbar`}>
                <div className='sticky p-2 top-0  bg-black '>
                    <h2 className='h2-bold md:h3-bold'>Messages</h2>
                </div>
                <div className='w-full flex items-center justify-center mt-5'>
                <div className='p-1 px-4 flex bg-dark-4 rounded-[10px]  items-center  border hover:border-blue-400' >
                  <img src="/assets/icons/search.svg" className='w-5 h-5' alt="" />
                   <input type="text"
                   placeholder='Search Users'
                   className=' bg-transparent text-white outline-none border-none p-1 rounded-[5px]'
                   />
                </div>
                </div>
                <div className='flex  p-2 flex-col gap-3 mt-2 ' >
                {currentUser?.followedUsers?.map((user:Models.Document) => (  
                    <Chat 
                   key={user.$id}
                    user={user.followers}
                  setSelectedUser={setSelectedUser}
                  setSelectedPage={setSelectedPage}
                  selectedUser={selectedUser}
                    />
                  
              ))}    
                </div>
                
            </div>
            <div style={{ flex: '2' }} className={`${selectedPage === "menu" ? 'hidden' : ''} md:flex  flex-col h-full `}>
            <Chatbox
                      currentUser={currentUser}
                      selectedUser={selectedUser}
                      setSelectedUser={setSelectedUser}
                      setSelectedPage={setSelectedPage}
                      />
            </div>
        </div>
    </div>
    
  )
}

export default Messages