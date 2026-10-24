
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
      "SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC",
      [user.id]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Failed to fetch expenses" },
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
    const { title, amount, category, date } = body;

    if (!title || !amount || !category || !date) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO expenses (title, amount, category, expense_date, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, amount, category, date, user.id]
    );

    return Response.json({
      success: true,
      message: "Expense added successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to add expense",
      },
      { status: 500 }
    );
  }
}
