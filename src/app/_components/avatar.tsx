"use client";

import { getImagePath } from "@/lib/imageUtils";
import ImageWithFallback from "./image-with-fallback";

type Props = {
  name: string;
  picture: string;
};

export default function Avatar({ name, picture }: Props) {
  // Format the image path correctly
  const imageSrc = getImagePath(picture || "/assets/blog/authors/default.jpeg");

  // Create fallback options for author images
  const getFallbacks = (originalPath: string) => {
    const result = [];

    // Try different extensions
    if (originalPath.match(/\.(jpe?g|png|webp|gif|avif)$/i)) {
      const basePath = originalPath.replace(/\.\w+$/, "");
      ["jpeg", "jpg", "png", "webp"].forEach((ext) => {
        result.push(`${basePath}.${ext}`);
      });
    }

    // Try standard author image locations
    result.push(
      "/assets/blog/authors/default.jpeg",
      "/assets/blog/authors/default.png",
      "/assets/blog/authors/default.webp"
    );

    return result;
  };

  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10 mr-4">
        <ImageWithFallback
          src={imageSrc}
          fill
          className="rounded-full"
          alt={name}
          fallbackSrc="/assets/blog/authors/default.jpeg"
          fallbackChain={getFallbacks(imageSrc)}
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
