import { prisma } from "@/helper/prismaClient"

export async function GET(request: Request){
    try {
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')
        console.log(id)
        if(!id) return Response.json({message:"Invalid id"})

        let comment = await prisma.comments.findUnique({
            where:{
                id:Number(id)
            }
        })
        return Response.json({message:"Comment fetched successfully", data:comment})


    } catch (error) {
        return Response.json({error})
    }
}