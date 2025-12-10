"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePage } from "@/contexts";

type PageWrapperProps = {
  children: ReactNode;
  pageLabel: string;
  pageSlug?: string;
};

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageLabel,
  pageSlug = "",
}) => {
  const page = usePage();

  useEffect(() => {
    page.setCurrentPage(pageLabel);
    page.setCurrentSlug(pageSlug);
  }, [pageLabel, pageSlug, page]);

  return <>{children}</>;
};

export default PageWrapper;
