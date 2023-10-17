"use client";

import { redirect } from "next/navigation"
import { ChangeEvent , SetStateAction, useEffect, useState , MouseEvent } from "react"
import ChatCard from "./ChatCard"
import getCookieValue from "@/app/utils/getCookieValue";
import MessageCard from "./MessageCard";
import Image from "next/image";

// Socket io imports
import { socket } from '../../utils/socket';

export default function Page() {
    useEffect(() => {
        const userId = getCookieValue("userId")
        if(!userId){
            return redirect("/")
        }
        getChats(userId)
        setcurrentUserId(userId)
    }, [])

    const [search, setSearch] = useState(false) // to check if user is currntly searching or not
    const [searchResult, setSearchResult] = useState<any[]>([]) // Search results
    const [people, setPeople] = useState<any[]>([]) // People with whom user has chats
    const [messages, setMessages] = useState<any[]>([]) // FOR SINGLE CHAT
    const [currentUserId, setcurrentUserId] = useState<string>("") // Current user id
    const [messageTyped, setMessageTyped] = useState<string>("") // Message types by sender
    const [chatOpened, setchatOpened] = useState<string>("") // Id of user whose chat is opened
    const [chatOpenedName, setchatOpenedName] = useState<string>("") //Name of user whose chat is opened

    // To implement search
    const searchUserName = async (e:ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value
        setSearch(true)
        setSearchResult([])

        !username.length && setSearch(false)
        
        if(username.length > 5){
            const response = await fetch("http://localhost:8000/username-search/"+username)

            const data : {exists: Boolean , users: [{_id : string,name:string,username:string}]} = await response.json()            

            if(data.exists){
                let toReturnUser: {}[] = []
                data.users.map(user => {
                    if(user._id == currentUserId){
                        return
                    }
                    let checkUserChats = false
                    people.map(person => {
                        if(person.user._id == user._id){
                            toReturnUser.push({user,chat:person.chat})
                            checkUserChats = true
                        }
                    })
                    !checkUserChats && toReturnUser.push({user, chat: {chats: []}})
                })
                console.log(toReturnUser);                
                setSearchResult(toReturnUser)                
            }else{
                setSearchResult([])
            }
        }   
    }

    // to get all the people user has chats with
    const getChats = async(id:string) => {
        const res = await fetch("http://localhost:8000/chats/"+id)
        const data = await res.json()
        setPeople(data.people)

        // To set first Person's chat on start
        if(data.people.length){
            setMessages(data.people[0].chat.chats)
            setchatOpened(data.people[0].user._id)
            setchatOpenedName(data.people[0].user.name)
        }
    }

    // To send Message
    const sendMsg = async (event: MouseEvent<HTMLFormElement>) => {
        event.preventDefault()
        const response = await fetch("http://localhost:8000/message/send",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sender:currentUserId,message:messageTyped,reciever:chatOpened})
        })

        const data = await response.json()

        // Sockets
        socket.emit("chatMsg",{sender:currentUserId,reciever:chatOpened});
        // socket.emit("msg",messageTyped)

        // Setting UI to display the msg sent
        setMessages(data.chats)
        setMessageTyped("")
    }

    // socket.on("msg",(data)=> console.log(data));

    socket.on(currentUserId,async(socketData) => {
        console.log(socketData);      
        
        const res1 = await fetch(`http://localhost:8000/chats/${currentUserId}`)
        const data1 = await res1.json()
        setPeople(data1.people);
        
        setchatOpened(socketData.sender)
        const res = await fetch(`http://localhost:8000/message/${socketData.sender}/${currentUserId}`)
        const data = await res.json()
        setchatOpenedName(data.name)
        setMessages(data.chats)
    })

    return (
        <main className="p-[2vh] w-screen min-h-screen" style={{ background: 'rgb(var(--background-start-rgb))' }}>
            <div className="w-full h-[96vh] flex border border-slate-400 border-opacity-30 rounded-xl overflow-hidden">
                {/* Left chats option */}
                <div className="w-full sm:w-[50%] md:w-[40%] xl:w-[30%] bg-slate-50">
                    <div className="relative mt-1 overflow-hidden w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            {/* Hamburger Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>
                        <input type="text" onChange={searchUserName} name="price" id="price" autoComplete="false" className="pl-14 w-full p-3 text-sm border-l border-slate-400 border-opacity-30 outline-none" placeholder="Search for People" />
                        <div className="absolute inset-y-0 right-4 flex items-center">
                            {/* Search Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {search && <div className="bg-slate-700 text-xs text-center w-100 py-0.5 text-white">Search Results</div>}

                    {searchResult && <div>
                        {searchResult.map(user => {
                            return (
                                <ChatCard {...user}  setMessages={setMessages} setchatOpened={setchatOpened} setchatOpenedName={setchatOpenedName}/>
                            )
                        })}
                    </div>}

                    {!search && <div>
                        {people.map(user => {
                            return (
                                <ChatCard {...user} setMessages={setMessages} setchatOpened={setchatOpened} setchatOpenedName={setchatOpenedName} />
                            )
                        })}
                    </div>}
                </div>
                {/* Right Chat */}
                <div className="flex-grow bg-slate-500 flex flex-col-reverse relative">
                    {/* Type Message Here Input */}
                    {chatOpened ? <form className="relative mt-1 shadow-sm" onSubmit={sendMsg}>
                        <input value={messageTyped} autoComplete="false" type="text" id="price" className="w-full p-3 text-sm border-l border-slate-400 border-opacity-30 outline-none" placeholder="Enter your Message" onChange={(e) => setMessageTyped(e.target.value)} />
                        <div className="absolute inset-y-0 right-[-1px] flex items-center overflow-hidden">
                            <button className="text-sm border p-6 pl-4 bg-green-500 text-white">Send</button>
                        </div>
                    </form> : ""}
                    <div className="flex flex-col-reverse p-3 pb-1 overflow-y-scroll no-scrollbar mt-14">
                        {messages.map(message => {
                            return <MessageCard {...message}/>
                        })}
                    </div>
                    {/* Chat descrption */}
                    <div className="absolute h-14 w-full bg-white top-0 px-5 py-3 flex items-center">
                        <Image className="mr-2" src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" alt="" width="30" height="30" />
                        <p className="text-sm mx-1">{chatOpenedName}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}