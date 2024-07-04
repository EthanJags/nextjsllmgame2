"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/constants/reduxTypes";
import { getSocket } from "../functions/socketManager";
import Responding from "../components/gameScreens/Responding";


export default function Game() {
  const router = useRouter();
  const socket = getSocket();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useSelector((state: RootState) => state.game);

    useEffect(() => {
    if (!player || !socket || !game) {
      router.push("/");
    } else {
        setIsLoading(false);
    }
}, [player, game, socket]);

if (isLoading) {
    return <h1>Loading...</h1>;
}

  return (
    <div>
      <h1>Game</h1>
      <Responding />
    </div>
  )};