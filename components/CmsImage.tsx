import Image from "next/image";
import { isCmsInlineSrc } from "@/lib/cms-image";

type CmsImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
  draggable?: boolean;
  objectFit?: "cover" | "contain";
};

export default function CmsImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  preload,
  loading,
  draggable,
  objectFit = "cover",
}: CmsImageProps) {
  if (isCmsInlineSrc(src)) {
    return (
      // next/image no acepta data:/https arbitrarios del CMS local
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        draggable={draggable}
        loading={loading}
        style={
          fill
            ? {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit,
              }
            : { objectFit }
        }
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      preload={preload}
      loading={loading}
      draggable={draggable}
    />
  );
}
