import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

type BackgroundVideoProps = {
  className?: string;
  src: string;
  alt: string;
};

const getVideoType = (src: string): string => {
  const extension = src.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "webm":
      return "video/webm";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "ogg":
      return "video/ogg";
    default:
      return "video/webm";
  }
};

const BackgroundVideo: React.FC<BackgroundVideoProps> = async ({
  className,
  src,
  alt,
}) => {
  const generalT = await getTranslations("general");

  return (
    <div className={twMerge("z-0 absolute inset-0", className)}>
      {/* Video */}
      <video
        className="h-full w-full object-cover"
        aria-label={alt}
        autoPlay={true}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
        loop={true}
        muted={true}
        playsInline={true}
        preload="metadata"
      >
        <source src={src} type={getVideoType(src)} />
        {generalT("videoTagNotSupported")}
      </video>
    </div>
  );
};

export default BackgroundVideo;
