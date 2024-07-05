import React, { useState } from 'react';
import TimerBar from '../TimerBar/TimerBar';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@/app/store/constants/reduxTypes';
import { useSocketEvent } from '@/app/functions/useSocketEvent';
import { setAnswers, setCurrentStage } from '@/app/store/slices/gameSlice';

const Answering: React.FC<{
    socket: Socket,
}> = ({ socket }) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState<string>("");
    const question = useAppSelector((state) => state.game.currentQuestion);
    const maxWordLimit = 100;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = () => {
        if (!socket) return;
        socket.emit("submitAnswer", { answer: text });
        dispatch(setCurrentStage('AwaitingResponses'));
    };

    return (
        <div>
            <h1>Answering Screen</h1>
            <h2>Question: {question}</h2>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder={`Enter your response (max ${maxWordLimit} words)`}
                maxLength={maxWordLimit}
                rows={5}
                cols={50}
                style={{ color: "black" }}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Answering;