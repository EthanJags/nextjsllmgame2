import React, { use, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@/app/store/constants/reduxTypes';
import { useSocketEvent } from '@/app/functions/useSocketEvent';
import { setAnswers, setCurrentStage } from '@/app/store/slices/gameSlice';

const Choosing: React.FC<{
  socket: Socket,
}> = ({ socket }) => {
    const dispatch = useAppDispatch();
    const question = useAppSelector((state) => state.game.currentQuestion);
    const answers = useAppSelector((state) => state.game.answers);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    if (!socket) return <h1>Socket is undefined</h1>;

    const handleSubmit = () => {
        if (selectedAnswer && socket) {
            socket.emit("submitAnswer", { answer: selectedAnswer });
            dispatch(setCurrentStage('AwaitingResponses'));
        }
    }

    const answerOptions = answers ? Object.values(answers).map((answer, index) => (
        <button
          key={index}
          onClick={() => setSelectedAnswer(answer)}
          className={selectedAnswer === answer ? 'selected' : ''}
        >
          {answer}
        </button>
    )) : [];

    return (
        <div>
            <h2>Question: {question}</h2>
            <h1>Choose an Answer</h1>
            <div className="answer-options">
                {answers && Object.keys(answers).length > 0 ? answerOptions : <h1>Answers not loaded</h1>}
            </div>
            <button 
                onClick={handleSubmit} 
                disabled={!selectedAnswer}
                className="submit-button"
            >
                Submit Answer
            </button>
        </div>
    );
};
export default Choosing;