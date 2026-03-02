"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, value, rounded]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatCard = ({ value, suffix, label, sublabel }: StatProps) => {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
      className="text-center p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-purple-500/50 transition-colors"
    >
      <div className="text-5xl md:text-6xl font-bold text-white mb-2">
        {isInView ? <AnimatedCounter value={value} suffix={suffix} /> : `0${suffix}`}
      </div>
      <div className="text-xl text-purple-400 font-medium">{label}</div>
      <div className="text-gray-500 text-sm mt-1">{sublabel}</div>
    </motion.div>
  );
};

export const StatsSection = ({
  memberCount = 750,
}: {
  memberCount?: number;
}) => {
  return (
    <section className="py-24 section-themed relative overflow-hidden data-stream-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          DUCA by the{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            numbers
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            value={memberCount}
            suffix="+"
            label="Members"
            sublabel="Active community"
          />
          <StatCard
            value={50}
            suffix="+"
            label="Events"
            sublabel="This year"
          />
          <StatCard
            value={20}
            suffix="+"
            label="Workshops"
            sublabel="Hands-on learning"
          />
          <StatCard
            value={100}
            suffix="%"
            label="Free"
            sublabel="Always welcome"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
