import { useAddChat, useGetUserChats } from '@/lib/react-query/queriesAndMutations'
import React, { useState } from 'react'
import Message from './Message'
import Loader from './Loader'
import { Models } from 'appwrite'

type SelectedUserState = {
  id: string;
  imageUrl: string;
  name: string;
};

type ChatBoxProps = {
  currentUser: Models.Document;
  setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUserState>>;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  selectedUser: SelectedUserState;
  
}

const Chatbox = ({currentUser,selectedUser,setSelectedUser,setSelectedPage}:ChatBoxProps) => {

  const {mutate:sendMessage,isPending:messageLoading} = useAddChat()
  const [message,setMessage] = useState("")

  const{data:messageData,isPending} = useGetUserChats(currentUser?.$id,selectedUser.id)


  console.log(messageData)
  

  const handleMessage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const senderId = currentUser?.$id;
      const receiverId = selectedUser.id;
      const messageValue = message;
    
      // Check if the message is not empty before sending
      if (messageValue && messageValue.trim() !== "") {
        sendMessage({ senderId, receiverId, message: messageValue });
        setMessage(""); // Clear the message input after sending
      }
    };

   
    if(!selectedUser){
        return null
    }
    
    

     
  return ( 
    <div className='flex flex-col  md:border-l border border-dark-4  h-full  '>
        <div  className='h-[94%] overflow-x-auto custom-scrollbar flex flex-col gap-3  '>
          <div  className='sticky top-0 bg-black p-2 flex items-center gap-4 bg-opacity-50 backdrop-blur-lg border-r-[1px] border-dark-4'>
           <img src="/assets/icons/left-arrow.svg" className='w-8 h-8 md:hidden'
           onClick={()=> {setSelectedPage("menu"),setSelectedUser({id: '', imageUrl:'',name: ''})}}
           alt="" />
           {selectedUser.id !== "" ? <img src={selectedUser.imageUrl} className='h-12 w-12 rounded-full' alt="" />   : ''}
           <p className='font-bold '>{selectedUser.name}</p>
          </div>
           {isPending ? <Loader /> : messageData?.documents.map((item)=>(
            <Message 
            item={item}
            key={item.$id}
            currentUser={currentUser}
            />
           ))}
        </div> 
            <div className='h-[6%] md:border border-dark-4 p-1 md:p-2'>
            <form onSubmit={(e)=>handleMessage(e)} className=' flex gap-2 items-center justify-center ' >
                      <input type="text"
                      placeholder='Start a new message'
                        value={message}                   
                      className='text-white p-2 bg-dark-2 outline-none border-none rounded-[5px] w-[80%] '
                      onChange={(e)=>setMessage(e.target.value)} />
                      <button type='submit' className='w-[20%] p-1 border rounded-[10px]'>
                          {messageLoading ? <Loader /> : 'Send'}
                      </button>
                  </form>
            </div>
    </div>
  )
}

export default Chatbox