import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath } from "next/cache";

type BlogPost = {
  id: string;
  _status?: "draft" | "published" | null;
  url?: string | string[] | null;
  slug?: string | string[] | null;
};

export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      // Handle localized URLs
      const url = Array.isArray(doc.url) ? doc.url[0] : doc.url;
      const path = url === null || !url ? "/blog" : url;

      revalidatePath(path);
      // Also revalidate the blog listing page
      revalidatePath("/blog");
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === "published" && doc._status !== "published") {
      const oldUrl = Array.isArray(previousDoc.url)
        ? previousDoc.url[0]
        : previousDoc.url;
      const oldPath = oldUrl === null || !oldUrl ? "/blog" : oldUrl;

      revalidatePath(oldPath);
      revalidatePath("/blog");
    }
  }
  return doc;
};

export const revalidateBlogPostDelete: CollectionAfterDeleteHook<BlogPost> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const url = Array.isArray(doc?.url) ? doc?.url[0] : doc?.url;
    const path = url === null || !url ? "/blog" : url;
    revalidatePath(path);
    revalidatePath("/blog");
  }

  return doc;
};
