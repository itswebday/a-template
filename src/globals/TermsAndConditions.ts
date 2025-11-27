import type { GlobalConfig } from "payload";
import { RichTextField } from "@/fields";

export const TermsAndConditions: GlobalConfig = {
  slug: "termsAndConditions",
  label: "Terms and conditions",
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
