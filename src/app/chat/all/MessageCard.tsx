import getCookieValue from '@/app/utils/getCookieValue'
import React, { useState } from 'react'
import Image from "next/image";

function MessageCard({message,sender,time,senderId,awsFileKey,awsFileType}:{message:string,sender:any,time:string,senderId:string,awsFileKey:string,awsFileType:string}) { 
  let senderMessage = false
  const userId = getCookieValue("userId")
  if(userId == senderId){
    senderMessage = true
  }
  let link=""

  if(awsFileKey){
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
    const bucketregion = process.env.NEXT_PUBLIC_AWS_REGION
    link = `https://${bucketName}.s3.${bucketregion}.amazonaws.com/${awsFileKey}`
    console.log(link);    
  }

  let cardCaption: string= ""

  if(awsFileKey){
    const keySplit: Array<string> =  awsFileKey.split(".")
    keySplit[keySplit.length - 1] = keySplit[keySplit.length - 1].slice(0,keySplit[keySplit.length-1].indexOf("1"))
    cardCaption = keySplit.join(".")
  }
  
  return (
    <div className={`max-w-[40%] w-fit bg-white rounded-md p-2 ${senderMessage && 'self-end'} mb-1`}>
        <p className="text-xs text-slate-700 mb-1">{sender}</p> {/* Sender Name */}
         {/* File */}
         {awsFileKey && ( awsFileType.startsWith("image/") ? <Image src={link} alt='messageFile' width={320} height={200} /> : awsFileType.startsWith("video/") ?  <video width="320" height="240" controls>
          <source src={link} type="video/mp4" />
         </video> : <a href={link} download={awsFileKey} target='_blank'>
          <div className='py-4 flex gap-5 items-center'>
            <p className='text-sm '>{cardCaption}</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>

          </div>
         </a> )}
       <div className="flex items-end justify-between overflow-hidden w-100">
            <img className='' src={""} alt="" />
            <p className="text-sm mr-auto" style={{overflowWrap:"anywhere"}}>{message}</p> {/* Message */}
            <p className='text-xs mb-[-2px] text-right text-slate-500 ml-4'>{time.slice(16,21)}</p>
       </div>
    </div>
  )
}

export default MessageCard