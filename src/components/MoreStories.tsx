import { Post } from "@/interfaces/post";
import { PostPreview } from "./PostPreview";

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section className="relative py-12">
      <div className="flex items-center mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        <h2 className="px-8 text-4xl md:text-6xl font-extrabold tracking-tight gradient-text-fallback">
          More Stories
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 mb-20">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage || post["header-img"] || ""}
            date={post.date}
            author={post.author}
            slug={post.permalink || post.slug}
            excerpt={post.excerpt || post.subtitle || ""}
          />
        ))}
      </div>
    </section>
  );
}
