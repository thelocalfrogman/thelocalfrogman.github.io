"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = "idle" | "sending" | "sent" | "error";

function MatrixRain({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -20);

    let frameId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(12, 18, 32, 0.15)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#33ff33";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = 0.4 + Math.random() * 0.6;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ width, height }}
    />
  );
}

export function RetroContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [pongVisible, setPongVisible] = useState(false);
  const [sentPhase, setSentPhase] = useState<"matrix" | "flash" | "message">("matrix");
  const [containerSize, setContainerSize] = useState({ w: 600, h: 400 });
  const [flyingPlane, setFlyingPlane] = useState(false);
  const [planeStart, setPlaneStart] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Easter egg: type "ping" in message → show "PONG!"
  useEffect(() => {
    if (message.toLowerCase().includes("ping")) {
      setPongVisible(true);
      const timer = setTimeout(() => setPongVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Measure container for matrix rain canvas
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    }
  }, [formState]);

  // Sent animation phases
  useEffect(() => {
    if (formState !== "sent") return;
    setSentPhase("matrix");
    const t1 = setTimeout(() => setSentPhase("flash"), 1200);
    const t2 = setTimeout(() => setSentPhase("message"), 1500);
    const t3 = setTimeout(() => {
      setFormState("idle");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [formState]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormState("sending");

    // Start flying plane animation from button position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPlaneStart({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setFlyingPlane(true);
    }

    try {
      const response = await fetch("https://formspree.io/f/mvzwpgqd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setFormState("sent");
      } else {
        setFormState("error");
        setTimeout(() => setFormState("idle"), 3000);
      }
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative max-w-2xl mx-auto rounded-xl overflow-hidden"
      style={{
        background: "#0c1220",
        border: "1px solid rgba(51, 255, 51, 0.25)",
        boxShadow: "0 0 30px rgba(51, 255, 51, 0.08), inset 0 0 30px rgba(0,0,0,0.3)",
      }}
    >
      {/* CRT Scan Lines Overlay */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />
      )}

      {/* Glow effect that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(51,255,51,0.08), transparent 50%)`,
        }}
      />

      <div className="relative z-20 p-8">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-900/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span
            className="ml-4 font-mono text-sm"
            style={{ color: "#33ff33" }}
          >
            {">"} DUCA_MAIL_CLIENT v2.0{" "}
            <span className="animate-pulse">█</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {formState === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden"
              style={{ minHeight: "300px" }}
            >
              {/* Matrix Rain Canvas */}
              {!reducedMotion && (
                <MatrixRain width={containerSize.w} height={400} />
              )}

              {/* Flash overlay */}
              {sentPhase === "flash" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.3, times: [0, 0.1, 0.7, 1] }}
                  className="absolute inset-0 z-10"
                  style={{ background: "rgba(51, 255, 51, 0.25)" }}
                />
              )}

              {/* ACCESS GRANTED message */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                {(sentPhase === "flash" || sentPhase === "message") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="text-center"
                    style={{
                      textShadow: "0 0 30px rgba(51,255,51,0.8), 0 0 60px rgba(51,255,51,0.4)",
                    }}
                  >
                    <p
                      className="font-mono text-3xl md:text-4xl font-bold tracking-widest mb-2"
                      style={{ color: "#33ff33" }}
                    >
                      ACCESS GRANTED
                    </p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-mono text-lg"
                      style={{ color: "#33ff33", opacity: 0.8 }}
                    >
                      MESSAGE DISPATCHED SUCCESSFULLY
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="font-mono text-sm mt-4"
                      style={{ color: "rgba(51,255,51,0.5)" }}
                    >
                      {">"} Thank you for contacting DUCA. We'll be in touch.
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
              style={{
                opacity: formState === "sending" ? 0.6 : 1,
                transition: "opacity 0.3s",
              }}
            >
              {/* TO field (readonly) */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <label style={{ color: "#33ff33" }} className="w-24 shrink-0 text-right">
                  TO:
                </label>
                <input
                  type="text"
                  value="duca@info.au"
                  readOnly
                  className="flex-1 bg-transparent border-b border-green-900/50 py-2 px-1 font-mono text-sm outline-none"
                  style={{ color: "#33ff33", opacity: 0.6 }}
                />
              </div>

              {/* FROM field */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <label style={{ color: "#33ff33" }} className="w-24 shrink-0 text-right">
                  FROM:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="flex-1 bg-transparent border-b border-green-900/50 py-2 px-1 font-mono text-sm outline-none focus:border-green-500/50 placeholder:text-green-900/60"
                  style={{ color: "#33ff33" }}
                />
              </div>

              {/* REPLY-TO field */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <label style={{ color: "#33ff33" }} className="w-24 shrink-0 text-right">
                  REPLY-TO:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent border-b border-green-900/50 py-2 px-1 font-mono text-sm outline-none focus:border-green-500/50 placeholder:text-green-900/60"
                  style={{ color: "#33ff33" }}
                />
              </div>

              {/* SUBJECT field */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <label style={{ color: "#33ff33" }} className="w-24 shrink-0 text-right">
                  SUBJECT:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  className="flex-1 bg-transparent border-b border-green-900/50 py-2 px-1 font-mono text-sm outline-none focus:border-green-500/50 placeholder:text-green-900/60"
                  style={{ color: "#33ff33" }}
                />
              </div>

              {/* MESSAGE field */}
              <div className="flex gap-2 font-mono text-sm">
                <label
                  style={{ color: "#33ff33" }}
                  className="w-24 shrink-0 text-right pt-2"
                >
                  MESSAGE:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                  rows={6}
                  className="flex-1 bg-transparent border border-green-900/30 rounded py-2 px-3 font-mono text-sm outline-none focus:border-green-500/50 resize-none placeholder:text-green-900/60"
                  style={{ color: "#33ff33" }}
                />
              </div>

              {/* PONG! Easter egg */}
              <AnimatePresence>
                {pongVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-mono text-center py-2"
                    style={{
                      color: "#33ff33",
                      textShadow: "0 0 10px rgba(51,255,51,0.8)",
                    }}
                  >
                    {">"} PONG!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              {formState === "error" && (
                <div
                  className="font-mono text-sm text-center py-2"
                  style={{ color: "#ff3333" }}
                >
                  {">"} ERROR: Transmission failed. Please try again.
                </div>
              )}

              {/* TRANSMIT button */}
              <div className="flex justify-end pt-4">
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={formState === "sending"}
                  className="relative flex items-center gap-3 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    color: "#0a0a0a",
                    backgroundColor: "#33ff33",
                    boxShadow: "0 0 15px rgba(51,255,51,0.3)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: formState === "sending" ? 0 : 1 }}>
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  <span>TRANSMIT</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen flying paper plane */}
      <AnimatePresence>
        {flyingPlane && !reducedMotion && (
          <motion.div
            key="flying-plane"
            initial={{
              position: "fixed",
              left: planeStart.x,
              top: planeStart.y,
              scale: 1,
              rotate: 0,
              opacity: 1,
              zIndex: 9999,
              pointerEvents: "none" as const,
            }}
            animate={{
              left: typeof window !== "undefined" ? window.innerWidth + 100 : 1500,
              top: typeof window !== "undefined" ? -100 : -100,
              scale: [1, 2, 2.5, 2, 0.5],
              rotate: [0, -15, -25, -35, -45],
              opacity: [1, 1, 1, 0.8, 0],
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            onAnimationComplete={() => setFlyingPlane(false)}
            style={{ position: "fixed", zIndex: 9999, pointerEvents: "none" }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="#33ff33"
              style={{
                filter: "drop-shadow(0 0 20px rgba(51,255,51,0.8)) drop-shadow(0 0 40px rgba(51,255,51,0.4))",
              }}
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            {/* Trail particles */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 4 - i * 0.5,
                    height: 4 - i * 0.5,
                    background: "#33ff33",
                    left: -(10 + i * 15),
                    top: 25 + (i % 2 === 0 ? -3 : 3),
                    boxShadow: "0 0 6px rgba(51,255,51,0.6)",
                  }}
                  animate={{ opacity: [0.8, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RetroContactForm;
