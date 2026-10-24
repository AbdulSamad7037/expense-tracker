"use client";

import { useEffect, useState } from "react";

interface Income {
  amount: number;
  created_at: string;
}

export default function Income() {
  const [income, setIncome] = useState<Income[]>([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function fetchIncome() {
      try {
        const response = await fetch("/api/income");

        if (!response.ok) {
          throw new Error("Failed to fetch income data");
        }

        const result = await response.json();
        console.log(result.data);
        setIncome(result.data);
      } catch (error) {
        console.log("Income error:", error);
      }
    }

    fetchIncome();
  }, []);

  async function handleAddIncome() {
    const response = await fetch("/api/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
      }),
    });

    const result = await response.json();
    console.log(result);
    window.location.reload();
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl text-blue-600 font-bold">Add Income</h1>
      <input
        type="number"
        placeholder="Enter income"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mt-4 text-white rounded border p-2 "
      />

      <button
        type="button"
        onClick={handleAddIncome}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white "
      >
        Add Income
      </button>

      {income.map((item) => (
        <div key={item.id}>₹{item.amount}</div>
      ))}
    </main>
  );
}
