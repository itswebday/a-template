"use server";

import { getTranslations } from "next-intl/server";

const PageNotFoundPage = async () => {
  const pageNotFoundT = await getTranslations("pageNotFound");

  return (
    <main className="flex justify-center items-center min-h-screen">
      {/* Container */}
      <div
        className={`
          flex flex-col items-center text-center gap-6
          w-11/12 max-w-[700px]
        `}
      >
        {/* 404 */}
        <span className="text-6xl font-bold text-secondary-blue">404</span>

        {/* Message */}
        <p className="mb-4">{pageNotFoundT("paragraph")}</p>
      </div>
    </main>
  );
};

export default PageNotFoundPage;
