"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Expense = {
  id: number;
  title: string;
  amount: string;
  category: string;
  expense_date: string;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch("/api/expenses");
        const result = await response.json();

        if (result.success) {
          setExpenses(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  async function handleDelete(expense: Expense) {
    if (!window.confirm(`Delete "${expense.title}"? This can't be undone.`))
      return;

    setError("");
    setDeletingId(expense.id);

    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setExpenses((prev) => prev.filter((item) => item.id !== expense.id));
      } else {
        setError(result.message || "Couldn't delete the expense. Try again.");
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError("Couldn't delete the expense.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  let tableContent;

  if (loading) {
    tableContent = (
      <tr>
        <td colSpan={5} className="px-4 py-6 text-center">
          Loading expenses...
        </td>
      </tr>
    );
  } else if (expenses.length === 0) {
    tableContent = (
      <tr>
        <td colSpan={5} className="px-4 py-6 text-center">
          No expenses found.
        </td>
      </tr>
    );
  } else {
    tableContent = filteredExpenses.map((expense) => (
      <tr key={expense.id} className="border-b">
        <td className="px-4 py-3">{expense.title}</td>
        <td className="px-4 py-3">{expense.category}</td>
        <td className="px-4 py-3">{formatDate(expense.expense_date)}</td>
        <td className="px-4 py-3">₹{expense.amount}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Link
              href={`/expenses/edit/${expense.id}`}
              className="rounded-md border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-600 hover:text-white"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(expense)}
              disabled={deletingId === expense.id}
              className="rounded-md border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingId === expense.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Expenses</h1>

            <p className="mt-2 text-sm text-blue-500 sm:text-base">
              Manage and track all your Expenses
            </p>

            <input
              type="text"
              value={search}
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 w-full mt-2"
            />
          </div>

          <Link
            href="/expenses/add"
            className="rounded-md bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Expense
          </Link>
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="rounded bg-green-900">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
