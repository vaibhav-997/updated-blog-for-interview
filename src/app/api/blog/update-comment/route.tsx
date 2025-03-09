import { prisma } from "@/helper/prismaClient"

export async function PATCH(request:Request){
    try {
       const {searchParams} = new URL(request.url)
       const id =  searchParams.get('id')
        const {comment} = await request.json()
        if(!comment) return Response.json({message:"Comment not found"})
       if(!id) {
        return Response.json({message:"Invalid id"})
       }

       await prisma.comments.update({
        where:{
            id:Number(id)
        },
        data:{
            comment:comment
        }
       })

return Response.json({message:"Comment updated successfully"})
    } catch (error) {
        return Response.json({error})
    }
}