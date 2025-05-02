"use client";

import cn from "classnames";
import Link from "next/link";
import { getImagePath } from "@/lib/imageUtils";
import ImageWithFallback from "./image-with-fallback";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

export default function CoverImage({ title, src, slug }: Props) {
  // Get properly formatted image path
  const imageSrc = getImagePath(src);
  
  // Generate the correct link path for permalinks
  let linkPath = slug;
  if (linkPath) {
    if (!linkPath.startsWith('/')) {
      linkPath = `/posts/${linkPath}`;
    } else {
      linkPath = `/posts${linkPath}`;
    }
    
    // Remove trailing slashes for consistency
    linkPath = linkPath.replace(/\/$/, '');
  }

  // Potential fallbacks to try - this helps with specific paths in your blog
  // that follow a pattern but might have different extensions
  const getFallbacks = (originalPath: string) => {
    const result = [];
    
    // Try different image extensions if URL doesn't contain extension
    if (!/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(originalPath)) {
      const basePath = originalPath.replace(/\.\w+$/, '');
      result.push(`${basePath}.jpg`, `${basePath}.png`, `${basePath}.webp`);
    }
    
    // Try with alternative folder structure
    if (originalPath.includes('/img/')) {
      result.push(originalPath.replace('/img/', '/assets/blog/'));
    }
    
    return result;
  };

  const image = (
    <div className="relative w-full aspect-[16/9]">
      <ImageWithFallback
        src={imageSrc}
        alt={`Cover Image for ${title}`}
        className={cn("shadow-sm", {
          "hover:shadow-lg transition-shadow duration-200": slug,
        })}
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        style={{objectFit: "cover"}}
        priority
        fallbackSrc="/assets/blog/default-cover.webp"
        fallbackChain={getFallbacks(imageSrc)}
      />
    </div>
  );
  
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={linkPath} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
