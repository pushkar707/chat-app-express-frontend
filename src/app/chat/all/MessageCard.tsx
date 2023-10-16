import React from 'react'

function MessageCard({message,user,time}:{message:string,user:any,time:string}) {
  return (
    <div className="max-w-[40%] w-fit bg-white rounded-md p-2 self-end mb-1">
        <p className="text-xs text-slate-700 mb-1">{user}</p> {/* Sender Name */}
        <p className="text-sm">{message}</p> {/* Message */}
    </div>
  )
}

export default MessageCard