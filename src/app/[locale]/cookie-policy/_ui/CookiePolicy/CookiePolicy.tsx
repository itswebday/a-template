import { twMerge } from "tailwind-merge";
import { RichTextRenderer } from "@/components/server";
import type { RichText } from "@/types";

type CookiePolicyProps = {
  content: RichText;
};

const CookiePolicy = ({ content }: CookiePolicyProps) => {
  return (
    <section className={twMerge("w-11/12 max-w-300 py-12 mx-auto", "de:py-20")}>
      <RichTextRenderer richText={content} />
    </section>
  );
};

export default CookiePolicy;
