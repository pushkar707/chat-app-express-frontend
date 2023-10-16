"use client"

import getCookieValue from "@/app/utils/getCookieValue"
import Image from "next/image"
import {MouseEvent} from "react"

function ChatCard({user,chat,setMessages}:{user:{name:string,username:string,email:string},chat:{chats:any[]} , setMessages: Function}) {
  const {name,username,email} = user  
  const connectChats = async(event: MouseEvent<HTMLDivElement>) => {
    const res = await fetch("http://localhost:8000/connect",{
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({userId: getCookieValue("userId"),username})
    })

    const data = await res.json()
    console.log(data);    
  }

  const openChats = (event: MouseEvent<HTMLDivElement>) => {
    if(!chat.chats.length){
      connectChats(event)
    }
    setMessages(chat.chats)
  }


  return (
    <div className="p-4 border-b border-b-slate-500 border-opacity-40 flex items-center cursor-pointer" onClick={openChats}>
        <Image className="mr-2" src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" alt="" width="55" height="55" />
        <div>
            <p className="text-sm mb-1">{name}</p>
            {chat.chats.length ? <p className="text-xs">{chat.chats[0].message}</p> : ""}
        </div>
    </div>
  )
}

export default ChatCard