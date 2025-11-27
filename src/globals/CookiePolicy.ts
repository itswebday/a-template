import type { GlobalConfig } from "payload";
import { RichTextField } from "@/fields";

export const CookiePolicy: GlobalConfig = {
  slug: "cookiePolicy",
  label: "Cookie policy",
  admin: {
    group: "Legal",
  },
  fields: [
    RichTextField({
      name: "content",
      label: "Content",
    }),
  ],
};
