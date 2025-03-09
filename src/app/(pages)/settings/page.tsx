'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { CircleUser } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { ApiError } from 'next/dist/server/api-utils'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Settings() {
    const router = useRouter()

    const {data, update} = useSession()
    const [formToggle, setFormToggle] = useState(false)
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
      
        if(data && data.user){
            console.log(data)
            setUsername(data?.user?.name!)
            setEmail(data.user.email!)
           }
       
    },[data])



    let handlePasswordChange = async () => {
        let formData = {}
        if(data && data.user){
             formData = {
                username: username || data?.user.name,
                newPassword: newPassword
                
            }
            console.log(formData)
           try {
            let res = await axios.post('/api/auth/change-password', formData)
           console.log(res.data.message)
            toast({
                title:"Success",
                description:res.data?.message
            })
            // setTimeout(() => {
            //     window.location.reload()
            // },1500)
           
            

           
           } catch (error:any ) {
            console.log(error.response.data.message)
            toast({
                title:error.response.data.message
            })
           }
        }
    }    

    let handleDetailsChange = async () => {
        if(data && data.user){
            let formData = {
                username:data.user.name,
                email:data.user.email,
                newUsername: username || data.user.name,
                newEmail:email || data.user.email
                
            }
            try {
                let res = await axios.post('/api/auth/change-auth-details', formData)
               console.log(res)
                toast({
                    title:"Success",
                    description:res.data?.message + " Please relogin your account"
                })
                signOut({callbackUrl:"/sign-in", redirect:false})
                setTimeout(() => {
                        router.push('/sign-in')
                       }, 2000)
                
            //    
               } catch (error:any ) {
                toast({
                    title:error.response.data.message
                })
               }
        }
    }

  return (
    data && data.user ? 
    <div className='w-full flex items-center justify-center'>
    <div className='min-w-96 p-4 flex flex-col items-center gap-3 rounded-lg     shadow-2xl  border bg-white/80'>
        <div>
        <CircleUser className="h-5 w-5" />
        </div>
       { formToggle ? 
          <>
        <Button onClick={() => {router.push('/forgot-password')} }>Change Password</Button>
          </>
        :
         <>
            <div className='w-full'>
            <Label className='font-semibold text-lg' htmlFor='username'>Username</Label>
            <Input id='username' onChange={(e) => setUsername(e.target.value)} value={username} placeholder='eg.username' />
        </div>
        <div className='w-full'>
        <Label className='font-semibold text-lg' htmlFor='email'>Email</Label>
            <Input id='email' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='eg.email' />
        </div>
        <div className='w-full'>
            <Button onClick={() => handleDetailsChange()} className='w-full font-semibold text-md'>Save details</Button>
        </div>
        <div>
            <p>change password? <span className='text-orange-400 hover:cursor-pointer' onClick={() => router.push('/forgot-password')}>Change Password</span></p>
        </div>
         </>
        }
        
    </div>
</div>
    : <div className='flex items-center justify-center'>
        <h1 className='text-xl text-red-400 font-bold'>Please login to access settings</h1>
    </div>
  )
}

export default Settings