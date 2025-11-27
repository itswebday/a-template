import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath } from "next/cache";
import type { Page } from "@/payload-types";

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      // Handle localized URLs
      const url = Array.isArray(doc.url) ? doc.url[0] : doc.url;
      const path = url === null || !url ? "/" : url;

      revalidatePath(path);
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === "published" && doc._status !== "published") {
      const oldUrl = Array.isArray(previousDoc.url)
        ? previousDoc.url[0]
        : previousDoc.url;
      const oldPath = oldUrl === null || !oldUrl ? "/" : oldUrl;

      revalidatePath(oldPath);
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const url = Array.isArray(doc?.url) ? doc?.url[0] : doc?.url;
    const path = url === null || !url ? "/" : url;
    revalidatePath(path);
  }

  return doc;
};
