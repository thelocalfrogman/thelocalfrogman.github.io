"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = "idle" | "sending" | "sent" | "error";

export function RetroContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [pongVisible, setPongVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Easter egg: type "ping" in message → show "PONG!"
  useEffect(() => {
    if (message.toLowerCase().includes("ping")) {
      setPongVisible(true);
      const timer = setTimeout(() => setPongVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormState("sending");

    try {
      // Replace FORMSPREE_ID_HERE with your actual Formspree form ID
      const response = await fetch("https://formspree.io/f/FORMSPREE_ID_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setFormState("sent");
        setTimeout(() => {
          setFormState("idle");
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }, 5000);
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
        background: "#0a0a0a",
        border: "1px solid rgba(51, 255, 51, 0.3)",
        boxShadow: "0 0 30px rgba(51, 255, 51, 0.1), inset 0 0 30px rgba(0,0,0,0.5)",
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
              className="flex flex-col items-center justify-center py-16 relative"
            >
              {/* Glow behind message */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(51,255,51,0.3), transparent 60%)`,
                  transition: "background 0.1s ease",
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="relative"
              >
                <p
                  className="font-mono text-3xl font-bold tracking-wider"
                  style={{ color: "#33ff33", textShadow: "0 0 20px rgba(51,255,51,0.5)" }}
                >
                  MESSAGE TRANSMITTED
                </p>
                <p className="font-mono text-sm text-green-700 mt-4 text-center">
                  {">"} Delivery confirmed. Thank you for contacting DUCA.
                </p>
              </motion.div>
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
                  value="duca@deakin.edu.au"
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

              {/* TRANSMIT button with paper plane */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="relative flex items-center gap-3 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    color: "#0a0a0a",
                    backgroundColor: "#33ff33",
                    boxShadow: "0 0 15px rgba(51,255,51,0.3)",
                  }}
                >
                  {formState === "sending" ? (
                    <motion.span
                      animate={!reducedMotion ? { x: [0, 200], y: [0, -100], opacity: [1, 0], rotate: [0, -30] } : {}}
                      transition={{ duration: 0.8, ease: "easeIn" }}
                    >
                      {/* Paper Plane SVG */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </motion.span>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                  <span>TRANSMIT</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RetroContactForm;
