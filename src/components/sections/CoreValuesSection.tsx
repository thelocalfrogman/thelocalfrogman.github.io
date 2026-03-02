"use client";
import { motion } from "framer-motion";
import { CardSpotlight } from "@ui/card-spotlight";
import { SectionHeading } from "@ui/section-heading";

const coreValues = [
  {
    title: "Inspiration",
    description: "Empowering members to explore and grow together.",
    icon: "✨",
    color: "#d648ff",
  },
  {
    title: "Innovation",
    description: "Driving creative solutions for cybersecurity's future.",
    icon: "💡",
    color: "#00d1b7",
  },
  {
    title: "Inclusivity",
    description: "Building a welcoming and diverse community.",
    icon: "🤗",
    color: "#7c3aed",
  },
  {
    title: "Collaboration",
    description: "Strengthening teamwork to achieve shared goals.",
    icon: "🤝",
    color: "#06b6d4",
  },
  {
    title: "Development",
    description: "Preparing students for professional industry success.",
    icon: "📈",
    color: "#ec4899",
  },
  {
    title: "Leadership",
    description: "Inspiring tomorrow's cybersecurity leaders and innovators.",
    icon: "👑",
    color: "#f59e0b",
  },
];

export const CoreValuesSection = () => {
  return (
    <section className="py-24 section-themed relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Our Core Values"
          subtitle="The principles that guide everything we do at DUCA"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {coreValues.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <CardSpotlight
                radius={300}
                color={value.color}
                className="h-full"
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
