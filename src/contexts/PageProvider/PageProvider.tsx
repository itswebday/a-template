"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Page provider context type
type PageProviderContextType = {
  currentPage: string;
  currentSlug: string;
  setCurrentPage: (label: string) => void;
  setCurrentSlug: (slug: string) => void;
};

// Create the context
const PageProviderContext = createContext<PageProviderContextType | undefined>(
  undefined,
);

type PageProviderProps = {
  children: ReactNode;
  initialPage: string;
};

export const PageProvider = ({ children, initialPage }: PageProviderProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentSlug, setCurrentSlug] = useState("");

  return (
    <PageProviderContext.Provider
      value={{
        currentPage,
        currentSlug,
        setCurrentPage,
        setCurrentSlug,
      }}
    >
      {children}
    </PageProviderContext.Provider>
  );
};

// Hook to access the page context
export const usePage = () => {
  const context = useContext(PageProviderContext);

  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }

  return context;
};
