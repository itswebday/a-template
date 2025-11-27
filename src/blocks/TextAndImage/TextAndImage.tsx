import { RichTextRenderer } from "@/components/server";
import type { TextAndImageBlock } from "@/payload-types";
import type { RichText } from "@/types";
import Image from "next/image";

const TextAndImage: React.FC<TextAndImageBlock> = ({
  text,
  image,
  imageLeft,
}) => {
  return (
    <section
      className={`
        p-16 my-8 bg-gray-100
      `}
    >
      {/* Container */}
      <div
        className={`
          container-medium flex flex-col gap-8 w-5/6 max-w-[550px] mx-auto
          de:flex-row de:max-w-none
          ${imageLeft ? "de:flex-row-reverse" : ""}
        `}
      >
        {/* Text */}
        <div className="w-full de:w-1/2">
          {text && <RichTextRenderer richText={text as RichText} />}
        </div>

        {/* Image */}
        <figure className="relative w-full aspect-square de:w-1/2">
          {typeof image === "object" && image?.url && (
            <Image
              className="object-cover"
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`}
              alt={image.alt || ""}
              fill={true}
              sizes="(max-width: 550px) 100vw, 550px"
              loading="eager"
            />
          )}
        </figure>
      </div>
    </section>
  );
};

export default TextAndImage;
