"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

interface StackingCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const StackingCards = ({
  cards,
  className,
}: {
  cards: StackingCard[];
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const height = cards.length * 35 + 30;
    setContainerHeight(height);
  }, [cards.length]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: `${containerHeight}vh` }}
    >
      <div className="sticky top-24 h-[70vh] flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-auto px-4 h-[400px]">
          {cards.map((card, index) => (
            <StackingCardItem
              key={card.title}
              card={card}
              index={index}
              totalCards={cards.length}
              containerRef={containerRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StackingCardItem = ({
  card,
  index,
  totalCards,
  containerRef,
}: {
  card: StackingCard;
  index: number;
  totalCards: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cardRange = 1 / totalCards;
  const cardStart = index * cardRange;
  const cardPeak = cardStart + cardRange * 0.5;
  const cardEnd = cardStart + cardRange;

  // Card starts below, rises up, then moves up and shrinks as next card comes
  const y = useTransform(
    scrollYProgress,
    [
      Math.max(0, cardStart - cardRange * 0.3),
      cardStart,
      cardPeak,
      Math.min(1, cardEnd + cardRange * 0.5),
    ],
    [100, 0, 0, -30 - index * 15]
  );

  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardPeak, cardEnd],
    [0.95, 1, 0.92 - index * 0.02]
  );

  // Only visible during its range
  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, cardStart - cardRange * 0.2),
      cardStart,
      cardEnd,
      Math.min(1, cardEnd + cardRange * 0.3),
    ],
    [0, 1, 1, index === totalCards - 1 ? 1 : 0]
  );

  return (
    <motion.div
      style={{
        scale,
        y,
        opacity,
        zIndex: totalCards - index + 10,
      }}
      className="absolute inset-x-0 top-0"
    >
      <div
        className="w-full rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
        style={{ backgroundColor: card.bgColor }}
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div
            className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl"
            style={{ backgroundColor: `${card.color}30` }}
          >
            {card.icon}
          </div>
          <div className="flex-1">
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: card.color }}
            >
              {card.title}
            </h3>
            <p className="text-white/90 text-lg leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StackingCards;
