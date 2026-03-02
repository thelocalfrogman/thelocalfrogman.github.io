"use client";
import { StickyScroll } from "@ui/sticky-scroll-reveal";

const content = [
  {
    title: "Hands-On Learning",
    description:
      "DUCA transforms curiosity into expertise through practical experiences. From Capture the Flag challenges to career-focused workshops, we provide opportunities for real-world application of classroom learning.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <div className="text-center p-4">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-sm opacity-80">Learn by doing</p>
        </div>
      </div>
    ),
  },
  {
    title: "Industry Partnerships",
    description:
      "Our focus on industry partnerships provides members with direct pathways to mentorship, internships, and career opportunities. We bridge the gap between education and professional readiness.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <div className="text-center p-4">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-sm opacity-80">Connect with professionals</p>
        </div>
      </div>
    ),
  },
  {
    title: "Community Building",
    description:
      "We create a dynamic, supportive, and inclusive environment where every member can learn, lead, and innovate. Our community is built on collaboration and mutual support.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <div className="text-center p-4">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-sm opacity-80">Grow together</p>
        </div>
      </div>
    ),
  },
  {
    title: "Career Development",
    description:
      "We equip members with the skills and confidence they need for career success. From preparing for industry certifications to landing your first cybersecurity role, we support you at every step.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <div className="text-center p-4">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-sm opacity-80">Launch your career</p>
        </div>
      </div>
    ),
  },
];

export const WhatWeDoDetailSection = () => {
  return (
    <section className="py-24 section-themed">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          What We Do
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Discover how DUCA empowers students to become cybersecurity professionals
        </p>
        <StickyScroll content={content} />
      </div>
    </section>
  );
};

export default WhatWeDoDetailSection;
