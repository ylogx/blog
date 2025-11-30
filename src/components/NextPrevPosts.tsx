import { Post } from "@/interfaces/post";

type Props = {
  prev?: Post | null;
  next?: Post | null;
};

export function NextPrevPosts({ prev, next }: Props) {
  // Generate the correct link path for permalinks
  const getPostLink = (post?: Post | null) => {
    if (!post) return "";

    let linkPath = post.permalink || post.slug;
    if (!linkPath.startsWith("/")) {
      linkPath = `/posts/${linkPath}`;
    } else {
      linkPath = `/posts${linkPath}`;
    }

    // Remove trailing slashes for consistency
    return linkPath.replace(/\/$/, "");
  };

  return (
    <section className="max-w-3xl mx-auto px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mt-28 mb-12"></div>
      <nav className="flex flex-col sm:flex-row justify-between gap-6">
        <div className="flex-1">
          {prev && (
            <a
              href={getPostLink(prev)}
              className="group block p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                ← Previous Post
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                {prev.title}
              </p>
            </a>
          )}
        </div>
        <div className="flex-1 sm:text-right">
          {next && (
            <a
              href={getPostLink(next)}
              className="group block p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Next Post →
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                {next.title}
              </p>
            </a>
          )}
        </div>
      </nav>
    </section>
  );
}
