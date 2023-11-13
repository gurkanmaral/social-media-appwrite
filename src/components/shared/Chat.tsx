
import React from 'react'
import { Models } from 'appwrite'

type SelectedUserState = {
  id: string;
  imageUrl: string;
  name: string;
};

type ChatProps = {
  user: Models.Document;
  setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUserState>>;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  selectedUser: SelectedUserState;
  
}

const Chat = ({user,setSelectedUser,setSelectedPage,selectedUser}:ChatProps) => {


  return (
    <div className= ' flex flex-col gap-4  ' 
    onClick={()=>{setSelectedUser({id: user.$id,imageUrl: user.imageUrl,name: user.name,}), setSelectedPage("chat")} } > 
      <div className={`flex  gap-2 items-center hover:bg-dark-3 p-1 rounded-[5px] cursor-pointer ${selectedUser.id === user.$id  ? 'bg-dark-4' : ''} `}>
      <img src={user.imageUrl}
      className='w-[50px] h-[50px] rounded-full '
      alt="" />
        <p className='font-bold ' >{user.name}</p>
      </div>
 </div>
  )
}

export default Chat