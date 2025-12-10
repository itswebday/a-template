"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimatedScaleProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const AnimatedScale: React.FC<AnimatedScaleProps> = ({
  children,
  className,
  delay = 0.2,
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

  return (
    <motion.div
      className={className}
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
      }
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
