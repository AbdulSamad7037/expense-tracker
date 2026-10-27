"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type DashboardData = {
  total: number;
  count: number;
  highest: number;
  monthlyTotal: number;
  categories: {
    category: string;
    total: number;
  }[];
  dailyExpenses: {
    day: number;
    total: number;
  }[];
};

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);
  const [budgetMessage, setBudgetMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Step 1: Check whether the user is logged in
        const authResponse = await fetch("/api/me");

        if (!authResponse.ok) {
          router.replace("/login");
          return;
        }

        // The user is logged in
        setIsAuthenticated(true);

        // Step 2: Fetch dashboard data
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);

        // Step 3: Fetch monthly budget
        const budgetResponse = await fetch("/api/monthly-budget");

        if (!budgetResponse.ok) {
          throw new Error("Failed to fetch monthly budget");
        }

        const budgetResult = await budgetResponse.json();
        const savedBudget = Number(budgetResult.data?.[0]?.amount || 0);

        setBudget(savedBudget);
        setBudgetInput(savedBudget > 0 ? String(savedBudget) : "");
      } catch (error) {
        console.error("Home page error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
        setAuthChecking(false);
      }
    }

    fetchData();
  }, [router]);

  async function saveBudget() {
    const amount = Number(budgetInput);

    if (!budgetInput.trim() || !Number.isFinite(amount) || amount <= 0) {
      setBudgetMessage("Please enter a valid budget amount.");
      return;
    }

    setSavingBudget(true);
    setBudgetMessage("");

    try {
      const response = await fetch("/api/monthly-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save budget");
      }

      setBudget(amount);
      setBudgetMessage("Monthly budget saved successfully!");
    } catch (error) {
      console.error("Save budget error:", error);

      setBudgetMessage(
        error instanceof Error ? error.message : "Failed to save budget.",
      );
    } finally {
      setSavingBudget(false);
    }
  }

  const monthlyExpenses = Number(data?.monthlyTotal || 0);
  const remainingBudget = Math.max(budget - monthlyExpenses, 0);

  const usedPercentage =
    budget > 0 ? Math.min((monthlyExpenses / budget) * 100, 100) : 0;

  const now = new Date();
  const currentDay = now.getDate();

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const daysLeft = Math.max(daysInMonth - currentDay, 0);
  const dailyAverage = currentDay > 0 ? monthlyExpenses / currentDay : 0;

  const safeToSpend =
    daysLeft > 0 ? remainingBudget / daysLeft : remainingBudget;

  const monthName = now.toLocaleString("en-IN", {
    month: "long",
  });

  const year = now.getFullYear();

  if (authChecking || !isAuthenticated) {
    return null;
  }

  return (
    <main className="w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-6xl">
            Manage Your Expenses
          </h1>

          <p className="mt-2 max-w-2xl px-4 text-sm text-blue-600 sm:text-base md:text-lg">
            Track your spending, manage your budget, and stay in control of your
            finances.
          </p>

          <div className="mt-6 flex flex-row gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:shadow-[0_0_20px_rgba(255,255,255,0.6)] sm:px-5 sm:py-3"
            >
              View Dashboard
            </Link>

            <Link
              href="/expenses/add"
              className="rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:shadow-[0_0_20px_rgba(255,255,255,0.6)] sm:px-5 sm:py-3"
            >
              Add Expense
            </Link>
          </div>
        </div>

        {/* Budget Section */}
        <div className="mx-auto mt-12 w-full min-w-0 max-w-5xl">
          {loading ? (
            <p className="text-center text-gray-500">Loading budget data...</p>
          ) : (
            <div className="overflow-hidden rounded-3xl text-gray-900">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-400 px-6 py-5">
                <div>
                  <p className="text-xl font-bold text-gray-400 sm:text-2xl">
                    {monthName} {year} budget
                  </p>
                </div>

                <p className="text-sm text-gray-400 sm:text-base">
                  {daysLeft} days left
                </p>
              </div>

              {/* Main Content */}
              <div className="flex flex-col items-center gap-10 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-12">
                {/* Budget Circle */}
                <div className="flex shrink-0 items-center justify-center">
                  <div
                    className="relative flex h-50 w-50 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(
                        #fc6129 ${usedPercentage * 3.6}deg,
                        #263548 ${usedPercentage * 3.6}deg
                      )`,
                    }}
                  >
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[#111827] text-center">
                      <p className="text-sm text-gray-400">Left this month</p>

                      <h2 className="mt-2 text-2xl font-extrabold text-blue-600 sm:text-3xl">
                        ₹
                        {remainingBudget.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </h2>

                      <p className="mt-2 text-sm text-gray-400">
                        {Math.round(usedPercentage)}% used
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Information */}
                <div className="w-full min-w-0 flex-1">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Spent */}
                    <div>
                      <p className="text-sm text-gray-400">Spent</p>

                      <h3 className="mt-1 text-2xl font-bold text-green-600">
                        ₹
                        {monthlyExpenses.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </h3>
                    </div>

                    {/* Monthly Budget */}
                    <div>
                      <p className="text-sm text-gray-400">Monthly budget</p>

                      <h3 className="mt-1 text-2xl font-bold text-green-600">
                        ₹
                        {budget.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </h3>

                      {/* Budget Input and Save Button */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={budgetInput}
                          onChange={(e) => {
                            setBudgetInput(e.target.value);
                            setBudgetMessage("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveBudget();
                            }
                          }}
                          placeholder="Enter monthly budget"
                          aria-label="Monthly budget amount"
                          className="w-full rounded-lg border border-gray-500 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-400 sm:w-48"
                        />

                        <button
                          type="button"
                          onClick={saveBudget}
                          disabled={savingBudget}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingBudget ? "Saving..." : "Save Budget"}
                        </button>
                      </div>

                      {budgetMessage && (
                        <p role="status" className="mt-2 text-sm text-blue-600">
                          {budgetMessage}
                        </p>
                      )}
                    </div>

                    {/* Safe To Spend */}
                    <div>
                      <p className="text-sm text-gray-400">
                        Safe to spend per day
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-green-600">
                        ₹
                        {safeToSpend.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </h3>
                    </div>

                    {/* Daily Average */}
                    <div>
                      <p className="text-sm text-gray-400">
                        Daily average so far
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-green-600">
                        ₹
                        {dailyAverage.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Expenses Chart */}
      <div className="mx-auto mt-12 w-full min-w-0 max-w-5xl">
        <h2 className="mb-2 w-full border-b border-gray-400 px-4 py-5 text-xl font-bold text-gray-400 sm:px-6 sm:text-2xl">
          Daily Expenses
        </h2>

        <p className="mb-6 text-sm text-blue-500">
          Your spending this month, day by day
        </p>

        <div className="h-80 w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.dailyExpenses || []}
              barCategoryGap="0%"
              barGap={0}
              margin={{ top: 30, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                interval={0}
                tickMargin={5}
              />

              <YAxis tickFormatter={(value) => `${value / 1000}k`} />

              <Bar
                dataKey="total"
                fill="orange"
                barSize={25}
                radius={[3, 3, 0, 0]}
              >
                <LabelList
                  dataKey="total"
                  position="top"
                  fontSize={10}
                  fill="#16a34a"
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise Expenses Chart */}
        <div className="mx-auto mt-12 w-full min-w-0 max-w-5xl">
          <h2 className="mb-2 w-full border-b border-gray-400 px-4 py-5 text-xl font-bold text-gray-400 sm:px-6 sm:text-2xl">
            Category-wise Expenses
          </h2>

          <p className="mb-6 text-sm text-blue-500">
            Compare your spending across categories
          </p>

          <div className="h-80 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.categories || []}
                layout="vertical"
                barCategoryGap="0%"
                barGap={0}
                margin={{
                  top: 5,
                  right: 70,
                  left: 5,
                  bottom: 5,
                }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${value / 1000}k`}
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 10 }}
                  width={90}
                />

                <Bar
                  dataKey="total"
                  fill="#fc29ce"
                  barSize={15}
                  radius={[0, 3, 3, 0]}
                >
                  <LabelList
                    dataKey="total"
                    position="right"
                    fontSize={10}
                    fill="#16a34a"
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-400/50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-400">
            © {new Date().getFullYear()} Expense Tracker
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Track your spending. Manage your budget. Stay in control.
          </p>
        </footer>
      </div>
    </main>
  );
}
