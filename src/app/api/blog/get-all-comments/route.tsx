import { prisma } from "@/helper/prismaClient"

export async function GET (request: Request){
    try {
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')
        if(!id){
            return Response.json({message:"Invalid id"})
        }
        const allCommetns = await prisma.comments.findMany({
            where:{
                postId:Number(id)
            }
        })
        return Response.json({message:"fetched comments successfully",data:allCommetns})
    } catch (error) {
        return Response.json({error})
    }
}