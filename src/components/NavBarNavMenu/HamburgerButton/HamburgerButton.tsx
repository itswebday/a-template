"use client";

import HamburgerDash from "./HamburgerDash";
import { useNavMenu } from "@/contexts";

type HamburgerButtonProps = {
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const navMenu = useNavMenu();

  return (
    <button
      className={`
        flex-col justify-between h-nav-bar aspect-square px-5 py-[23px]
        ${className}
      `}
      onClick={navMenu.toggle}
    >
      {/* Hamburger dashes */}
      <HamburgerDash dashIndex={0} />
      <HamburgerDash dashIndex={1} />
      <HamburgerDash dashIndex={2} />
    </button>
  );
};

export default HamburgerButton;
