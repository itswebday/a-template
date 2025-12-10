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
        "border-t border-primary-purple/20 bg-white shadow-md",
        className,
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col justify-between items-start gap-4",
          "w-11/12 max-w-300 py-4 mx-auto text-[14px]",
          "md:flex-row md:items-center",
        )}
      >
        {/* Text */}
        <span className="flex-1">
          {generalT("cookieNotification")}{" "}
          <Link
            className="text-primary-purple hover:underline"
            href={cookiePolicyT("href")}
            prefetch={true}
          >
            {generalT("cookiePolicy")}
          </Link>
          .
        </span>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className={twMerge(
              "rounded-md border border-primary-purple/20 px-4 py-2",
              "transition-colors duration-200",
              "hover:bg-primary-lightpurple/5",
            )}
            onClick={handleDecline}
          >
            {generalT("decline")}
          </button>

          <button
            className={twMerge(
              "rounded-md px-4 py-2 bg-dark text-white",
              "transition-opacity duration-200",
              "hover:opacity-80",
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
