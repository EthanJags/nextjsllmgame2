"use client";
import React from "react";
import { setLanguage } from "../store/slices/languageSlice";
import { useAppSelector, useAppDispatch } from "../store/constants/reduxTypes";

const USFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="24" height="18">
    <path fill="#bd3d44" d="M0 0h640v480H0"/>
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
    <path fill="#192f5d" d="M0 0h364.8v258.5H0"/>
    <path fill="#fff" d="M30.4 11l3.4 10.3h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zM60.8 37l3.4 10.2H75l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zM30.4 62.8l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zM60.8 88.6l3.4 10.3H75l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zM30.4 114.5l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zM60.8 140.3l3.4 10.2H75l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zM30.4 166.1l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.3 3.4 10.3-8.9-6.3-8.8 6.3 3.4-10.3-8.9-6.3h10.9zM60.8 191.9l3.4 10.2H75l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zm60.8 0l3.4 10.2h10.9l-8.8 6.4 3.4 10.3-8.9-6.4-8.8 6.4 3.4-10.3-8.9-6.4h10.9zM30.4 217.7l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9zm60.8 0l3.4 10.3h10.9l-8.8 6.4 3.4 10.2-8.9-6.4-8.8 6.4 3.4-10.2-8.9-6.4h10.9z"/>
  </svg>
);

const SpainFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" width="24" height="18">
    <rect width="750" height="500" fill="#c60b1e"/>
    <rect width="750" height="250" fill="#ffc400" y="125"/>
    <path d="M145 125h50v250h-50z"/>
    <path fill="#c60b1e" d="M170 150h-15a15 15 0 0 0-15 15v20a15 15 0 0 1 15-15h15z"/>
    <path fill="#ffc400" d="M170 150h15a15 15 0 0 1 15 15v20a15 15 0 0 0-15-15h-15z"/>
    <path d="M180 190a10 10 0 0 1 20 0v55a10 10 0 0 1-20 0z"/>
    <path d="M175 235c0-8 6-14 14-14s14 6 14 14v20c0 8-6 14-14 14s-14-6-14-14z" fill="#c60b1e"/>
    <circle cx="189" cy="251" r="6" fill="#ffc400"/>
  </svg>
);
const IndiaFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="18">
    <rect width="900" height="600" fill="#f93"/>
    <rect width="900" height="200" y="200" fill="#fff"/>
    <rect width="900" height="200" y="400" fill="#128807"/>
    <g transform="translate(450,300)" fill="#008">
      <circle r="60"/>
      <circle r="55" fill="#fff"/>
      <circle r="20"/>
      <g id="d">
        <g id="c">
          <g id="b">
            <g id="a">
              <circle r="4" transform="rotate(7.5) translate(17.5)"/>
              <path d="M 0,17.5 0.6,7 C 0.6,7 0,2 0,2 0,2 -0.6,7 -0.6,7 L 0,17.5 z"/>
            </g>
            <use href="#a" transform="rotate(15)"/>
          </g>
          <use href="#b" transform="rotate(30)"/>
        </g>
        <use href="#c" transform="rotate(60)"/>
      </g>
      <use href="#d" transform="rotate(120)"/>
      <use href="#d" transform="rotate(-120)"/>
    </g>
  </svg>
);

const Footer: React.FC = () => {
  const language = useAppSelector((state) => state.language.language);
  const dispatch = useAppDispatch();

  return (
    <footer className="py-6 px-4 border-t border-background-dark bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {language === 'english' ? "Made by " : 
           language === 'spanish' ? "Hecho por " : 
           "द्वारा बनाया गया "}
          <a
            href="https://ethanjagoda.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            Ethan Jagoda
          </a>
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setLanguage('english'))}
            className={`p-1 rounded-md hover:bg-gray-200 transition duration-300 ${language === 'english' ? 'opacity-100' : 'opacity-50'}`}
            aria-label="Change to English"
          >
            <USFlag />
          </button>
          <button
            onClick={() => dispatch(setLanguage('spanish'))}
            className={`p-1 rounded-md hover:bg-gray-200 transition duration-300 ${language === 'spanish' ? 'opacity-100' : 'opacity-50'}`}
            aria-label="Cambiar a Español"
          >
            <SpainFlag />
          </button>
          <button
            onClick={() => dispatch(setLanguage('hindi'))}
            className={`p-1 rounded-md hover:bg-gray-200 transition duration-300 ${language === 'hindi' ? 'opacity-100' : 'opacity-50'}`}
            aria-label="हिंदी में बदलें"
          >
            <IndiaFlag />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;