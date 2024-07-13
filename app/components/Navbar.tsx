"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import DarkModeToggle from "./DarkModeToggle";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <nav className="bg-primary-dark py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={handleHomeClick}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Home
        </button>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
