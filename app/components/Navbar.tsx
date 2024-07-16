"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <nav className="bg-primary-dark py-4 shadow-md">
      <div className="flex justify-between items-center px-6">
        <button
          onClick={handleHomeClick}
          className="text-white hover:text-secondary transition duration-300 ease-in-out"
          aria-label="Go to home page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
