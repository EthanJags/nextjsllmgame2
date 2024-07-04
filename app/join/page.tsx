"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";

let socket: Socket;

export default function Join() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");


  useEffect(() => {
    if (!player.name || !socket) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, []);


  return (
    <div>
      <h1>Welcome, {player.name}!</h1>
      <input
        type="number"
        id="codeInput"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here"
      />
      <button type="submit">Submit</button>
    </div>
  );
}
