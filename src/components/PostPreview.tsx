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
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <a href={linkPath} className="hover:underline">
          {title}
        </a>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      <Avatar name={author.name} picture={author.picture} />
    </div>
  );
}
