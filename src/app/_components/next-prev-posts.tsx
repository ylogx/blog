"use client";

import { Post } from "@/interfaces/post";
import Link from "next/link";

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
    <section className="max-w-2xl mx-auto">
      <hr className="border-neutral-200 mt-28 mb-8" />
      <nav className="flex justify-between">
        <div className="w-1/2 text-left">
          {prev && (
            <Link href={getPostLink(prev)} className="hover:underline">
              <p className="text-sm text-gray-500 mb-1">← Previous Post</p>
              <p className="text-lg font-medium truncate">{prev.title}</p>
            </Link>
          )}
        </div>
        <div className="w-1/2 text-right">
          {next && (
            <Link href={getPostLink(next)} className="hover:underline">
              <p className="text-sm text-gray-500 mb-1">Next Post →</p>
              <p className="text-lg font-medium truncate">{next.title}</p>
            </Link>
          )}
        </div>
      </nav>
    </section>
  );
}
