import { connect } from "@/dbConfig/dbConfig"
import User from '@/models/userModel' // We can keep model in the app folder as well
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json() //req.body
        const {username, email, password} = reqBody
        console.log(reqBody);

        //Check if user already exists
        const user = await User.findOne({email})
        if(user) {
            return NextResponse.json({error: "User alreadt exists"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}