"use client";

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";

let socket: Socket;

export default function Home() {
  const [name, setName] = useState<string>("");

  return (
    <div>
      <h1>Welcome, to the LLM Game!</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ color: "black" }}
      />
      <Link
        href={{
          pathname: "/host",
          query: { name: name },
        }}
      >
        <button>Host</button>
      </Link>
      <Link
        href={{
          pathname: "/Join",
          query: { name: name },
        }}
      >
        <button>Join</button>
      </Link>
    </div>
  );
}
