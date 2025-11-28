"use client";

import { useNavMenu } from "@/contexts";

type HamburgerDashProps = {
  dashIndex: 0 | 1 | 2;
};

const HamburgerDash: React.FC<HamburgerDashProps> = ({ dashIndex }) => {
  const navMenu = useNavMenu();

  return (
    <div
      className={`
        w-full h-0.5 bg-white duration-300
        ${
          dashIndex === 0
            ? navMenu.isOpen && !navMenu.isClosing
              ? "rotate-45 translate-y-[7px] transition-transform"
              : ""
            : ""
        }
        ${
          dashIndex === 1
            ? navMenu.isOpen && !navMenu.isClosing
              ? "opacity-0 transition-opacity"
              : ""
            : ""
        }
        ${
          dashIndex === 2
            ? navMenu.isOpen && !navMenu.isClosing
              ? "-rotate-45 -translate-y-[7px] transition-transform"
              : ""
            : ""
        }
      `}
    />
  );
};

export default HamburgerDash;
