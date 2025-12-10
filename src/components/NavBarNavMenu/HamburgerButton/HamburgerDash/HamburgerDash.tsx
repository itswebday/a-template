"use client";

import { twMerge } from "tailwind-merge";
import { useNavMenu } from "@/contexts";

type HamburgerDashProps = {
  dashIndex: 0 | 1 | 2;
};

const HamburgerDash: React.FC<HamburgerDashProps> = ({ dashIndex }) => {
  const navMenu = useNavMenu();

  const getDashClasses = () => {
    if (!navMenu.isOpen || navMenu.isClosing) return "";

    switch (dashIndex) {
      case 0:
        return "rotate-45 translate-y-[7px] transition-transform";
      case 1:
        return "opacity-0 transition-opacity";
      case 2:
        return "-rotate-45 -translate-y-[7px] transition-transform";
      default:
        return "";
    }
  };

  return (
    <div
      className={twMerge(
        "w-full h-0.5 bg-white duration-300",
        getDashClasses(),
      )}
    />
  );
};

export default HamburgerDash;
