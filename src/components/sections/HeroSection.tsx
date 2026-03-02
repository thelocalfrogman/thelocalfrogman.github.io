"use client";
import { motion } from "framer-motion";
import { TypewriterEffectSmooth } from "@ui/typewriter-effect";
import { EncryptedText } from "@ui/encrypted-text";
import { SpotlightNew } from "@ui/spotlight";
import { Button, GlowingButton } from "@ui/button";

export const HeroSection = () => {
  const words = [
    { text: "Deakin", className: "text-white" },
    { text: "University", className: "text-white" },
    { text: "Cybersecurity", className: "text-white" },
    { text: "Association", className: "text-purple-500" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--theme-bg)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
      <SpotlightNew
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#d648ff"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Encrypted DUCA Title */}
          <h1 className="text-7xl md:text-9xl font-bold mb-4">
            <EncryptedText
              text="DUCA"
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
              speed={40}
              revealDelay={300}
            />
          </h1>

          {/* Typewriter Subtitle */}
          <div className="flex justify-center mb-8">
            <TypewriterEffectSmooth words={words} />
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Building a community of cybersecurity enthusiasts at Deakin University.
            Learn, share, and grow together with Australia's leading student cyber club.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <GlowingButton href="https://dusa.org.au/clubs/duca">
              Join Now
            </GlowingButton>
            <Button variant="outline" href="#what-we-do">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
