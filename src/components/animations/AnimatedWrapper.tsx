"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimatedWrapperProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "down" | "left" | "right" | "up";
};

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  className,
  delay = 0,
  direction = "up",
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  const getInitialProps = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 };
      case "down":
        return { opacity: 0, y: -20 };
      case "left":
        return { opacity: 0, x: -20 };
      case "right":
        return { opacity: 0, x: 20 };
      default:
        return { opacity: 0, y: 20 };
    }
  };

  return (
    <motion.div
      className={className}
      ref={ref}
      initial={getInitialProps()}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : getInitialProps()}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
