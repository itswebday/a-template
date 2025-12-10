"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper } from "@/components/animations";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import type { Media } from "@/payload-types";

type CardProps = {
  className?: string;
  button?:
    | (Omit<
        ButtonLinkProps,
        "children" | "className" | "onClick" | "target"
      > & {
        centered?: boolean | null;
        href?: string;
        newTab?: boolean | null;
        text?: string | null;
      })
    | null;
  dark?: boolean | null;
  delay?: number;
  icon?: Media | null;
  renderedText?: ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  button,
  dark = false,
  delay = 0,
  icon,
  renderedText,
}) => {
  return (
    <AnimatedWrapper
      className={twMerge("h-full", className)}
      delay={delay}
      direction="up"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={twMerge(
          "flex flex-col gap-6 h-full",
          "p-6 md:p-8",
          "rounded-[25px]",
          "border",
          dark
            ? twMerge(
                "bg-white/5 border-white/10 hover:bg-white/10",
                "hover:shadow-lg hover:shadow-primary-purple/10",
              )
            : twMerge(
                "bg-white border-primary-purple/20",
                "hover:bg-primary-lightpurple/5 hover:shadow-xl",
                "hover:shadow-primary-purple/5",
              ),
          "transition-all duration-300",
        )}
      >
        {icon && "url" in icon && icon.url && (
          <div
            className={twMerge(
              "flex items-center justify-center w-16 h-16 rounded-full",
              dark ? "bg-primary-purple/20" : "bg-primary-purple/10",
            )}
          >
            <span className="relative block h-8 w-8">
              <Image
                className="object-contain"
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                  icon.url as string
                }`}
                alt={("alt" in icon && icon.alt) || ""}
                fill={true}
                sizes="32px"
                loading="lazy"
              />
            </span>
          </div>
        )}

        {renderedText && (
          <div
            className={twMerge(
              "text-[15px] leading-relaxed",
              dark ? "text-white/90" : "text-dark/90",
            )}
          >
            {renderedText}
          </div>
        )}

        {button && button.text && button.href && (
          <div
            className={twMerge("mt-auto w-fit", button.centered && "mx-auto")}
          >
            <ButtonLink
              href={button.href}
              variant={button.variant as ButtonLinkProps["variant"]}
              target={button.newTab ? "_blank" : "_self"}
            >
              {button.text}
            </ButtonLink>
          </div>
        )}
      </motion.div>
    </AnimatedWrapper>
  );
};

export default Card;
