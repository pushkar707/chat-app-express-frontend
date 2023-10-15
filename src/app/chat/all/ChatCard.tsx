"use client"

import Image from "next/image"

function ChatCard() {
  const fetchChats = () => {
    
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