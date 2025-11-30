import Avatar from "./Avatar";
import CoverImage from "./CoverImage";
import { type Author } from "@/interfaces/author";
import DateFormatter from "./DateFormatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  const hasImage = coverImage && coverImage.trim() !== "";

  return (
    <header className="relative">
      {hasImage && (
        <div className="mb-8 -mx-4 md:-mx-8 lg:-mx-12 xl:-mx-16">
          <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden w-full">
            <CoverImage title={title} src={coverImage} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 pointer-events-none z-10"></div>
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 pt-4 md:pt-8 pb-8 md:pb-12 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-6 text-sm md:text-base text-gray-500 dark:text-gray-400">
          <DateFormatter dateString={date} />
        </div>
        <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-extrabold gradient-text-fallback">
          {title}
        </h1>
        <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </header>
  );
}
