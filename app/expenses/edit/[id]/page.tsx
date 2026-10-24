"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Expense = {
  id: number;
  title: string;
  amount: string;
  category: string;
  expense_date: string;
};

export default function EditExpense() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expense_date, setExpense_date] = useState("");

  useEffect(() => {
    async function fetchExpense() {
      try {
        const response = await fetch(`/api/expenses/${id}`);
        const result = await response.json();

        if (result.success) {
          setExpense(result.data);

          setTitle(result.data.title);
          setAmount(result.data.amount);
          setCategory(result.data.category);
          setExpense_date(result.data.expense_date.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch expense:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchExpense();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount,
          category,
          date: expense_date,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Expense updated successfully");
        router.push("/expenses");
      } else {
        alert(result.message || "Failed to update expense");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        {" "}
        <p>Loading expense...</p>{" "}
      </main>
    );
  }

  if (!expense) {
    return (
      <main className="p-8">
        {" "}
        <p>Expense not found.</p>{" "}
      </main>
    );
  }

  return (
    <main className="px-4 py-8">
      {" "}
      <div className="mx-auto max-w-xl">
        {" "}
        <h1 className="text-2xl text-blue-700 font-bold">Edit Expense </h1>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border p-6 shadow"
        >
          <div className="mt-6 space-y-4 rounded-lg border p-6 shadow">
            <div>
              <label className="block font-medium">Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Amount</label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none"
              >
                <option value="" className="text-black font-bold bg-white">
                  Select category
                </option>
                <option value="Food" className="text-black bg-white">
                  Food
                </option>
                <option value="Transport" className="text-black bg-white">
                  Transport
                </option>
                <option value="Shopping" className="text-black bg-white">
                  Shopping
                </option>
                <option value="Bills" className="text-black bg-white">
                  Bills
                </option>
                <option value="Electronics" className="text-black bg-white">
                  Electronics
                </option>
                <option value="Others" className="text-black bg-white">
                  Others
                </option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Date</label>

              <input
                type="date"
                value={expense_date}
                onChange={(e) => setExpense_date(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update Expense
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
