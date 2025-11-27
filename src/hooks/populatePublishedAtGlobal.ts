import type { GlobalBeforeChangeHook } from "payload";

export const populatePublishedAtGlobal: GlobalBeforeChangeHook = ({
  data,
  req,
}) => {
  if (req.data && !req.data.publishedAt) {
    if (data._status === "published" && !data.publishedAt) {
      return {
        ...data,
        publishedAt: new Date(),
      };
    }
  }

  return data;
};
