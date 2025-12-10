"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      {children}
    </motion.div>
  );
};
