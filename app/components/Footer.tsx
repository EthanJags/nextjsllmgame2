"use client";
import React from "react";
import { changeLanguage } from "../store/slices/languageSlice";
import { useAppSelector, useAppDispatch } from "../store/constants/reduxTypes";

const Footer: React.FC = () => {
  const isEnglish = useAppSelector((state) => state.language.isEnglish);
  const dispatch = useAppDispatch();

  return (
    <footer className="py-6 px-4 border-t border-background-dark bg-white">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
          {isEnglish ? (
            <>Made by <a href="https://ethanjagoda.com" target="_blank" rel="noopener noreferrer" className="underline">Ethan Jagoda</a></>
          ) : (
            <>Hecho por <a href="https://ethanjagoda.com" target="_blank" rel="noopener noreferrer" className="underline">Ethan Jagoda</a></>
          )}
        </p>
        <button
          onClick={() => dispatch(changeLanguage())}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300 text-sm"
        >
          {isEnglish ? "Change to Spanish" : "Cambiar a Inglés"}
        </button>
      </div>
    </footer>
  );
};

export default Footer;