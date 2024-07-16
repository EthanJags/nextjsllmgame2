import React, { useEffect, useRef } from "react";

const quips: string[] = [
  "Why so serious?",
  "May the quips be with you",
  "To quip, or not to quip",
  "I'll be quip",
  "Quip happens",
  "Quip while you're ahead",
  "Get your quip together",
  "Quip on truckin'",
  "Quip it real",
  "Quip me if you can",
  "Stay calm and quip on",
  "Quip like nobody's watching",
  "Too legit to quip",
  "Seize the quip",
  "Quip, quip hooray",
];

class Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  quip: string;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 100 + 50;
    this.speed = Math.random() * 2 + 0.5;
    this.quip = quips[Math.floor(Math.random() * quips.length)];
    this.opacity = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.1})`;
    ctx.fill();

    ctx.font = `${this.size / 5}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.textAlign = "center";
    ctx.fillText(this.quip, this.x, this.y);
  }

  update(canvasHeight: number) {
    this.y -= this.speed;
    this.opacity += 0.005;

    if (this.y + this.size < 0) {
      this.y = canvasHeight + this.size;
      this.opacity = 0;
    }
  }
}

const FloatingQuipsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const bubbles: Bubble[] = [];
    for (let i = 0; i < 20; i++) {
      bubbles.push(new Bubble(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => {
        bubble.update(canvas.height);
        bubble.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, #000033, #000066)",
          zIndex: -1,
        }}
      />
      <style jsx>{`
        canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #000033, #000066);
          z-index: -1;
        }
      `}</style>
    </>
  );
};

export default FloatingQuipsBackground;
