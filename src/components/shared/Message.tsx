import { multiFormatDateString } from '@/lib/utils'
import { Models } from 'appwrite'
import React from 'react'

type MessageProps = {
  item:Models.Document;
  currentUser:string;
}
const Message = ({item,currentUser}:MessageProps) => {
    
  console.log(item)
  return (
    <div className={`flex  w-full  p-2   ${item.senderId.$id === currentUser ? 'justify-end '  : ''}`}>      
       <div className={` p-2 rounded-[5px]  ${item.senderId.$id === currentUser ? 'rounded-tr-[0px] '  : 'rounded-tl-[0px]'} max-w-[50%]  bg-blue-500`}>
        <p>{item.message}</p>       
        <p className='text-[12px] text-gray-300'>{multiFormatDateString(item.$createdAt)}</p> 
       </div>
    </div>
  )
}

export default Message