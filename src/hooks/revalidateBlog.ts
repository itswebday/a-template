import { LOCALES } from "@/constants";
import type { GlobalAfterChangeHook } from "payload";
import { revalidatePath } from "next/cache";

export const revalidateBlog: GlobalAfterChangeHook = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const paths = ["/blog", ...LOCALES.map((locale) => `/${locale}/blog`)];

    if (doc._status === "published") {
      paths.forEach((path) => {
        revalidatePath(path);
      });
    }

    if (previousDoc?._status === "published" && doc._status !== "published") {
      paths.forEach((path) => {
        revalidatePath(path);
      });
    }
  }
  return doc;
};
