"use client";
import { motion } from "framer-motion";
import { StackingCards } from "@ui/stacking-cards";
import { SectionHeading } from "@ui/section-heading";

const whatWeDoCards = [
  {
    title: "Cybersecurity Workshops",
    description:
      "Learn practical cybersecurity skills through hands-on workshops covering topics like ethical hacking, network security, digital forensics, and malware analysis. Our workshops are designed for all skill levels, from complete beginners to advanced practitioners.",
    icon: "🔐",
    color: "#d648ff",
    bgColor: "#1e1033",
  },
  {
    title: "CTF Competitions",
    description:
      "Participate in Capture The Flag events to test your skills against real-world security challenges. Our CTF division trains members and competes in national and international competitions, helping you build practical problem-solving skills.",
    icon: "🚩",
    color: "#ef4444",
    bgColor: "#2d1216",
  },
  {
    title: "Industry Connections",
    description:
      "Meet professionals from leading cybersecurity companies through our networking events, guest lectures, and career panels. Discover internship and job opportunities, get resume reviews, and build relationships that will help launch your career.",
    icon: "🤝",
    color: "#06b6d4",
    bgColor: "#0c2a32",
  },
  {
    title: "Community Building",
    description:
      "Connect with like-minded students passionate about cybersecurity. Share knowledge, collaborate on projects, and build your professional network. Our Discord server has 750+ members ready to help and learn together.",
    icon: "👥",
    color: "#22c55e",
    bgColor: "#0d2818",
  },
  {
    title: "Development Projects",
    description:
      "Work on real software projects with our development division. Build tools, platforms, and applications that serve the club and the broader cybersecurity community. Gain practical coding experience while making an impact.",
    icon: "💻",
    color: "#f97316",
    bgColor: "#2d1a0a",
  },
  {
    title: "Learning Resources",
    description:
      "Access curated learning materials, study guides, and resources to help you excel in your cybersecurity studies and career. From certification prep to specialized tutorials, we've got you covered at every step of your journey.",
    icon: "📚",
    color: "#8b5cf6",
    bgColor: "#1a1433",
  },
];

export const WhatWeDoStackingSection = () => {
  return (
    <section className="section-themed-alt">
      <div className="container mx-auto px-4 pt-24">
        <SectionHeading
          title="What We Do"
          subtitle="Empowering the next generation of cybersecurity professionals through hands-on learning and community"
        />
      </div>

      <StackingCards cards={whatWeDoCards} className="mt-8" />

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="theme-text-secondary text-lg mb-6">
            Ready to start your cybersecurity journey?
          </p>
          <a
            href="/join"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
          >
            Join DUCA Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDoStackingSection;
