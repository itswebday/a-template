import Image from "next/image";
import { twMerge } from "tailwind-merge";

type BackgroundImageProps = {
  className?: string;
  src: string;
  alt: string;
};

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  className,
  src,
  alt,
}) => {
  return (
    <div className={twMerge("z-0 absolute inset-0", className)}>
      <Image
        className="object-cover"
        src={src}
        alt={alt}
        fill={true}
        sizes="200vw"
        priority={true}
      />
    </div>
  );
};

export default BackgroundImage;
