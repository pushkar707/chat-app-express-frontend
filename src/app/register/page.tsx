"use client";

import {FormEvent,useState,ChangeEvent} from "react";

export default function Home() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    username: '',
  });

  const [error, setError] = useState({error:false,text:""})

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const checkUserName = async (e:ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target

    if(value.length > 5){
      setError({error:false,text:""})
      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN+'/username-check/'+value);
  
      const data = await response.json()
      if(data.exists){
        setError({error:true,text:"Username already in use"})
      }
    }else{
        setError({error:true,text:"Username must be more than 5 letters"})
    }
  }

  const saveUser = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const {password,cpassword,name,email,username} = formValues
    if(password !== cpassword){
        return setError({error:true,text:"Passwords must be same"})
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN+'/register', {
      method: 'POST',
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name,email,password,cpassword,username}), // Replace with your data
    });

    const data = await response.json()
    if(data.error){
      setError({error:true,text:data.error})
    }else{
      localStorage.setItem("signInToken",data.token)
      localStorage.setItem("userId",data.id)
     window.location.href = "/chat/all"
    } 
  }
  return (
    <main className="h-screen flex flex-col justify-center items-center px-5 py-5">
      <h3 className="text-center mb-4">Welcome to Chat App</h3>
      {/* Sign In Form */}
      <form className='w-full max-w-4xl bg-gray-50 h-fit p-8' onSubmit={saveUser} method="POST">
        <div className='mb-4'>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input value={formValues.name} onChange={handleChange} type="text" name="name" id="name" className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 text-sm" placeholder="Enter Your Name"/>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input value={formValues.username} onChange={(e) => {handleChange(e); checkUserName(e);}} type="text" name="username" id="username" className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 text-sm" placeholder="Enter Your Username"/>
          </div>
        </div>
        
        <div className='mb-4'>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input value={formValues.email} onChange={handleChange} type="email" name="email" id="email" className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 text-sm" placeholder="Enter Your Email"/>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input value={formValues.password} onChange={handleChange} type="password" name="password" id="password" className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 text-sm" placeholder="Enter Your Password"/>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor="cpassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input value={formValues.cpassword} onChange={handleChange} type="password" name="cpassword" id="cpassword" className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 text-sm" placeholder="Re-enter Your Password"/>
          </div>
        </div>

        {error.error && <p className="text-red-600 text-xs mb-4">{error.text}</p>}

        <button className='bg-green-600 text-white px-4 py-2 rounded-md mt-1 text-sm mb-4 block'>Register</button>
        <a href="/" className='text-xs text-blue-700 block mx-auto text-center w-full'>Already a User? Login</a>
      </form>
  </main>
  )
}