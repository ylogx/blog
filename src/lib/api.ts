import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { processMarkdownContent } from "./processMarkdownContent";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
    .filter((slug) => slug.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  // If slug is empty or undefined, return null
  if (!slug) return null;

  let realSlug = slug.replace(/\.md$/, "");
  let permalinkMatch = null;

  // If slug might be a permalink path
  if (realSlug.includes('/')) {
    const allSlugs = getPostSlugs();
    for (const postFile of allSlugs) {
      const filePath = join(postsDirectory, postFile);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Clean permalink and slug for comparison
      const cleanPermalink = data.permalink
        ? data.permalink.replace(/^\/|\/$/g, '')
        : '';

      const cleanRequestSlug = slug.replace(/^\/|\/$/g, '');

      // Check if permalink matches the requested slug
      if (cleanPermalink && cleanPermalink === cleanRequestSlug) {
        realSlug = postFile.replace(/\.md$/, "");
        permalinkMatch = cleanPermalink;
        break;
      }
    }

    // If no matching permalink was found and this looks like a permalink path
    if (!permalinkMatch) {
      // Try the slug as a filename directly
      const directFile = `${slug}.md`;
      const directPath = join(postsDirectory, directFile);
      if (fs.existsSync(directPath)) {
        realSlug = slug;
      }
    }
  }

  const fullPath = join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content: rawContent } = matter(fileContents);

  // Process the markdown content to handle Jekyll template variables
  const content = processMarkdownContent(rawContent);

  // Create author object if it's in string format
  let author = data.author;
  if (typeof author === 'string') {
    author = {
      name: data.author,
      picture: data.picture || '/assets/blog/authors/default.jpeg'
    };
  }

  return {
    ...data,
    slug: realSlug,
    content,
    author,
    excerpt: data.excerpt || data.subtitle || '',
    coverImage: data.coverImage || data['header-img'] || '',
    permalinkMatch: permalinkMatch || data.permalink || '',
  } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter(post => post !== null && post.published !== false)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
