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

  return (
    <section className="relative border-b border-gray-200 dark:border-gray-800 pb-16 md:pb-24">
      <div className="space-y-8">
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
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl">
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
    </section>
  );
}
