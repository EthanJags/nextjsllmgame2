'use client';
import React from "react";
import { changeLanguage } from "../store/actions/changeLanguage";
import { useAppSelector, useAppDispatch } from "../store/constants/reduxTypes";

const Footer: React.FC = () => {
  const isEnglish = useAppSelector((state) => state.language.isEnglish); // state is already pre-typed
  const dispatch = useAppDispatch();

  return (
    <footer
      style={{
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>{isEnglish ? "Made by Ethan Jagoda" : "Hecho por Ethan Jagoda"}</p>
      <button onClick={() => dispatch(changeLanguage(!isEnglish))}>
        {isEnglish ? "Change to Spanish" : "Cambiar a Inglés"}
      </button>
    </footer>
  );
};

export default Footer;
