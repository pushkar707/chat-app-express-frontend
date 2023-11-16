"use client"

import getCookieValue from "@/app/utils/getCookieValue"
import Image from "next/image"
import {MouseEvent} from "react"

function ChatCard({user,chat,setMessages,setchatOpened,setchatOpenedName,setchatOpenedImageUrl}:{user:{name:string,username:string,email:string,_id:string,imageUrl:string},chat:{chats:any[]} , setMessages: Function , setchatOpened:Function , setchatOpenedName:Function , setchatOpenedImageUrl:Function}) {
  const {name,username,email,_id, imageUrl} = user  
  const connectChats = async(event: MouseEvent<HTMLDivElement>) => {
    const res = await fetch("process.env.NEXT_PUBLIC_API_DOMAIN/connect",{
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
      console.log("fsdfcersdcs");
      
      connectChats(event)
    }
    setMessages(chat.chats)
    setchatOpened(_id)
    setchatOpenedName(name)
    setchatOpenedImageUrl(imageUrl)
  }

  let cardCaption:string = ""

  if(chat.chats.length){
    if( chat.chats[0].message)
      cardCaption = chat.chats[0].message
    else{
      const keySplit: Array<string> =  chat.chats[0].awsFileKey.split(".")
      keySplit[keySplit.length - 1] = keySplit[keySplit.length - 1].slice(0,keySplit[keySplit.length-1].indexOf("1" || "2"))
      cardCaption = keySplit.join(".")
    }
  }


  return (
    <div className="p-4 border-b border-b-slate-500 border-opacity-40 flex items-center cursor-pointer" onClick={openChats}>
        <a href={imageUrl} target="_blank">
          <Image className="mr-2 border rounded-full" src={imageUrl} alt="" width="55" height="55" />
        </a>
        <div>
            <p className="text-sm mb-1">{name}</p>
            <p className="text-xs">{cardCaption}</p>
        </div>
    </div>
  )
}

export default ChatCard