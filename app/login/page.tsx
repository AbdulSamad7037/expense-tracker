"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("Signing in...");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

      {/* Left branding panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0B1730] via-[#081225] to-[#10101D] p-12 lg:flex xl:p-16">
        <div className="absolute -right-28 top-1/4 h-80 w-80 rounded-full border border-blue-400/10" />
        <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full border border-orange-400/10" />

        <Link href="/login" className="relative z-10 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-extrabold shadow-lg shadow-orange-500/20">
            ₹
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Expense <span className="text-orange-400">Tracker</span>
          </span>
        </Link>

        <div className="relative z-10 my-12 max-w-lg">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Your money, under control
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Make every rupee
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              count.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            Track your spending, manage your budget, and build better financial
            habits — all in one place.
          </p>

          {/* Decorative finance illustration built with CSS */}
          <div className="relative mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Spending overview</p>
                <p className="mt-2 text-2xl font-bold">Stay on track</p>
              </div>
              <div className="rounded-xl bg-orange-400/10 p-3 text-xl text-orange-400">
                ₹
              </div>
            </div>

            <div className="mt-8 flex h-24 items-end gap-3">
              {[35, 55, 42, 75, 50, 88, 65, 100, 72, 85, 58, 76].map(
                (height, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t-md ${
                      index === 7
                        ? "bg-gradient-to-t from-orange-600 to-orange-400"
                        : "bg-gradient-to-t from-blue-800 to-blue-400/70"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
              <span>Plan wisely</span>
              <span className="text-emerald-400">Spend confidently ↗</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          Better financial habits start with one small step.
        </p>
      </section>

      {/* Right login panel */}
      <section className="relative flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-10 lg:w-1/2 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Branding on mobile */}
          <Link
            href="/login"
            className="mb-10 flex items-center justify-center gap-3 lg:hidden"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-bold">
              ₹
            </span>
            <span className="text-xl font-extrabold">
              Expense <span className="text-orange-400">Tracker</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Pick up where you left off and keep your finances organized.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-4 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-center text-sm ${
                message === "Signing in..." ? "text-blue-400" : "text-slate-300"
              }`}
            >
              {message}
            </p>
          )}

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">
              NEW TO EXPENSE TRACKER?
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-orange-400 transition hover:text-orange-300"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-600">
            Your journey toward smarter spending starts here.
          </p>
        </div>
      </section>
    </main>
  );
}
