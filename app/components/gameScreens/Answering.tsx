import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Answering: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");
  const question = useAppSelector((state) => state.game.currentQuestion);
  const currentPlayerId = useAppSelector((state) => state.player.id);
  const maxWordLimit = 100;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    if (!socket) return;
    socket.emit("submitAnswer", { currentPlayerId, answer: text });
    dispatch(setCurrentStage("AwaitingResponses"));
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold text-gray-700 mb-4">Prompt: {question}</p>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={`Enter your response (max ${maxWordLimit} words)`}
        maxLength={maxWordLimit * 5} // Rough estimate of characters
        rows={5}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 mb-2"
      />
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          {wordCount} / {maxWordLimit} words
        </span>
        <button
          onClick={handleSubmit}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          disabled={wordCount === 0 || wordCount > maxWordLimit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Answering;
