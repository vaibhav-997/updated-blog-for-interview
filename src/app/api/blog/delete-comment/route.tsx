import { prisma } from "@/helper/prismaClient"

export async function DELETE(request: Request){
    try {
        const {searchParams} = new URL(request.url)
        const id  = searchParams.get('id')
        if(!id) return Response.json({message:"Invalid id"})
            await prisma.comments.delete({
        where:{
            id:Number(id)
        }})
        return Response.json({message:"Comment Deleted Successfully"})
    } catch (error) {
        return Response.json({error})
    }
}