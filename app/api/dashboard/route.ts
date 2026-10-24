
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    // NEW: Identify the logged-in user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    // CHANGED: Total expenses for this user only
    const [totalResult] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ?",
      [user.id]
    );

    // CHANGED: Expense count for this user only
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS count FROM expenses WHERE user_id = ?",
      [user.id]
    );

    // CHANGED: Highest expense for this user only
    const [highestResult] = await db.query(
      "SELECT COALESCE(MAX(amount), 0) AS highest FROM expenses WHERE user_id = ?",
      [user.id]
    );

    // CHANGED: Current month's expenses for this user only
    const [monthlyResult] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS monthlyTotal
       FROM expenses
       WHERE user_id = ?
       AND YEAR(expense_date) = YEAR(CURDATE())
       AND MONTH(expense_date) = MONTH(CURDATE())`,
      [user.id]
    );

    // CHANGED: Daily expenses for this user only
    const [dailyResult] = await db.query(
      `SELECT DAY(expense_date) AS day,
              COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE user_id = ?
       AND MONTH(expense_date) = MONTH(CURDATE())
       AND YEAR(expense_date) = YEAR(CURDATE())
       GROUP BY DAY(expense_date)
       ORDER BY DAY(expense_date)`,
      [user.id]
    );

    // CHANGED: Category totals for this user only
    const [categoryResult] = await db.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
       GROUP BY category
       ORDER BY total DESC`,
      [user.id]
    );

    return NextResponse.json({
      total: (totalResult as any)[0].total,
      count: (countResult as any)[0].count,
      highest: (highestResult as any)[0].highest,
      monthlyTotal: (monthlyResult as any)[0].monthlyTotal,
      categories: categoryResult,
      dailyExpenses: dailyResult,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
