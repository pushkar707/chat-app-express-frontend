import React from 'react'

function MessageCard() {
  return (
    <div className="max-w-[40%] w-fit bg-white rounded-md p-2 self-end mb-1">
        <p className="text-xs text-slate-700 mb-1">Pushkar Banal</p> {/* Sender Name */}
        <p className="text-sm">This is the last Message from Pushar..</p> {/* Message */}
    </div>
  )
}

export default MessageCard