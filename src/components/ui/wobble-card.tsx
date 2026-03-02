"use client";
import type { ReactNode, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (clientY - (rect.top + rect.height / 2)) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      className={cn(
        "mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          transform: isHovering
            ? `rotateY(${mousePosition.x * 8}deg) rotateX(${-mousePosition.y * 8}deg) scale3d(1.02, 1.02, 1)`
            : "rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)",
          transition: "transform 0.15s ease-out",
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <div className={cn("h-full px-4 py-20 sm:px-10 relative", className)}>
          <Noise />
          {children}
        </div>
      </motion.div>
    </section>
  );
};

const Noise = () => (
  <div
    className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
    style={{
      backgroundImage: "url(/noise.webp)",
      backgroundSize: "30%",
    }}
  ></div>
);

export default WobbleCard;
