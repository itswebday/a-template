import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  BackgroundImage,
  BackgroundVideo,
  ButtonLink,
  type ButtonLinkProps,
} from "@/components";
import { AnimatedScale } from "@/components/animations";
import type { Media, VisualBlock } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getButtonHref, getPaddingClasses } from "@/utils";
import { getCachedGlobals } from "@/utils/server";

const Visual: React.FC<VisualBlock> = async ({
  visual,
  showSocialMediaLinks,
  socialMediaLinks,
  showButton,
  button,
  dark,
  paddingTop,
  paddingBottom,
}) => {
  const locale = (await getLocale()) as LocaleOption;
  const globals = await getCachedGlobals(locale)();
  const buttonHref = showButton ? getButtonHref(button, globals) : null;

  // Get visual media
  const visualMedia =
    typeof visual === "object" && visual !== null && "url" in visual
      ? (visual as Media)
      : null;

  // Check if media has a URL
  const hasMedia = visualMedia && visualMedia.url;

  // Check if media is a video
  const isVideo =
    hasMedia && visualMedia.url
      ? /\.(webm|mp4|mov|ogg)$/i.test(visualMedia.url)
      : false;

  // Check if media is an image
  const isImage = hasMedia && !isVideo;

  return (
    <section
      className={twMerge(
        "w-full overflow-hidden",
        dark && "bg-dark text-white",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-400 mx-auto">
        <AnimatedScale delay={0}>
          <div
            className={twMerge(
              "relative flex flex-col overflow-hidden",
              "h-100 mt-2 p-6 rounded-[25px] bg-primary-purple/10",
              "bg-[radial-gradient(circle_at_top,rgba(140,82,254,0.15)," +
                "transparent_60%),rgba(159,122,234,0.05)]",
              "md:h-120 md:p-8",
            )}
          >
            {isVideo && visualMedia && visualMedia.url && (
              <BackgroundVideo
                className="opacity-90"
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${visualMedia.url}`}
                alt={visualMedia.alt || ""}
              />
            )}

            {isImage && visualMedia && visualMedia.url && (
              <BackgroundImage
                className="opacity-90"
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${visualMedia.url}`}
                alt={visualMedia.alt || ""}
              />
            )}

            {!hasMedia && (
              <div
                className={twMerge(
                  "z-0 absolute inset-0 flex items-center justify-center",
                )}
              >
                <div className="opacity-60">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="40"
                      fill="white"
                      className="opacity-80"
                    />
                    <path
                      d="M32 24L32 56L56 40L32 24Z"
                      fill="currentColor"
                      className="text-primary-purple"
                    />
                  </svg>
                </div>
              </div>
            )}

            {showSocialMediaLinks &&
              (socialMediaLinks || []).filter((item) => item.href).length >
                0 && (
                <div
                  className={twMerge(
                    "z-10 absolute top-6 right-6",
                    "md:top-8 md:right-8",
                  )}
                >
                  <div className="flex gap-4">
                    {(socialMediaLinks || [])
                      .filter(
                        (item): item is typeof item & { href: string } =>
                          !!item.href,
                      )
                      .map((item, index) => {
                        const media =
                          typeof item.icon === "object" && item.icon !== null
                            ? (item.icon as Media)
                            : null;

                        return (
                          <Link
                            key={item.id || index}
                            href={item.href}
                            target="_blank"
                            className={twMerge(
                              "relative flex items-center justify-center",
                              "h-14 w-14 rounded-full",
                              "border-2 border-white/20",
                              "bg-primary-purple/70 backdrop-blur-md",
                              "text-white",
                              "transition-all duration-300 ease-in-out",
                              "hover:bg-primary-purple/90",
                              "hover:border-white/40",
                              "hover:scale-110 active:scale-95",
                              "hover:shadow-lg hover:shadow-primary-purple/30",
                              "group",
                            )}
                            aria-label={`Social media link ${index + 1}`}
                          >
                            {media && "url" in media && media.url ? (
                              <span
                                className={twMerge(
                                  "relative block h-6 w-6",
                                  "transition-transform duration-300",
                                  "group-hover:scale-110",
                                )}
                              >
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                                    media.url as string
                                  }`}
                                  alt={
                                    "alt" in media && media.alt
                                      ? (media.alt as string)
                                      : ""
                                  }
                                  fill={true}
                                  className="object-contain"
                                  sizes="24px"
                                  loading="lazy"
                                />
                              </span>
                            ) : (
                              <span
                                className={twMerge(
                                  "text-[16px] font-semibold",
                                  "transition-transform duration-300",
                                  "group-hover:scale-110",
                                )}
                              >
                                S
                              </span>
                            )}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )}

            {showButton && buttonHref && button?.text && (
              <ButtonLink
                className={twMerge(
                  "z-10 absolute bottom-6",
                  "md:bottom-8",
                  button.centered
                    ? "left-1/2 -translate-x-1/2"
                    : "left-6 md:left-8",
                )}
                href={buttonHref}
                target={button.newTab ? "_blank" : "_self"}
                variant={button.variant as ButtonLinkProps["variant"]}
              >
                {button.text}
              </ButtonLink>
            )}
          </div>
        </AnimatedScale>
      </div>
    </section>
  );
};

export default Visual;
