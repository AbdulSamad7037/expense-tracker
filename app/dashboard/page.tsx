"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  total: number;
  count: number;
  highest: number;
  monthlyTotal: number;
  categories: {
    category: string;
    total: number;
  }[];
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Get dashboard expense data
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();

        // Get monthly budget
        const budgetResponse = await fetch("/api/monthly-budget");

        if (!budgetResponse.ok) {
          throw new Error("Failed to fetch monthly budget");
        }

        const budgetResult = await budgetResponse.json();

        setBudget(Number(budgetResult.data?.[0]?.amount || 0));
        setData(result);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-hidden px-4">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  // Total expenses for the current month
  const monthlyExpenses = Number(data?.monthlyTotal || 0);

  // Remaining budget
  const availableBudget = budget - monthlyExpenses;

  return (
    <main className="w-full min-w-0 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        {/* Heading */}
        <div className="mb-8 min-w-0">
          <h1 className="break-words text-2xl font-bold text-blue-600 sm:text-3xl">
            Welcome to Dashboard!
          </h1>

          <p className="mt-2 break-words text-yellow-300">
            Here&apos;s an overview of your expenses.
          </p>
        </div>

        {/* Monthly Budget */}
        <div className="relative mb-6 w-full min-w-0 overflow-hidden rounded-[2rem] border-4 border-red-50 bg-black p-5 shadow-lg sm:p-7">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Monthly Budget
          </p>

          <h2 className="mt-3 break-words text-3xl font-extrabold text-green-500 sm:text-4xl">
            ₹{budget.toFixed(2)}
          </h2>

          <div className="mt-6 border-t border-gray-700 pt-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Available Budget
            </p>

            <h3
              className={`mt-2 break-words text-2xl font-bold sm:text-3xl ${
                availableBudget >= 0 ? "text-red-400" : "text-red-500"
              }`}
            >
              ₹{availableBudget.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {/* Total Expenses */}
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>

            <h2 className="mt-3 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              ₹{Number(data?.total || 0).toFixed(2)}
            </h2>
          </div>

          {/* Transactions */}
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-500">Transactions</p>

            <h2 className="mt-3 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              {data?.count || 0}
            </h2>
          </div>

          {/* Highest Expense */}
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-500">Highest Expense</p>

            <h2 className="mt-3 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              ₹{Number(data?.highest || 0).toFixed(2)}
            </h2>
          </div>

          {/* Monthly Expenses */}
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-500">
              Monthly Expenses
            </p>

            <h2 className="mt-3 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              ₹{monthlyExpenses.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="mt-8 w-full min-w-0 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition sm:p-6 hover:-translate-y-1">
          <h2 className="break-words text-lg font-semibold text-gray-900">
            Expenses by Category
          </h2>

          <div className="mt-4 min-w-0 space-y-4">
            {data?.categories && data.categories.length > 0 ? (
              data.categories.map((item) => (
                <div
                  key={item.category}
                  className="flex min-w-0 items-start justify-between gap-3 border-b pb-3"
                >
                  <span className="min-w-0 break-words font-medium text-gray-700">
                    {item.category}
                  </span>

                  <span className="shrink-0 text-right font-bold text-gray-900">
                    ₹{Number(item.total).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No expenses found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
