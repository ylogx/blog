import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { PostHeader } from "@/app/_components/post-header";
import markdownStyles from "@/app/_components/markdown-styles.module.css";
import { NextPrevPosts } from "@/app/_components/next-prev-posts";

// Define the proper type for the page params
type PageParams = {
  params: {
    slug: string[];
  };
};

// Props type for the page component
type Props = {
  params: {
    slug: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Post({ params }: Props) {
  // Join the slug segments to create a path
  const slugPath = params.slug.join('/');
  
  // Try to get the post by the slug path
  const post = getPostBySlug(slugPath);

  if (!post) {
    return notFound();
  }

  // Find previous and next posts for navigation
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => 
    p.slug === post.slug || 
    (p.permalink && p.permalink.replace(/^\/|\/$/g, '') === slugPath)
  );
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage || post["header-img"] || ""}
          date={post.date}
          author={post.author}
        />
        <div className="max-w-2xl mx-auto">
          <div
            className={markdownStyles["markdown"]}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        
        {/* Previous/Next Post Navigation */}
        <NextPrevPosts prev={prevPost} next={nextPost} />
      </article>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);

  if (!post) {
    return notFound();
  }

  const title = post.title;
  const description = post.excerpt || post.subtitle || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [post.coverImage || post["header-img"] || ""],
    },
  };
}

export async function generateStaticParams() {
  // Get all posts with permalinks
  const allPosts = getAllPosts();
  const permalinkPosts = allPosts.filter(post => post.permalink && post.permalink.includes('/'));

  return permalinkPosts.map((post) => {
    // Make sure permalink exists and remove leading and trailing slashes, then split by slashes
    if (!post.permalink) return { slug: [] }; // Safety check, though our filter should prevent this
    
    const cleanPath = post.permalink.replace(/^\/|\/$/g, '');
    return {
      slug: cleanPath.split('/')
    };
  });
}
