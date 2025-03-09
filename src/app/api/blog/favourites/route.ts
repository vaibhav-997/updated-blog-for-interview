import { prisma } from "@/helper/prismaClient"
import { use } from "react"
import { URL } from "url"

export async function POST (request: Request) {
    try {
        const {searchParams} = new URL(request.url)
        console.log(searchParams)
        const id = searchParams.get('id')
        const userId = searchParams.get('userId')
        if(!id || !userId){
            return Response.json({message: 'Invalid id'})
        }

        let userFromDB = await prisma.user.findFirst({
            where:{
                id: Number(userId),
            }
        })

        if(!userFromDB) {
            return Response.json({message: 'User not found | Please login '})
        }

        let isPostExists = await prisma.likes.findFirst({
            where:{
                AND:[
                    {
                        postId: Number(id),
                    },{
                        userId: Number(userFromDB.id)
                    }
                ]
            }
        })

        if(isPostExists){
            return Response.json({message: 'Post already exists in favorites'})
        }

        await prisma.likes.create({
            data:{
                userId: Number(searchParams.get('userId')),
                postId: Number(searchParams.get('id'))
            }
        })

        return Response.json({message: 'Added to favorites successfully ' })

        
    } catch (error) {
        return Response.json({error})
    }
}

export async function GET (request: Request) {
    try {
        const {searchParams} = new URL(request.url)
        console.log(searchParams)
        if(!searchParams.get('userId')){
            return Response.json({message: 'Invalid id'})
        }

        let favouriteBlogs = await prisma.likes.findMany({
            where:{
                userId: Number(searchParams.get('userId')),
            },
            select:{
                id:true,
                postId:true,
                posts:true,
                userId:true
            }
        })

        return Response.json({message: 'fetched favorites blogs successfully ', data:favouriteBlogs })

        
    } catch (error) {
        return Response.json({error})
    }
}



export async function DELETE (request: Request) {
    try {
        const {searchParams} = new URL(request.url)
        console.log(searchParams)
        if(!searchParams.get('id')){
            return Response.json({message: 'Invalid id'})
        }

        let favouriteBlogs = await prisma.likes.delete({
            where:{
               id : Number(searchParams.get('id'))
            }
        })

        return Response.json({message: 'removed favorite blog successfully ', data:favouriteBlogs })

        
    } catch (error) {
        return Response.json({error})
    }
}