"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/expenses/add", label: "Add Expenses" },
];

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();

  const [name, setName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get the logged-in user's name
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/me");

        if (!response.ok) {
          setName("");
          return;
        }

        const data = await response.json();
        console.log("Current user data:", data);

        if (data.success && data.user) {
          setName(data.user.name || "");
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    }

    fetchCurrentUser();
  }, [pathname]);

  // Sign out the logged-in user
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        setName("");
        setIsDropdownOpen(false);
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="w-full border-b border-gray-800 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link
          href="/"
          className="col-start-1 row-start-1 flex items-center gap-2.5"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-red-600 to-yellow-500 text-base font-extrabold text-white shadow-lg shadow-red-600/30 sm:h-9 sm:w-9 sm:text-lg">
            ₹
          </span>

          <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-base font-extrabold tracking-tight text-transparent sm:text-xl">
            Expense Tracker
          </span>
        </Link>

        {/* Navigation links */}
        <ul className="col-span-2 row-start-2 mt-3 flex flex-wrap justify-center gap-1 rounded-full border border-gray-800 bg-gray-900 p-1 md:col-span-1 md:col-start-2 md:row-start-1 md:mt-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm lg:px-[18px] ${
                  pathname === href
                    ? "bg-blue-600/20 text-white ring-1 ring-blue-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Account icon and dropdown */}
        <div className="relative col-start-2 row-start-1 flex items-center justify-end gap-2 sm:gap-3 md:col-start-3">
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-800 bg-gray-900 text-gray-400 transition-colors hover:border-gray-600 hover:text-white sm:h-9 sm:w-9"
          >
            {name ? (
              <span className="text-sm font-bold uppercase text-white">
                {name.trim().charAt(0)}
              </span>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            )}
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-36 rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-lg">
              {name && (
                <p className="truncate px-3 py-2 text-sm text-gray-300">
                  {name}
                </p>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-gray-800"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
