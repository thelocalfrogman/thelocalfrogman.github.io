"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

interface Partner {
  name: string;
  logo: string;
  href?: string;
}

export const LogoCarousel = ({
  partners,
  className,
  speed = 30,
}: {
  partners: Partner[];
  className?: string;
  speed?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 1;
      if (scrollContainer.scrollWidth / 2 <= scrollPos) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    const intervalId = setInterval(() => {
      cancelAnimationFrame(animationId);
      scroll();
    }, speed);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className={cn("w-full overflow-hidden bg-black/20 py-8", className)}>
      <div
        ref={scrollRef}
        className="flex items-center gap-12 overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedPartners.map((partner, idx) => (
          <a
            key={`${partner.name}-${idx}`}
            href={partner.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:drop-shadow-[0_0_12px_rgba(214,72,255,0.5)]"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-12 w-auto object-contain transition-all duration-300 hover:brightness-125"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export const InfiniteLogoCarousel = ({
  partners,
  className,
  direction = "left",
  speed = "normal",
}: {
  partners: Partner[];
  className?: string;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--animation-direction",
          direction === "left" ? "forwards" : "reverse"
        );

        const speedMap = { fast: "20s", normal: "40s", slow: "80s" };
        containerRef.current.style.setProperty(
          "--animation-duration",
          speedMap[speed]
        );
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        ref={scrollerRef}
        className="flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap animate-scroll"
      >
        {partners.map((partner, idx) => (
          <a
            key={`${partner.name}-${idx}`}
            href={partner.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_12px_rgba(214,72,255,0.5)] px-4"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-16 w-auto object-contain transition-all duration-300 hover:brightness-125"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
