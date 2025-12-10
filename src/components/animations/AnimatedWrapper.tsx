"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
      initial={getInitialProps()}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
    >
      {children}
    </motion.div>
  );
};
