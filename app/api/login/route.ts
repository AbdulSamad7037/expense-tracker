
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
  return Response.json(
    { success: false, message: "Email and password are required" },
    { status: 400 }
  );
}

    // Add the database query here
   const [rows]: any = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email.trim().toLowerCase()]
    );
    
    if (rows.length === 0) {
    return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
    );
    }

    const user = rows[0];

        const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
        );

        if (!passwordMatches) {
        return Response.json(
            { success: false, message: "Invalid email or password" },
            { status: 401 }
        );
    }

            const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

            const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret);

     
const response = Response.json(
  {
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  },
  { status: 200 }
);

response.headers.append(
  "Set-Cookie",
  `session=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
);

return response;


  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
