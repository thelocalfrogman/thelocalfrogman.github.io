"use client";
import { motion } from "framer-motion";
import { FlipWords } from "@ui/flip-words";
import { Button } from "@ui/button";
import { SpotlightNew } from "@ui/spotlight";

export const AboutHeroSection = () => {
  const words = ["Inspiration", "Innovation", "Inclusivity", "Collaboration", "Development", "Leadership"];

  return (
    <section id="about-hero" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={{ background: 'var(--theme-bg)' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-transparent" />
      <SpotlightNew className="-top-40 right-0 md:right-60 md:-top-20" fill="#00d1b7" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">DUCA</span>
          </h1>

          <div className="text-2xl md:text-4xl text-gray-300 mb-8 flex items-center justify-center flex-wrap">
            <span>We believe in</span>
            <FlipWords words={words} className="text-cyan-400 font-bold" duration={2500} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Your gateway to hands-on learning, professional connections, and a supportive cybersecurity community!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button href="https://dusa.org.au/clubs/duca" variant="primary">
              Join DUCA via DUSA
            </Button>
            <Button href="#team" variant="outline">
              Meet the Team
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
