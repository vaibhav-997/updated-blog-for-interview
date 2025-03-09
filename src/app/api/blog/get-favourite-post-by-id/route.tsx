import { prisma } from "@/helper/prismaClient"

export async function GET(request: Request){
try {
    const {searchParams} = new URL(request.url)
    const id = searchParams.get('id')
    if(!id) return Response.json({message:"Invalid id"})
    let isPresentInFavourite = await prisma.likes.findFirst({
        where:{
            postId:Number(id)
        }
    })
    if(!isPresentInFavourite) return Response.json({message:"Favourite not found",status:false})
        return Response.json({message:"Favourite found",status:true})
} catch (error) {
    return Response.json({error})
}
}