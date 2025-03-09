'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Posts } from '@/app/page';
import { useRouter } from 'next/navigation';
import { SearchContext } from '@/components/SearchContext';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

export interface Response {
  message: string
  data: Details[]
}

export interface Details {
  id:number
  postId: number
  posts: PostsDetails
  userId: number
}

export interface PostsDetails {
  id: number
  title: string
  description: string
  image: string
  userId: number
  created_at: string
  updated_at: string
}
  

function Favourites() {
    
    const [posts, setPosts]= useState<Details[]>([])
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const {data} = useSession()


    useEffect(()=>{
        ;(
            async ( )=> {
              setLoading(true)
            
            if(data && data.user){
            
            let res = await axios.get(`api/blog/favourites?userId=${data?.user.id}`)
            setPosts(res.data.data)
            console.log(res.data.data)
            }              
              setLoading(false)
            }
        )();
        },[data])


         const handleRemove = async (id :number )=>{
          try {
            console.log(id)
            let res = await axios.delete(`/api/blog/favourites?id=${id}`)
            console.log(res.data)
            toast({
              description:res.data.message
            })
          } catch (error) {
            console.log(error)
          }
        }

// console.log(posts)
  return (
<div>
  {
    loading ? <h1>Loading...</h1>:
    <div className='w-full h-full flex  flex-col  items-center my-4 '>
    <div className='text-4xl mb-6 font-bold text-orange-500 text-center'>
{
  posts && posts.length > 0 ?
  <h1>Favourites : All your favourite blogs</h1>
  :
  <h1>Favourites : Add to see favourite blogs</h1>

}
    </div>
    <div className='w-full gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
    {
        posts.map((post) => (
            <Card key={post.posts.id}>
  <CardHeader>
    <CardTitle>{post.posts.title}</CardTitle>
    <CardDescription className='truncate overflow-hidden '>{post.posts.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <img src={post.posts.image} alt={post.posts.title} />
  </CardContent>
  <CardFooter className='flex flex-col gap-2'>
    <Button onClick={() => router.push(`/explore/${post.posts.id}`)} className='w-full bottom-0'>Explore</Button>
    <Button onClick={() => handleRemove(post.id)} className='w-full bottom-0'>Remove from Favourite</Button>
  </CardFooter>
</Card>
        ))
    }


    </div>
</div>
  }
</div>

  )
}

export default Favourites
