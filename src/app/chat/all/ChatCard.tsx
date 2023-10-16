"use client"

import getCookieValue from "@/app/utils/getCookieValue"
import Image from "next/image"
import {MouseEvent} from "react"

function ChatCard({username}:{username:string}) {
  const fetchChats = async(event: MouseEvent<HTMLDivElement>) => {
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


  return (
    <div className="p-4 border-b border-b-slate-500 border-opacity-40 flex items-center cursor-pointer" onClick={fetchChats}>
        <Image className="mr-2" src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" alt="" width="55" height="55" />
        <div>
            <p className="text-sm mb-1">Pushkar Bansal</p>
            <p className="text-xs">This is the last Message from Pushar..</p>
        </div>
    </div>
  )
}

export default ChatCard