"use client";

import { twMerge } from "tailwind-merge";
import { useNavMenu } from "@/contexts";
import HamburgerDash from "./HamburgerDash";

type HamburgerButtonProps = {
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const navMenu = useNavMenu();

  return (
    <button
      className={twMerge(
        "flex-col justify-between w-16 h-nav-bar px-5 py-8",
        className,
      )}
      onClick={navMenu.toggle}
    >
      <HamburgerDash dashIndex={0} />
      <HamburgerDash dashIndex={1} />
      <HamburgerDash dashIndex={2} />
    </button>
  );
};

export default HamburgerButton;
