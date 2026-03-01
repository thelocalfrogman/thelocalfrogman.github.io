"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// --- Types ---
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameState = "start" | "playing" | "gameover" | "won";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_COUNT = 20;
const DUCA_LETTERS = ["D", "U", "C", "A"] as const;
const BASE_SPEED = 150;
const SPEED_INCREASE = 20;

// --- Confetti particle ---
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [canvasSize, setCanvasSize] = useState(600);

  // Refs for game loop values (avoid stale closures)
  const snakeRef = useRef<Position[]>([
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 },
  ]);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Position>({ x: 5, y: 5 });
  const currentLetterIndexRef = useRef(0);
  const collectedRef = useRef<string[]>([]);
  const gameStateRef = useRef<GameState>("start");
  const speedRef = useRef(BASE_SPEED);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number>(0);
  const pulseRef = useRef(0);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const confettiFrameRef = useRef<number>(0);

  // Keep refs in sync with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // --- Canvas sizing ---
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const maxSize = Math.min(600, containerWidth - 32);
        setCanvasSize(Math.max(280, maxSize));
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cellPixelSize = canvasSize / CELL_COUNT;

  // --- Place food in a random empty cell ---
  const placeFood = useCallback(() => {
    const snake = snakeRef.current;
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  // --- Reset game ---
  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 12, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 10 },
    ];
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    currentLetterIndexRef.current = 0;
    collectedRef.current = [];
    speedRef.current = BASE_SPEED;
    setCollectedLetters([]);
    setScore(0);
    setConfettiParticles([]);
    confettiRef.current = [];
    placeFood();
  }, [placeFood]);

  // --- Draw the game ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellPx = canvas.width / CELL_COUNT;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = "rgba(51, 255, 51, 0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CELL_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellPx, 0);
      ctx.lineTo(i * cellPx, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellPx);
      ctx.lineTo(canvas.width, i * cellPx);
      ctx.stroke();
    }

    // Snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#55ff55" : "#33ff33";
      ctx.shadowColor = "#33ff33";
      ctx.shadowBlur = isHead ? 12 : 6;
      const padding = 1;
      ctx.fillRect(
        segment.x * cellPx + padding,
        segment.y * cellPx + padding,
        cellPx - padding * 2,
        cellPx - padding * 2
      );
      // Darker inner for depth
      if (!isHead) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(
          segment.x * cellPx + padding + 2,
          segment.y * cellPx + padding + 2,
          cellPx - padding * 2 - 4,
          cellPx - padding * 2 - 4
        );
      }
    });
    ctx.shadowBlur = 0;

    // Food letter with pulsing glow
    const food = foodRef.current;
    const letterIndex = currentLetterIndexRef.current;
    if (letterIndex < DUCA_LETTERS.length) {
      const letter = DUCA_LETTERS[letterIndex];
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7;

      // Glow circle behind letter
      const gradient = ctx.createRadialGradient(
        food.x * cellPx + cellPx / 2,
        food.y * cellPx + cellPx / 2,
        0,
        food.x * cellPx + cellPx / 2,
        food.y * cellPx + cellPx / 2,
        cellPx * 1.2
      );
      gradient.addColorStop(0, `rgba(214, 72, 255, ${0.4 * pulse})`);
      gradient.addColorStop(1, "rgba(214, 72, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        food.x * cellPx - cellPx * 0.3,
        food.y * cellPx - cellPx * 0.3,
        cellPx * 1.6,
        cellPx * 1.6
      );

      // Letter text
      ctx.fillStyle = `rgba(214, 72, 255, ${pulse * 0.9 + 0.1})`;
      ctx.shadowColor = "#d648ff";
      ctx.shadowBlur = 15 * pulse;
      ctx.font = `bold ${cellPx * 0.75}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        letter,
        food.x * cellPx + cellPx / 2,
        food.y * cellPx + cellPx / 2 + 1
      );
      ctx.shadowBlur = 0;
    }

    pulseRef.current += 0.08;
  }, []);

  // --- Game tick ---
  const tick = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const snake = [...snakeRef.current];
    directionRef.current = nextDirectionRef.current;
    const head = { ...snake[0] };

    switch (directionRef.current) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
      setGameState("gameover");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameState("gameover");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    snake.unshift(head);

    // Check food
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      // Ate a letter
      const letterIndex = currentLetterIndexRef.current;
      const letter = DUCA_LETTERS[letterIndex];
      const newCollected = [...collectedRef.current, letter];
      collectedRef.current = newCollected;
      currentLetterIndexRef.current = letterIndex + 1;
      setCollectedLetters([...newCollected]);
      setScore(newCollected.length + snake.length);

      // Speed up
      speedRef.current = Math.max(50, BASE_SPEED - newCollected.length * SPEED_INCREASE);

      // Restart interval with new speed
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Check win
      if (newCollected.length >= DUCA_LETTERS.length) {
        setGameState("won");
        snakeRef.current = snake;
        return;
      }

      // Place next food
      placeFood();

      // New interval
      intervalRef.current = setInterval(tick, speedRef.current);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    setScore(collectedRef.current.length + snake.length);
  }, [placeFood]);

  // --- Start game ---
  const startGame = useCallback(() => {
    resetGame();
    setGameState("playing");

    // Start tick loop
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, speedRef.current);
  }, [resetGame, tick]);

  // --- Render loop (animation) ---
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      draw();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // --- Cleanup interval on unmount ---
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // --- Confetti animation for win ---
  useEffect(() => {
    if (gameState !== "won") {
      if (confettiFrameRef.current) cancelAnimationFrame(confettiFrameRef.current);
      return;
    }

    // Generate particles
    const colors = ["#33ff33", "#d648ff", "#ff3366", "#33ccff", "#ffcc33", "#ff6633"];
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        id: i,
        x: canvasSize / 2,
        y: canvasSize / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
      });
    }
    confettiRef.current = particles;
    setConfettiParticles([...particles]);

    let running = true;
    const animateConfetti = () => {
      if (!running) return;
      const p = confettiRef.current;
      let anyAlive = false;
      for (const particle of p) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.15;
        particle.life -= 0.008;
        if (particle.life > 0) anyAlive = true;
      }
      setConfettiParticles([...p]);
      if (anyAlive) {
        confettiFrameRef.current = requestAnimationFrame(animateConfetti);
      }
    };
    confettiFrameRef.current = requestAnimationFrame(animateConfetti);

    return () => {
      running = false;
      cancelAnimationFrame(confettiFrameRef.current);
    };
  }, [gameState, canvasSize]);

  // --- Key handler ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (gameState === "start" || gameState === "gameover" || gameState === "won") {
          startGame();
          return;
        }
      }

      if (gameState !== "playing") return;

      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (dir !== "DOWN") nextDirectionRef.current = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (dir !== "UP") nextDirectionRef.current = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (dir !== "RIGHT") nextDirectionRef.current = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (dir !== "LEFT") nextDirectionRef.current = "RIGHT";
          break;
      }
    },
    [gameState, startGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- Touch controls ---
  const handleDirection = useCallback(
    (dir: Direction) => {
      if (gameState !== "playing") return;
      const current = directionRef.current;
      if (
        (dir === "UP" && current !== "DOWN") ||
        (dir === "DOWN" && current !== "UP") ||
        (dir === "LEFT" && current !== "RIGHT") ||
        (dir === "RIGHT" && current !== "LEFT")
      ) {
        nextDirectionRef.current = dir;
      }
    },
    [gameState]
  );

  const handleTapStart = useCallback(() => {
    if (gameState === "start" || gameState === "gameover" || gameState === "won") {
      startGame();
    }
  }, [gameState, startGame]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center w-full max-w-[700px] mx-auto px-4 py-8 select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      {/* Title */}
      <h1
        className="text-3xl sm:text-4xl font-bold tracking-widest mb-4"
        style={{
          color: "#33ff33",
          textShadow: "0 0 20px rgba(51,255,51,0.5), 0 0 40px rgba(51,255,51,0.2)",
        }}
      >
        DUCA SNAKE
      </h1>

      {/* Collected letters */}
      <div className="flex items-center gap-2 mb-4 text-sm sm:text-base">
        <span style={{ color: "#33ff33", opacity: 0.7 }}>COLLECTED:</span>
        <div className="flex gap-1">
          {DUCA_LETTERS.map((letter, i) => {
            const isCollected = collectedLetters.includes(letter);
            return (
              <span
                key={letter}
                className="text-lg sm:text-xl font-bold px-1"
                style={{
                  color: isCollected ? "#33ff33" : "#333",
                  textShadow: isCollected
                    ? "0 0 10px rgba(51,255,51,0.8)"
                    : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
        <span className="ml-4" style={{ color: "#33ff33", opacity: 0.7 }}>
          SCORE: {score}
        </span>
      </div>

      {/* Canvas container */}
      <div
        className="relative"
        style={{
          width: canvasSize,
          height: canvasSize,
          border: "1px solid rgba(51, 255, 51, 0.3)",
          boxShadow:
            "0 0 20px rgba(51, 255, 51, 0.15), 0 0 60px rgba(51, 255, 51, 0.05), inset 0 0 20px rgba(0, 0, 0, 0.5)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{ display: "block", width: canvasSize, height: canvasSize }}
        />

        {/* CRT scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            zIndex: 2,
          }}
        />

        {/* Start screen overlay */}
        {gameState === "start" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
            onClick={handleTapStart}
          >
            <div
              className="text-4xl sm:text-5xl font-bold tracking-widest mb-2"
              style={{
                color: "#33ff33",
                textShadow: "0 0 30px rgba(51,255,51,0.6)",
              }}
            >
              DUCA
            </div>
            <div
              className="text-2xl sm:text-3xl font-bold tracking-widest mb-8"
              style={{
                color: "#d648ff",
                textShadow: "0 0 20px rgba(214,72,255,0.5)",
              }}
            >
              SNAKE
            </div>
            <div className="text-xs sm:text-sm mb-2" style={{ color: "#33ff33", opacity: 0.7 }}>
              Collect D - U - C - A to win!
            </div>
            <div
              className="text-sm sm:text-base animate-pulse mt-4"
              style={{ color: "#33ff33" }}
            >
              Press ENTER or tap to start
            </div>
            <div className="text-xs mt-6" style={{ color: "#33ff33", opacity: 0.4 }}>
              Arrow keys / WASD to move
            </div>
          </div>
        )}

        {/* Game over screen overlay */}
        {gameState === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
            onClick={handleTapStart}
          >
            <div
              className="text-3xl sm:text-4xl font-bold tracking-widest mb-4"
              style={{
                color: "#ff3333",
                textShadow: "0 0 20px rgba(255,51,51,0.5)",
              }}
            >
              GAME OVER
            </div>
            <div className="text-lg mb-2" style={{ color: "#33ff33" }}>
              SCORE: {score}
            </div>
            <div className="flex gap-1 mb-6">
              {DUCA_LETTERS.map((letter) => {
                const isCollected = collectedLetters.includes(letter);
                return (
                  <span
                    key={letter}
                    className="text-xl font-bold px-1"
                    style={{
                      color: isCollected ? "#33ff33" : "#333",
                      textShadow: isCollected
                        ? "0 0 10px rgba(51,255,51,0.8)"
                        : "none",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
            <div
              className="text-sm animate-pulse"
              style={{ color: "#33ff33" }}
            >
              Press ENTER or tap to restart
            </div>
          </div>
        )}

        {/* Win screen overlay */}
        {gameState === "won" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
            onClick={handleTapStart}
          >
            {/* Confetti particles */}
            {confettiParticles
              .filter((p) => p.life > 0)
              .map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    opacity: Math.max(0, p.life),
                    boxShadow: `0 0 6px ${p.color}`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            <div
              className="text-2xl sm:text-3xl font-bold tracking-widest mb-2"
              style={{
                color: "#33ff33",
                textShadow: "0 0 30px rgba(51,255,51,0.6)",
              }}
            >
              YOU SPELLED
            </div>
            <div
              className="text-4xl sm:text-5xl font-bold tracking-widest mb-4"
              style={{
                color: "#d648ff",
                textShadow: "0 0 30px rgba(214,72,255,0.6)",
              }}
            >
              DUCA!
            </div>
            <div className="text-lg mb-6" style={{ color: "#33ff33" }}>
              SCORE: {score}
            </div>
            <div
              className="text-sm animate-pulse"
              style={{ color: "#33ff33" }}
            >
              Press ENTER or tap to play again
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      <div className="mt-6 sm:hidden">
        <div className="flex flex-col items-center gap-1">
          {/* Up button */}
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDirection("UP");
            }}
            className="w-16 h-16 flex items-center justify-center rounded-lg active:opacity-70 transition-opacity"
            style={{
              background: "rgba(51, 255, 51, 0.1)",
              border: "1px solid rgba(51, 255, 51, 0.3)",
              color: "#33ff33",
              fontSize: 24,
            }}
            aria-label="Move up"
          >
            &#9650;
          </button>
          {/* Left, Down, Right row */}
          <div className="flex gap-1">
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirection("LEFT");
              }}
              className="w-16 h-16 flex items-center justify-center rounded-lg active:opacity-70 transition-opacity"
              style={{
                background: "rgba(51, 255, 51, 0.1)",
                border: "1px solid rgba(51, 255, 51, 0.3)",
                color: "#33ff33",
                fontSize: 24,
              }}
              aria-label="Move left"
            >
              &#9664;
            </button>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirection("DOWN");
              }}
              className="w-16 h-16 flex items-center justify-center rounded-lg active:opacity-70 transition-opacity"
              style={{
                background: "rgba(51, 255, 51, 0.1)",
                border: "1px solid rgba(51, 255, 51, 0.3)",
                color: "#33ff33",
                fontSize: 24,
              }}
              aria-label="Move down"
            >
              &#9660;
            </button>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirection("RIGHT");
              }}
              className="w-16 h-16 flex items-center justify-center rounded-lg active:opacity-70 transition-opacity"
              style={{
                background: "rgba(51, 255, 51, 0.1)",
                border: "1px solid rgba(51, 255, 51, 0.3)",
                color: "#33ff33",
                fontSize: 24,
              }}
              aria-label="Move right"
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-xs text-center" style={{ color: "#33ff33", opacity: 0.3 }}>
        {">"} DUCA_SNAKE v1.0 // Deakin University Cyber Association
      </div>
    </div>
  );
}

export default SnakeGame;
