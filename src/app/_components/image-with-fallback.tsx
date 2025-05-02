"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { isLikelyValidImagePath } from "@/lib/imageUtils";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
  fallbackChain?: string[];
};

export default function ImageWithFallback({
  fallbackSrc = "/assets/blog/default-cover.webp",
  fallbackChain = [],
  alt,
  src,
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

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      onError={handleError}
      onLoad={() => setIsLoading(false)}
      className={`${props.className || ""} ${isLoading ? "animate-pulse" : ""}`}
    />
  );
}
