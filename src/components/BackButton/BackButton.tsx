"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type BackButtonProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

const BackButton: React.FC<BackButtonProps> = ({
  children,
  className,
  href,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Link
        className={twMerge(
          "inline-flex items-center gap-3 rounded-xl border-2 border-gray-200",
          "px-6 py-3 bg-white shadow-sm transition-all duration-300",
          "hover:border-primary-purple/50 hover:bg-primary-purple/5",
          "hover:shadow-md group",
        )}
        href={href}
        prefetch={true}
      >
        {/* Arrow icon */}
        <motion.svg
          className="w-5 h-5 text-primary-purple"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ x: 0 }}
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </motion.svg>

        {/* Button text */}
        <span
          className={twMerge(
            "text-[14px] font-semibold text-dark",
            "transition-colors duration-300",
            "group-hover:text-primary-purple",
          )}
        >
          {children}
        </span>
      </Link>
    </motion.div>
  );
};

export default BackButton;
