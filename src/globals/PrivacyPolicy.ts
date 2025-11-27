import type { GlobalConfig } from "payload";
import { RichTextField } from "@/fields";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacyPolicy",
  label: "Privacy Policy",
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
