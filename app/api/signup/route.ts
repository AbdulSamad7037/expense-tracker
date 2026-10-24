import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    try{
        const body = await request.json();
        const {name , email, password} = body;

        // 1. Check required fields

        if (!name || !email || !password){
            return Response.json(
                {success :false , message: "All fields are required"},
                {status: 400}
            );
        }

        // 2. Check password length
        if (password.length < 8 ){
            return Response.json(
                {success:false , message: "Password must be atleast 8 characters"},
                {status: 400}
            );
        }

        // 3. Check whether email already exists
        const [rows]: any = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email.trim().toLowerCase()]
        );

        if (rows.length > 0){
            return Response.json(
                {success: false , message: "Email already registered"},
                {status : 409}
            );
        }

        // 4. Hash the password
        const passwordHash = await bcrypt.hash(password,12);

        // 5. Save the new user
        await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES(?,?,?)",
            [name.trim(), email.trim().toLowerCase(), passwordHash]
        );

        return Response.json(
            {success : true , message:"Account created successfully"},
            {status : 201}
        );

    } catch(error){
        console.error(error);

        return Response.json(
            {success: false, message:"Failed to create account"},
            {status : 500}
        );
    }
}