'use client'
import React, { useEffect, useRef } from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { ChangeEvent, useState } from "react"
import axios from "axios"

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { Post } from '../../explore/[id]/page'; 
import { Posts } from '@/app/page';
import { Textarea } from '@/components/ui/textarea';




const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string(),

})

export default function UpdateBlog({params}:{params:{id:string}}) {
  
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [post, setPost] = useState<Posts>()
  

  const { toast } = useToast()
  const router = useRouter()


  useEffect(() => {
    ;(
      async () => {
        setLoading(true)
        let res = await axios.get(`/api/blog/get-post-by-id?id=${params.id}`)
        setPost(res.data.post)
      
        setLoading(false)
      }
    )();
  },[params.id])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    
  }) 
  console.log(post)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files) {
      const file = e.target.files[0]
      setImage(file)
    }
  }

 





  async function onSubmit(values: z.infer<typeof formSchema>) {
    
      try {
        setUpdating(true)
        let postData = {
          title: values?.title || post?.title,
          description: values?.description || post?.description,
          image:''
          
        }
        if(image){
            let formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'inft6m7o')
        
        let res = await axios.post('https://api.cloudinary.com/v1_1/dgidhfah9/upload', formData)
        postData.image =  res.data.secure_url

        

    }else {
      postData.image = post?.image as string
    }
  
        let postRes = await axios.patch(`/api/blog/update-blog?id=${post?.id}`, postData)
        
        toast({
          title: postRes.data.message,
          
        })
        setUpdating(false)
        router.push('/')
      } catch (error) {
        console.log(error)
        toast({
          title: "Error submitting post"
        })
        setUpdating(false)

      } finally {
        setUpdating(false)
      }
    
  }


  return (
   <div>{
      loading ? <h1>Loading...</h1>
      :
      <div className="flex flex-col ">

      <div className="w-full text-center font-bold text-4xl">
        <h1 className="text-orange-600">Update Blog</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            defaultValue={post?.title}
            
            render={({ field }) => (
              <FormItem>
                
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input     placeholder='eg. title' {...field}  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            defaultValue={post?.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="eg.Description" {...field} />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Image</Label>
            <Input  type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)} name="image" />
          </div>

          <Button type="submit">{updating ? "Submitting..." : "Submit"}</Button>
        </form>
      </Form>
    </div>
    }</div>
  )
}
