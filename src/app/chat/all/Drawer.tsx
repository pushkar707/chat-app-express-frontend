import React, { useEffect, useReducer , useState , useRef} from 'react'
import Image from "next/image"
import {ChangeEvent} from "react"
import {deleteFileFromS3, uploadFileToS3} from '@/app/utils/s3'
import AWSKeyToUrl from '@/app/utils/AWSKeyToUrl'

// enum CountActionKind {
//     INCREASE = 'INCREASE',
//     DECREASE = 'DECREASE',
//   }
  
//   // An interface for our actions
//   interface Action {
//     type: CountActionKind;
//     payload: number;
//   }
  
//   // An interface for our state
//   interface State {
//     count: number;
//   }

const defaultImage = "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"

function Drawer({setShowDrawer,showDrawer,currentUserId}:{setShowDrawer:Function,showDrawer:boolean, currentUserId: string}) {

    const [usingdefaultImage, setUsingdDefaultImage] = useState(false)
    function reducer(state:any, action: any) : any {
        const { type, payload } = action;
        
        switch (type) {
            case "SET_VALUES":
                if(action.user.imageUrl !== defaultImage ){
                    setUsingdDefaultImage(false)
                }else{
                    setUsingdDefaultImage(true)
                }

                return {...action.user}
                
            case "USERNAME_CHANGE":
                return {...state,username: action.username}

            case "REMOVE_IMAGE":
                setUsingdDefaultImage(true)
                return {...state,imageUrl:defaultImage}
            
            case "ADD_IMAGE":
                setUsingdDefaultImage(false)
                return {...state,imageUrl:action.imageUrl}
        }
    }
    const [user, dispatch] = useReducer(reducer, { id:"", imageUrl:"", name:"", username: "", email:"" });
    const [changeusername, setchangeusername] = useState(false)

    const getUserDetails = async () => {     
        if(currentUserId){
            const res = await fetch("process.env.NEXT_PUBLIC_API_DOMAIN/profile/"+currentUserId)
            const data = await res.json()    
            dispatch({type: "SET_VALUES", user:data.user})
        }
    }

    useEffect(() => {
      getUserDetails()
    }, [currentUserId])

    const usernameInputRef = useRef<HTMLInputElement | undefined>(null)
    const profileImageRef = useRef(null)

    useEffect(() => {
        if (changeusername && usernameInputRef.current) {
            usernameInputRef.current.focus();
          }
    }, [changeusername])

    const profileChangeRequest = async(body:{}) => {
        const res = await fetch("process.env.NEXT_PUBLIC_API_DOMAIN/profile/change",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        return data;
    } 

    const setUsernameDb = async() => {
        await profileChangeRequest({id:currentUserId,username:usernameInputRef.current?.value})
        setchangeusername(false)      
    }     
    
    
    const removeImageDb = async () => {
        if(window.confirm("Do you want to remove your profile image. You can add it later.")){            
            const data = await profileChangeRequest({id: currentUserId, imageUrl:defaultImage})
            // deleteFileFromS3()
            if(data.result){
                dispatch({type:"REMOVE_IMAGE"})
            }        
        }
    }

    const addImageDb = async(e:ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = e.target.files && e.target.files[0]

        if(file){
            const key = await uploadFileToS3(file)
            // @ts-ignore
            const imageUrl = AWSKeyToUrl(key)
            const data = await profileChangeRequest({id: currentUserId, imageUrl})
            if(data.result){
                dispatch({type:"ADD_IMAGE",imageUrl})
            }
        }
    }
    
  return (
    <div id="drawer-example" style={{ background: 'rgb(var(--background-start-rgb))' }} className={`py-[2vh] pl-[2vh] ${!showDrawer ? "-translate-x-full" : "translate-x-0"} fixed top-0 left-0 z-40 h-screen  overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800`}>
        <div className='bg-white p-3 relative h-full border border-slate-400 border-opacity-30 rounded-xl rounded-tr-none rounded-br-none'>
            <h5 id="drawer-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>Profile</h5>
            <button onClick={() => setShowDrawer(false)} type="button" data-drawer-hide="drawer-example" aria-controls="drawer-example" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close menu</span>
            </button>
                
            <div className='relative w-fit mb-3 mx-auto flex justify-center transition-all'>
                <Image ref={profileImageRef} src={user.imageUrl} width={200} height={200} className='border cursor-pointer rounded-full mx-auto block' alt=':'/>
                <div className='cursor-pointer w-[200px] h-[200px] transition-all rounded-full absolute bg-black opacity-0 hover:opacity-70 flex self-center flex-col  justify-between items-center'>
                    <label htmlFor="profileImageInput" className={`${usingdefaultImage && "!h-full"} cursor-pointer text-sm text-white h-[50%] w-full hover:scale-110 flex items-center justify-center`} >Add Image</label>
                    <input type="file" accept="image/*" className='hidden' id='profileImageInput' onChange={addImageDb}/>
                    {!usingdefaultImage ? <p className="text-sm text-white h-[50%] w-full hover:scale-110 flex items-center justify-center" onClick={removeImageDb}>Remove Image</p>: ""}
                </div>
            </div>
            <p className='text-base text-center'>{user.name}</p>

            <div className='mt-8'>
                <div className='relative'>
                    {/* @ts-ignore */}
                    <input ref={usernameInputRef} disabled={!changeusername} onChange={(e) => dispatch({type: "USERNAME_CHANGE", username:e.target.value})} type="text" value={user.username} name="price" id="price" autoComplete="false" className={`${changeusername ? "border" : "border-b"} w-full p-3 text-sm border-slate-400 border-opacity-30 outline-none`} placeholder="Change your username" />
                    <div className="cursor-pointer absolute inset-y-0 right-1 flex items-center overflow-hidden" onClick={() => setchangeusername(true)}>
                        {/* Search Icon */}
                        {!changeusername ? <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 24 24">
                            <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
                        </svg>: <img onClick={setUsernameDb} width="22" height="22" src="https://img.icons8.com/ios-glyphs/30/save--v1.png" alt="save--v1"/>}
                    </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Drawer