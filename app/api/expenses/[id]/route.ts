
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [rows] = await db.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    const expenses = rows as any[];

    if (expenses.length === 0) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: expenses[0],
    });
  } catch (error) {
    console.error("Get expense error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [result] = await db.query(
      "DELETE FROM expenses WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete expense" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, amount, category, date } = body;

    if (
      !title ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !category ||
      !date
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `UPDATE expenses
       SET title = ?, amount = ?, category = ?, expense_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, amount, category, date, id, user.id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Update expense error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update expense" },
      { status: 500 }
    );
  }
}
