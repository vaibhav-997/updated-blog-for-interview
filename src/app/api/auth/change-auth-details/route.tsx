import { prisma } from "@/helper/prismaClient";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try {
        const {username,email,newUsername, newEmail} = await request.json()
        
        if(!newUsername || !newEmail || !username || !email){
            return Response.json({message: "All fields are required"})
        }

        let userInDB = await prisma.user.findFirst({
            where:{
                OR:[
                    {
                        username:username,
                    },{
                        email:email
                    }
                ]
            }
        })

        if(!userInDB){
            return Response.json({message: "User not found"})
        }
        let updatedUser = await prisma.user.update({
            where:{
                username:username
            },
            data:{
                username:newUsername,
                email:newEmail
            }
        })
        return Response.json({message: "User updated successfully"})

    } catch (error :any) {
        return Response.json({message: error.message});
    }
}