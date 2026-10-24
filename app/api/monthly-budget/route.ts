
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const [rows] = await pool.query(
      `SELECT amount
       FROM monthly_budget
       WHERE YEAR(month) = YEAR(CURDATE())
         AND MONTH(month) = MONTH(CURDATE())
         AND user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [user.id]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Fetch budget error:", error);

    return Response.json(
      { success: false, message: "Failed to fetch monthly budget" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { success: false, message: "Enter a valid budget amount" },
        { status: 400 }
      );
    }

    const [existingRows] = await pool.query(
      `SELECT id
       FROM monthly_budget
       WHERE YEAR(month) = YEAR(CURDATE())
         AND MONTH(month) = MONTH(CURDATE())
         AND user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [user.id]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      const existing = existingRows[0] as { id: number };

      await pool.query(
        `UPDATE monthly_budget
         SET amount = ?
         WHERE id = ? AND user_id = ?`,
        [amount, existing.id, user.id]
      );
    } else {
      await pool.query(
        `INSERT INTO monthly_budget (amount, month, user_id)
         VALUES (?, CURDATE(), ?)`,
        [amount, user.id]
      );
    }

    return Response.json({
      success: true,
      message: "Budget saved successfully",
    });
  } catch (error) {
    console.error("Save budget error:", error);

    return Response.json(
      { success: false, message: "Failed to save budget" },
      { status: 500 }
    );
  }
}
