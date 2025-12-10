"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type CookieNotificationProps = {
  className?: string;
};

const CookieNotification: React.FC<CookieNotificationProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cookiePolicyT = useTranslations("cookiePolicy");
  const generalT = useTranslations("general");

  useEffect(() => {
    if (!localStorage.getItem("cookieAccepted")) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieAccepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "z-98 fixed left-0 right-0 bottom-0",
        "bg-white/95 backdrop-blur-sm",
        "border-t-2 border-primary-purple/30",
        "shadow-lg shadow-primary-purple/10",
        className,
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-4",
          "w-11/12 max-w-7xl py-6 mx-auto",
          "de:flex-row de:items-center de:justify-between de:gap-6",
        )}
      >
        {/* Text */}
        <p
          className={twMerge(
            "flex-1 text-[14px] leading-relaxed text-dark/90",
            "de:text-[15px]",
          )}
        >
          {generalT("cookieNotification")}{" "}
          <Link
            className={twMerge(
              "font-medium text-primary-purple",
              "hover:text-primary-lightpurple",
              "transition-colors duration-200",
              "underline underline-offset-2",
            )}
            href={cookiePolicyT("href")}
            prefetch={true}
          >
            {generalT("cookiePolicy")}
          </Link>
          .
        </p>

        {/* Buttons */}
        <div className={twMerge("flex gap-3 shrink-0", "de:gap-4")}>
          {/* Decline button */}
          <button
            className={twMerge(
              "px-6 py-2.5 rounded-full",
              "text-[14px] font-medium text-dark",
              "border-2 border-primary-purple/30",
              "bg-white hover:bg-primary-purple/5",
              "hover:border-primary-purple/50",
              "transition-all duration-200",
            )}
            onClick={handleDecline}
          >
            {generalT("decline")}
          </button>

          {/* Accept button */}
          <button
            className={twMerge(
              "px-6 py-2.5 rounded-full",
              "text-[14px] font-medium text-white",
              "bg-primary-purple hover:bg-primary-lightpurple",
              "transition-colors duration-200",
            )}
            onClick={handleAccept}
          >
            {generalT("accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieNotification;
