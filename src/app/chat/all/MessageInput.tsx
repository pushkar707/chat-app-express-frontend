import React, { ChangeEvent, useState } from 'react'
import { MouseEvent } from "react"
import AWS from 'aws-sdk';
import uploadFileToS3 from '@/app/utils/uploadS3';

const MessageInput = ({ messageTyped, setMessageType, currentUserId, chatOpened, socket, setMessages, setMessageTyped }: any) => {

    const [fileSelectedName, setfileSelectedName] = useState<string>("")

    const sendMsg = async (event: MouseEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (fileSelectedName.length){
            // @ts-ignore
            const file = (document.getElementById("file-input") as HTMLInputElement).files[0]
            uploadFileToS3(file)
            setfileSelectedName("")
            return
        }

        if (messageTyped.length) {
            const response = await fetch("http://localhost:8000/message/send", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: currentUserId, message: messageTyped, reciever: chatOpened })
            })

            const data = await response.json()

            // Sockets
            socket.emit("chatMsg", { sender: currentUserId, reciever: chatOpened });
            // socket.emit("msg",messageTyped)

            // Setting UI to display the msg sent
            setMessages(data.chats)
            setMessageTyped("")
        }
    }

    const fileInput = (e: ChangeEvent<HTMLInputElement>) => {

        const selectedFile = e.target.files && e.target.files[0]

        if (selectedFile) {
            // Check file size (max size: 10MB)
            const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
            if (selectedFile.size > maxSizeInBytes) {
                e.target.value = '';
                return;
            } else {
                setfileSelectedName(selectedFile.name)
            }
        }
    }

    return (
        <form className="relative mt-1 shadow-sm" onSubmit={sendMsg}>
            {!fileSelectedName.length ? <input value={messageTyped} autoComplete="false" type="text" id="price" className="w-full p-3 pr-28 text-sm border-l border-slate-400 border-opacity-30 outline-none" placeholder="Enter your Message" onChange={(e) => setMessageTyped(e.target.value)} /> : <div className='w-full bg-white flex gap-3 p-3 pr-28 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z"></path>
            </svg>

            <p className='text-sm pr-1'>{fileSelectedName}</p>

            <svg onClick={() => setfileSelectedName("")} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto mr-2 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

                
                </div>}
            <div className="absolute inset-y-0 right-[-1px] flex items-center overflow-hidden">
                <label htmlFor="file-input" className="cursor-pointer">
                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" id="attachment"><g><path d="M18.8 85.1c-7.8-7.8-7.8-20.5 0-28.3L63.1 13c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8L38.6 76.7c-3.1 3.1-8.2 3.1-11.3 0-3.1-3.1-3.1-8.2 0-11.3l22.3-21.8c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8L30.2 68.2c-1.5 1.5-1.5 4.1 0 5.6 1.6 1.6 4.1 1.6 5.7 0L80.2 30c3.9-3.9 3.9-10.2 0-14.1-3.9-3.9-10.2-3.9-14.1 0L21.7 59.7c-6.2 6.2-6.2 16.4 0 22.6 6.3 6.2 16.4 6.2 22.6 0l38.3-37.8c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8L47.1 85.2c-7.8 7.7-20.4 7.8-28.3-.1z"></path></g><g><path fill="#00F" d="M664-510v1684h-1784V-510H664m8-8h-1800v1700H672V-518z"></path></g></svg>
                </label>
                <input type="file" id="file-input" className="hidden" onChange={fileInput} accept="image/*, video/*, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint" />
                <button className="text-sm border p-6 pl-4 bg-green-500 text-white">Send</button>
            </div>
        </form>
    )
}

export default MessageInput