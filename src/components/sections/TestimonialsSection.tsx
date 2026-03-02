"use client";
import { InfiniteMovingCards } from "@ui/infinite-moving-cards";
import { SectionHeading } from "@ui/section-heading";

const testimonials = [
  {
    quote:
      "DUCA has been instrumental in my cybersecurity journey. The workshops and CTF events have given me practical skills that I use every day in my internship.",
    name: "Sarah Chen",
    title: "Cybersecurity Intern @ CyberCX",
    image: "/testimonials/sarah.jpg",
  },
  {
    quote:
      "The community at DUCA is amazing. I've made lifelong friends and professional connections that have helped me land my dream job.",
    name: "Marcus Williams",
    title: "Security Analyst @ Telstra",
    image: "/testimonials/marcus.jpg",
  },
  {
    quote:
      "As a beginner, I was nervous about joining. But DUCA welcomes everyone regardless of skill level. The mentorship I received was invaluable.",
    name: "Emily Rodriguez",
    title: "Computer Science Student",
    image: "/testimonials/emily.jpg",
  },
  {
    quote:
      "The CTF competitions organised by DUCA are top-notch. They've helped me develop problem-solving skills that set me apart in job interviews.",
    name: "James Liu",
    title: "Graduate Security Engineer",
    image: "/testimonials/james.jpg",
  },
  {
    quote:
      "DUCA's industry nights connected me with mentors who guided my career transition into cybersecurity. Couldn't have done it without them!",
    name: "Priya Sharma",
    title: "Penetration Tester @ Deloitte",
    image: "/testimonials/priya.jpg",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 section-themed relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Why join us?"
          subtitle="Hear from our members about their experiences with DUCA"
        />

        <div className="mt-12">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
