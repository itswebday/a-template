"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  variant: "purpleButton" | "whiteButton" | "darkButton" | "transparentButton";
  target?: "_blank" | "_self";
  onClick?: () => void;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  className,
  href,
  variant,
  target = "_self",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetElement = document.querySelector(href);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    } else {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }

    if (onClick) {
      onClick();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "purpleButton":
        return "text-white bg-primary-purple hover:bg-primary-lightpurple";
      case "whiteButton":
        return "text-dark bg-white hover:bg-primary-lightpurple/10";
      case "darkButton":
        return "text-white bg-dark hover:bg-dark/90";
      case "transparentButton":
        return (
          "text-white bg-dark/50 hover:bg-dark/70 border-2 " +
          "border-white/30 hover:border-white/50 backdrop-blur-sm"
        );
      default:
        return "text-white bg-primary-purple hover:bg-primary-lightpurple";
    }
  };

  return (
    <Link
      className={twMerge(
        "relative inline-flex items-center justify-center",
        "overflow-hidden w-fit px-8 py-3 rounded-full",
        "text-[15px] font-medium",
        getVariantStyles(),
        "transition-all duration-500 ease-in-out",
        isClicked && "pointer-events-none",
        className,
      )}
      href={href}
      prefetch={true}
      target={target}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {variant !== "transparentButton" && (
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, " +
              "rgba(255,255,255,0) 100%)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {variant === "transparentButton" && (
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, " +
              "rgba(255,255,255,0.05) 100%)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{ opacity: 0, scale: 2.5 }}
          initial={{ opacity: 0.6, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      <span className="z-10 relative">{children}</span>
    </Link>
  );
};

export default ButtonLink;
