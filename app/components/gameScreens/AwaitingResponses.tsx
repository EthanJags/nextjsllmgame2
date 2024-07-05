import React, { use, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@/app/store/constants/reduxTypes';
import { useSocketEvent } from '@/app/functions/useSocketEvent';
import { setAnswers, setCurrentStage } from '@/app/store/slices/gameSlice';

const AwaitingResponses: React.FC<{
  socket: Socket
}> = ({ socket }) => {
    const dispatch = useAppDispatch();
    const question = useAppSelector((state) => state.game.currentQuestion);
    if (!socket) return <h1>Socket is undefined</h1>;


    useSocketEvent(socket, 'allPlayersAnswered', (randomizedAnswers: Game['answers']) => {
        dispatch(setAnswers(randomizedAnswers));
        dispatch(setCurrentStage('Choosing'));
    })

    return (
        <div>
            <h1>Answer Submitted</h1>
            <h2>Question: {question}</h2>
        </div>
    );
};

export default AwaitingResponses;