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
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
  


function Explore() {
    
    const [posts, setPosts]= useState<Posts[]>([])
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    

    useEffect(()=>{
        
   
            ;(
              async() => {
                setLoading(true)
                let res;
                   res = await axios.get('/api/blog/get-all-blogs')
                
                setPosts(res.data.posts)
                console.log(res.data)
               
                setLoading(false)
              }
            )();
            
        },[])

        let handleSearch = async () => {
            try {
              console.log(searchText)
              setLoading(true)
            let res = await axios.get(`/api/blog/get-all-blogs?search=${searchText}`)
            setPosts(res.data.posts)
            console.log(res.data)
            setSearchText("")

            setLoading(false)
            } catch (error) {
              
            }
        }

  return (
<div>
  {
    loading ? <h1>Loading...</h1>:
    <div className='w-full h-full flex  flex-col  items-center  '>
      
    <div className="relative flex w-full  gap-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value) }
                placeholder="Search blogs..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            <Button onClick={() => handleSearch()}>Search</Button>
            </div>
    
    <div className='bg-black h-0.5 w-full my-4'></div>
    <div className='w-full gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
    {
        posts.map((post) => (
            <Card key={post.id}>
  <CardHeader>
    <CardTitle>{post.title}</CardTitle>
    <CardDescription className='truncate overflow-hidden '>{post.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <img src={post.image} alt={post.title} />
  </CardContent>
  <CardFooter>
    <Button onClick={() => router.push(`/explore/${post.id}`)} className='w-full bottom-0'>Explore</Button>
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

export default Explore