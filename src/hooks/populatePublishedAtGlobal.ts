import type { FieldHook, GlobalBeforeChangeHook } from "payload";

export const populatePublishedAtGlobalField: FieldHook = ({
  siblingData,
  value,
}) => {
  if (siblingData._status === "published" && !value) {
    return new Date();
  }
  return value;
};

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
