"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const FormAnimatedBackground: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);

    return () => clearTimeout(timer);
  }, []);

  const MovingCircles: React.FC = () => {
    const circles = [
      {
        size: 280,
        left: "2%",
        top: "4%",
        color: "rgb(140, 82, 254)",
        opacity: 0.08,
        dx: -15,
        dy: 10,
        dur: 30,
      },
      {
        size: 240,
        left: "78%",
        top: "10%",
        color: "rgb(159, 122, 234)",
        opacity: 0.06,
        dx: 10,
        dy: -12,
        dur: 35,
      },
    ];

    return (
      <div className="z-0 absolute inset-0 pointer-events-none">
        {circles.map((c, i) => (
          <motion.div
            key={`mc-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: c.size,
              height: c.size,
              left: c.left,
              top: c.top,
              background: c.color,
              opacity: c.opacity,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, c.dx, 0],
                    y: [0, c.dy, 0],
                    opacity: [
                      c.opacity,
                      Math.min(c.opacity + 0.05, 0.35),
                      c.opacity,
                    ],
                  }
            }
            transition={{
              duration: c.dur,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    );
  };

  const TinyCircles: React.FC = () => {
    const positions = [
      { left: "8%", top: "12%" },
      { left: "85%", top: "18%" },
      { left: "15%", top: "45%" },
      { left: "72%", top: "38%" },
      { left: "28%", top: "68%" },
      { left: "88%", top: "62%" },
    ];
    const dots = Array.from({ length: 6 }).map((_, i) => ({
      size: 6 + (i % 3) * 2,
      left: positions[i].left,
      top: positions[i].top,
      color: i % 2 === 0 ? "rgb(140, 82, 254)" : "rgb(159, 122, 234)",
      delay: (i % 5) * 0.5,
      dur: 5 + (i % 3) * 1,
      dx: (i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 2),
      dy: (i % 2 === 0 ? -1 : 1) * (6 + ((i + 1) % 3) * 2),
    }));

    return (
      <div className="z-10 absolute inset-0 pointer-events-none">
        {dots.map((d, i) => (
          <motion.div
            key={`td-${i}`}
            className="absolute rounded-full"
            style={{
              width: d.size,
              height: d.size,
              left: d.left,
              top: d.top,
              background: d.color,
              opacity: 0.25,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, d.dx, 0],
                    y: [0, d.dy, 0],
                    opacity: [0.15, 0.6, 0.15],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={{
              duration: d.dur,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: "easeInOut",
              delay: d.delay,
            }}
          />
        ))}
      </div>
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <MovingCircles />
      <TinyCircles />
    </>
  );
};

export default FormAnimatedBackground;
