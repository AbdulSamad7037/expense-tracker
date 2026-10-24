
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import pool from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token || !process.env.AUTH_SECRET) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET
    );

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "number" &&
      typeof payload.userId !== "string"
    ) {
      return null;
    }

    const [rows]: any = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [payload.userId]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}
