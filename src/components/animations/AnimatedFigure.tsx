"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedFigureProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  imageLeft?: boolean;
};

export const AnimatedFigure: React.FC<AnimatedFigureProps> = ({
  children,
  className,
  delay = 0.2,
  imageLeft = false,
}) => {
  return (
    <motion.figure
      className={className}
      initial={{ opacity: 0, x: imageLeft ? -20 : 20 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {children}
    </motion.figure>
  );
};
