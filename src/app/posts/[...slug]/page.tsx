import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

type Params = {
  params: {
    slug: string[];
  };
};

export default async function Post({ params }: Params) {
  // Join all parts of the slug path
  const slugPath = params.slug.join("/");

  // Try to get the post by the full slug path
  const post = getPostBySlug(slugPath);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage || post["header-img"] || ""}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

export function generateMetadata({ params }: Params): Metadata {
  const slugPath = params.slug.join("/");
  const post = getPostBySlug(slugPath);

  if (!post) {
    return notFound();
  }

  const title = post.title;
  const description = post.excerpt || post.subtitle || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.coverImage || post["header-img"] || "",
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => {
    if (post.permalink) {
      // Clean permalink and split into path segments
      const cleanPermalink = post.permalink.replace(/^\/|\/$/g, "");
      const segments = cleanPermalink.split("/");

      return {
        slug: segments,
      };
    } else {
      // If no permalink, use the slug directly
      return {
        slug: [post.slug],
      };
    }
  });
}
