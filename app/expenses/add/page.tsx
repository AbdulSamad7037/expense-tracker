"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddExpense() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !amount || !category || !date) {
      setMessage("Please fill in all fields.");
      return;
    }

    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount,
        category,
        date,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Expense added successfully!");
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");

      router.push("/expenses");
    } else {
      setMessage("Failed to add expense.");
    }
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-blue-700 sm:text-3xl">
          Add Expense
        </h1>

        {message && (
          <p className="mb-4 text-sm font-medium text-red-500">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-2 block font-medium">Expense Title</label>

            <input
              type="text"
              placeholder="Enter expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block font-medium">Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-medium">Category</label>

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

          {/* Date */}
          <div>
            <label className="mb-2 block font-medium">Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>
      </div>
    </main>
  );
}
