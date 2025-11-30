import { getImagePath } from "@/lib/imageUtils";
import ImageWithFallback from "./ImageWithFallback";

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
    <div className="flex items-center space-x-3 group">
      <div className="relative w-12 h-12 ring-2 ring-purple-200 dark:ring-purple-800 rounded-full overflow-hidden transition-all duration-300 group-hover:ring-purple-400 dark:group-hover:ring-purple-600">
        <ImageWithFallback
          src={imageSrc}
          fill
          className="rounded-full object-cover"
          alt={name}
          fallbackSrc="/assets/blog/authors/default.jpeg"
          fallbackChain={getFallbacks(imageSrc)}
        />
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
        {name}
      </div>
    </div>
  );
}
