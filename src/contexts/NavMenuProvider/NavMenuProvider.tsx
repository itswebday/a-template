"use client";

import {
  NAV_MENU_CLOSING_DELAY,
  NAV_MENU_CLOSING_DURATION,
  NAV_MENU_OPENING_DURATION,
} from "@/constants";
import { scrollToTop } from "@/utils";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Navigation menu context type
type NavMenuContextType = {
  isOpen: boolean;
  isOpening: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

// Create context
const NavMenuContext = createContext<NavMenuContextType | undefined>(undefined);

type NavMenuProviderProps = {
  children: ReactNode;
};

export const NavMenuProvider = ({ children }: NavMenuProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Open navigation menu
  const open = () => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      scrollToTop();
      setIsOpen(true);
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
      }, NAV_MENU_OPENING_DURATION);
    }
  };

  // Close navigation menu
  const close = () => {
    if (isOpen) {
      document.body.style.overflow = "";
      scrollToTop();
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsClosing(false);
        }, NAV_MENU_CLOSING_DURATION);
      }, NAV_MENU_CLOSING_DELAY);
    }
  };

  // Toggle between open and close states
  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  // Close the navigation menu when the window is resized
  useEffect(() => {
    const closeAfterResize = () => {
      document.body.style.overflow = "";
      setIsOpen(false);
    };

    window.addEventListener("resize", closeAfterResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", closeAfterResize);
    };
  }, []);

  // Cleanup body overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Provide navigation menu context
  return (
    <NavMenuContext.Provider
      value={{
        isOpen,
        isOpening,
        isClosing,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </NavMenuContext.Provider>
  );
};

// Hook to access navigation menu context
export const useNavMenu = () => {
  const context = useContext(NavMenuContext);

  if (!context) {
    throw new Error("useNavMenu must be used within a NavMenuProvider");
  }

  return context;
};
