import { prisma } from "@/helper/prismaClient"
import { getServerSession } from "next-auth"
import { URL } from "url"

export async function POST (request:Request){
  
        const {comment} = await request.json()
        console.log(comment)
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')
        const session = await getServerSession()
        console.log(session?.user)
        console.log(id)
        console.log(comment)
        if(!id){
            return Response.json({message:"Invalid id"})
        }
        if(!comment){
            return Response.json({message:"Comment not found"})
        }
        if(!session){
            return Response.json({message:"Login to add comments"})
        }

        let user = await prisma.user.findFirst({
            where:{
                username:session.user.name!
            }
        })

        if(!user){
            return Response.json({message:'No user found please login'})
        }

        let savedComment = await prisma.comments.create({
            data:{
                postId:Number(id),
                userId:user?.id as number,
                comment:comment
            }
        })

        return Response.json({message:"Comment added successfully" })





    
}


export async function PATCH (request:Request){
  
        const {comment} = await request.json()
        console.log(comment)
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')
        const session = await getServerSession()
        console.log(session?.user)
        console.log(id)
        console.log(comment)
        if(!id){
            return Response.json({message:"Invalid id"})
        }
        if(!comment){
            return Response.json({message:"Comment not found"})
        }
        if(!session){
            return Response.json({message:"Login to add comments"})
        }

        let user = await prisma.user.findFirst({
            where:{
                username:session.user.name!
            }
        })

        if(!user){
            return Response.json({message:'No user found please login'})
        }

        let updatedComment = await prisma.comments.update({
            where:{
                id:Number(id)
            },
            data:{
                postId:Number(id),
                userId:user?.id as number,
                comment:comment
            }
        })

        return Response.json({message:"Comment updated successfully" })





    
}