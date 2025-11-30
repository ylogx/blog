import cn from "classnames";
import { getImagePath } from "@/lib/imageUtils";
import ImageWithFallback from "./ImageWithFallback";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

export default function CoverImage({ title, src, slug }: Props) {
  // Get properly formatted image path
  const imageSrc = getImagePath(src);

  // Generate the correct link path for permalinks
  let linkPath = "";
  if (slug) {
    if (!slug.startsWith("/")) {
      linkPath = `/posts/${slug}`;
    } else {
      linkPath = `/posts${slug}`;
    }

    // Remove trailing slashes for consistency
    linkPath = linkPath.replace(/\/$/, "");
  }

  // Potential fallbacks to try - this helps with specific paths in your blog
  // that follow a pattern but might have different extensions
  const getFallbacks = (originalPath: string) => {
    const result = [];

    // Try different image extensions if URL doesn't contain extension
    if (!/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(originalPath)) {
      const basePath = originalPath.replace(/\.\w+$/, "");
      result.push(`${basePath}.jpg`, `${basePath}.png`, `${basePath}.webp`);
    }

    // Try with alternative folder structure
    if (originalPath.includes("/img/")) {
      result.push(originalPath.replace("/img/", "/assets/blog/"));
    }

    return result;
  };

  // The parent container should have position: relative and explicit dimensions
  const imageElement = (
    <ImageWithFallback
      src={imageSrc}
      alt={`Cover Image for ${title}`}
      className={cn("object-cover transition-transform duration-500", {
        "group-hover:scale-110": slug,
      })}
      fill={true}
      sizes="(min-width: 1024px) 1200px, 100vw"
      style={{ objectFit: "cover" }}
      priority
      fallbackSrc="/assets/blog/default-cover.webp"
      fallbackChain={getFallbacks(imageSrc)}
    />
  );

  // If there's a slug, wrap in link that covers the entire area
  if (slug) {
    return (
      <>
        {imageElement}
        <a href={linkPath} aria-label={title} className="absolute inset-0 z-10"></a>
      </>
    );
  }

  return imageElement;
}
