"use client";

import { usePage } from "@/contexts";
import { ReactNode, useEffect } from "react";

type PageWrapperProps = {
  children: ReactNode;
  pageLabel: string;
  pageSlug?: string;
};

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageLabel,
  pageSlug = "",
}: PageWrapperProps) => {
  const page = usePage();

  useEffect(() => {
    page.setCurrentPage(pageLabel);
    page.setCurrentSlug(pageSlug);
  }, [pageLabel, pageSlug, page]);

  return <>{children}</>;
};

export default PageWrapper;
