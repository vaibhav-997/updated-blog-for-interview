
import {prisma} from "@/helper/prismaClient"
import { Type, sendVerificationEmail } from "@/helper/sendVerificationEmail"
import bcryptjs from 'bcryptjs'
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from 'uuid';
export async function POST(request:NextRequest) {
    try {
        let {username, newPassword} = await request.json()
        // let {searchParams} = new URL(request.nextUrl)
        // const code = searchParams.get('code')
        if (!username  || !newPassword) {
            return Response.json({message:"All fields must be provided"})
        }

        let existingUser = await prisma.user.findUnique({
            where:{
                username,
            }
        })

        if(!existingUser){
            return Response.json({message:"User not exists | Please register user first",})
        }
        
 
        
       

        const salt = await bcryptjs.genSalt(10)
        let hashedPassword = await bcryptjs.hash(newPassword, salt )

        await prisma.user.update({
            where:{
                username
            },
            data:{
                password:hashedPassword,
            }
        })
        
        return Response.json({message:"Password changed successfully"})
        

    } catch (error) {
        return Response.json({message:"Error registering user", error})
    }
} 

