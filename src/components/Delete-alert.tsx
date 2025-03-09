import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import axios from "axios"

  import React from 'react'
import { useToast } from "./ui/use-toast"

//   {trigger}:{trigger:string}
  


  function DeleteAlert({id, title, comment=false}:{id:string, title:string, comment:boolean}) {

    const {toast} = useToast()
 
    const handleDelete = async () => {
        try {
            if(!comment){
              const res = await axios.delete(`/api/blog/delete-blog?id=${id}`)
            console.log(res.data)
            toast({
                title:res?.data?.message
            })
            }else {
              const res = await axios.delete(`/api/blog/delete-comment?id=${id}`)
              console.log(res.data)
              toast({
                  title:res?.data?.message
              })
            }
        } catch (error) {
            console.log(error)
            toast({
                title:"error deleting blog"
            })
        }
    }

    return (
      
        <AlertDialog >
  <AlertDialogTrigger  className="w-full flex items-center justify-start">Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure? You want to delete {title} </AlertDialogTitle>
      <AlertDialogDescription>
          
        
        This action cannot be undone. This will permanently delete your blog post
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      
    )
  }
  
  export default DeleteAlert