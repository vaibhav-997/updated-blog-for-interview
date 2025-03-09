'use client'
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Posts } from '@/app/page';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleUserIcon, MoreHorizontal, WineOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteAlert from '@/components/Delete-alert';


export interface Post extends Posts {
  User: {
    username: string
  }
}

export interface Comments {
  comment:string
  postId:number;
  userId:number;
  id:number;
}

function PostById({ params }: { params: { id: string } }) {

  const id = params.id
  const { data } = useSession()
  const router = useRouter()
  const [post, setPost] = useState<Post>()
  const [comment, setComment] = useState("")
  const [fetchedComment, setFetchedComment] = useState<Comments[]>([])
  const [editedComment, setEditedComment] = useState("")
  const  [edit, setEdit] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  useEffect(() => {
    ; (
      async () => {
        try {
          let res = await axios.get(`/api/blog/get-post-by-id?id=${id}`)
          console.log(res.data)
          setPost(res.data.post)
          res = await axios.get(`/api/blog/get-all-comments?id=${id}`)
          console.log(res.data)
          setFetchedComment(res.data.data)
          res = await axios.get(`/api/blog/get-favourite-post-by-id?id=${id}`)
          console.log(res.data)
          setIsFavourite(res.data.status)
        } catch (error) {
          console.log(error)
        }
      }
    )();
  }, [id])


   


  let handleFavourites = async () => {
    try {
      if (data && data.user) {
        let res = await axios.post(`/api/blog/favourites?id=${id}&userId=${data?.user.id}`)
        // console.log(res.data)
        toast({
          description: res.data.message,
          variant: "default"
        })
      } else {
        router.push('/sign-in ')
      }


    } catch (error) {
      console.log(error)
    }
  }

  let handleComment = async () => {
    try {
      if (data && data.user) {
        let res = await axios.post(`/api/blog/add-comment?id=${id}`,{comment})
        console.log(res)
        toast({
          description: res.data.message,
          variant: "destructive"
        })
        window.location.reload()
      } else {
        router.push('/sign-in ')
      }


    } catch (error) {
      console.log(error)
    }
  }

  let handleCommentUpdate = async(id:number) => {
 try {
     let res = await axios.patch(`/api/blog/update-comment?id=${id}`,{comment:editedComment})
     console.log(res.data)
     toast({
      description:res.data.message
     })
     window.location.reload()
 } catch (error) {
  console.log(error)
 }finally{
  setEdit(false)
 }
  }

  const handleRemove = async()=>{
    try {
      console.log(id)
      
      // window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(post)
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='w-full flex items-center justify-center gap-2 flex-col space-y-4 '>
        <div className='flex items-center justify-stretch w-full'>
          <div className='text-2xl flex flex-col gap-1 w-full text-orange-500 font-bold'>
            <h1>{ post?.title }</h1>
            <p className='text-lg underline-   '>By: { post?.User.username }</p>
          </div>
          <div className='bg-blue-400k flex items-center justify-end '>
    {
      isFavourite ? 
      <Button>Post is in favourites</Button>

      : 
      <Button onClick={ () => handleFavourites() }>Add to favourites</Button>

    }
          </div>
        </div>
        <div className='bg-black h-0.5 w-full'></div>
        <div>
          <img className='w-full h-64' src={ post?.image } alt={ post?.title } />
        </div>
        <div>
          { post?.description }
        </div>
        <div className='h-0.5 bg-black w-full'></div>
        <div className='w-full flex flex-col gap-2 justify-start'>
          <Label htmlFor='comment' className='font-bold text-xl' >Add Comments</Label>
          <div className='flex items-center justify-evenly gap-2'>
       
              <Input id='comment' value={comment} onChange={(e) => setComment(e.target.value) } placeholder='add comment' />
              <Button onClick={() => handleComment()}>Add Comment</Button>
            
          </div>
        </div>
        <div className='w-full py-2 flex flex-col  gap-4 items-center justify-evenly rounded border px-2 text-lg'>
          {
            fetchedComment && fetchedComment.length > 0 ?
           fetchedComment.map((commentData) => (
            <div key={commentData.id} className='w-full flex shadow-sm border-b-2  items-center justify-evenly'> <div  className='flex items-center justify-start w-full gap-3'>
            <CircleUserIcon className='h-6 w-6 ' />
             {
              edit ? 
              <div  className='flex justify-evenly gap-2 items-center w-full'>
                {
                data?.user.id != commentData.userId && 
                <p>{commentData.comment}</p> 
                }
               {
                data?.user.id == commentData.userId && 
                <>
                <Input  value={editedComment} onChange={(e)=> setEditedComment(e.target.value)} />
                <Button onClick={() => handleCommentUpdate(commentData.id)}>Update</Button></>
               }
              </div>
              :<p>{commentData.comment}</p> 
             }
            
            </div>
            {
              commentData.userId == data?.user.id ?
               <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={ () =>{ 
                  setEdit(true)
                  setEditedComment(commentData.comment)
                } }>Edit</DropdownMenuItem>
                <div className="w-full flex items-center justify-start p-2 text-sm hover:bg-black/5 ">
                <DeleteAlert title={commentData.comment} id={String(commentData.id) } comment={true}/>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>:<></>
            }
            </div>
            
           ))
            :<p>No Comments available</p>
          }
        </div>
        

        <div>

        </div>
      </div>
    </div>
  )
}

export default PostById

