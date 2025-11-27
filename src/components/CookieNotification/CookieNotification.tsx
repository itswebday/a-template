"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CookieNotificationProps {
  className?: string;
}

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
      className={`
        z-100 fixed left-0 right-0 bottom-0 bg-white
        border-t border-gray-200 shadow-md
        ${className}
      `}
    >
      {/* Container */}
      <div
        className={`
          flex flex-col justify-between items-start gap-4
          w-11/12 max-w-300 py-4 mx-auto
          md:flex-row md:items-center
        `}
      >
        {/* Notification */}
        <span className="flex-1">
          {generalT("cookieNotification")}{" "}
          <Link
            className="text-blue-600 hover:underline"
            href={cookiePolicyT("href")}
            prefetch={true}
          >
            {generalT("cookiePolicy")}
          </Link>
          .
        </span>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Decline button */}
          <button
            className={`
              px-4 py-2 border border-gray-200 rounded-md
              transition-colors duration-200 hover:bg-gray-100
            `}
            onClick={handleDecline}
          >
            {generalT("decline")}
          </button>

          {/* Accept button */}
          <button
            className={`
              px-4 py-2 text-white bg-black rounded-md
              transition-opacity duration-200 hover:opacity-80
            `}
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
