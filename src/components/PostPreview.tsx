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

export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  // Generate the correct link path
  // If slug contains slashes, it's likely a permalink
  let linkPath = slug;

  // Ensure we have a proper URL path
  if (!linkPath.startsWith("/")) {
    linkPath = `/posts/${linkPath}`;
  } else {
    linkPath = `/posts${linkPath}`;
  }

  // Remove any trailing slashes for consistency
  linkPath = linkPath.replace(/\/$/, "");

  return (
    <article className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 card-hover border border-gray-100 dark:border-gray-700">
      <div className="mb-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <DateFormatter dateString={date} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          <a href={linkPath} className="block">
            {title}
          </a>
        </h3>
        <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">
          {excerpt}
        </p>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </article>
  );
}
