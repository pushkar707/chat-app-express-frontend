"use client";

import { redirect } from "next/navigation"
import { ChangeEvent , useEffect, useState } from "react"
import ChatCard from "./ChatCard"
import getCookieValue from "@/app/utils/getCookieValue";
import MessageCard from "./MessageCard";

export default function Page() {
    useEffect(() => {
        const userId = getCookieValue("userId")
        if(!userId){
            return redirect("/")
        }
    }, [])
    
    const [search, setSearch] = useState(false)
    const [searchResult, setSearchResult] = useState("")

    const searchUserName = async (e:ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value
        setSearch(true)

        !username.length && setSearch(false)
        
        if(username.length > 5){
            const response = await fetch("http://localhost:8000/username-check",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName:username})
            })


            const data : {exists: Boolean , username: string} = await response.json()
            console.log(data);
            
            if(data.exists){
                setSearchResult(data.username)
            }else{
                setSearchResult("")
            }
        }   
    }

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
                        <ChatCard/>
                    </div>}

                    {!search && <div>
                        <ChatCard/>
                        <ChatCard/>
                        <ChatCard/>
                    </div>}
                </div>
                {/* Right Chat */}
                <div className="flex-grow bg-slate-500 flex flex-col-reverse h-full">
                    {/* Type Message Here Input */}
                    <div className="relative mt-1 shadow-sm overflow-hidden">
                        <input type="text" name="price" id="price" className="w-full p-3 text-sm border-l border-slate-400 border-opacity-30 outline-none" placeholder="Enter your Message" />
                        <div className="absolute inset-y-0 right-[-1px] flex items-center">
                            <button className="text-sm border p-6 pl-4 bg-green-500 text-white">Send</button>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse p-3 pb-1">
                        <MessageCard/>
                    </div>
                </div>
            </div>
        </main>
    )
}