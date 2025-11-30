import Avatar from "./Avatar";
import CoverImage from "./CoverImage";
import { type Author } from "@/interfaces/author";
import DateFormatter from "./DateFormatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  // Generate the correct link path
  let linkPath = slug;
  if (!linkPath.startsWith("/")) {
    linkPath = `/posts/${linkPath}`;
  } else {
    linkPath = `/posts${linkPath}`;
  }

  // Remove trailing slashes for consistency
  linkPath = linkPath.replace(/\/$/, "");

  const hasImage = coverImage && coverImage.trim() !== "";

  return (
    <section className="relative border-b border-gray-200 dark:border-gray-800 pb-16 md:pb-24">
      <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
        {hasImage && (
          <div className="md:col-span-4 order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden w-full">
              <CoverImage title={title} src={coverImage} slug={slug} />
            </div>
          </div>
        )}
        <div className={`space-y-6 ${hasImage ? 'md:col-span-8' : 'md:col-span-12'} order-1 md:order-2`}>
          <div className="flex items-center space-x-4 text-sm md:text-base text-gray-500 dark:text-gray-400">
            <DateFormatter dateString={date} />
            <span>•</span>
            <span>Featured Post</span>
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-extrabold">
            <a
              href={linkPath}
              className="gradient-text-hover hover:opacity-90 transition-opacity duration-300 block"
            >
              {title}
            </a>
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 dark:text-gray-300">
            {excerpt}
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <Avatar name={author.name} picture={author.picture} />
            <a
              href={linkPath}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm md:text-base transition-colors"
            >
              Read more →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
