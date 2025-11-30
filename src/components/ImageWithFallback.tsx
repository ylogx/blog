import { useState, useEffect } from "react";
import { isLikelyValidImagePath } from "@/lib/imageUtils";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackChain?: string[];
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  priority?: boolean;
};

export default function ImageWithFallback({
  fallbackSrc = "/assets/blog/default-cover.webp",
  fallbackChain = [],
  alt,
  src,
  className = "",
  fill = false,
  sizes,
  style,
  priority = false,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [fallbackIndex, setFallbackIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);

  // If the src prop changes, reset to use the new source
  useEffect(() => {
    setImgSrc(src);
    setFallbackIndex(-1);
    setIsLoading(true);
  }, [src]);

  // Handle image load failure
  const handleError = () => {
    setIsLoading(false);

    // Try the next fallback in the chain if available
    if (
      fallbackChain &&
      fallbackChain.length > 0 &&
      fallbackIndex < fallbackChain.length - 1
    ) {
      const nextIndex = fallbackIndex + 1;
      setFallbackIndex(nextIndex);
      setImgSrc(fallbackChain[nextIndex]);
    }
    // Otherwise use the final fallback
    else {
      setImgSrc(fallbackSrc);
    }
  };

  // Don't even attempt to load obviously invalid image paths
  useEffect(() => {
    if (!isLikelyValidImagePath(imgSrc) && imgSrc !== fallbackSrc) {
      handleError();
    }
  }, [imgSrc, fallbackSrc]);

  const imageStyle = fill
    ? {
        ...style,
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
      }
    : style;

  return (
    <img
      {...props}
      alt={alt}
      src={imgSrc}
      onError={handleError}
      onLoad={() => setIsLoading(false)}
      className={`${className} ${isLoading ? "animate-pulse" : ""}`}
      style={imageStyle}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
    />
  );
}
