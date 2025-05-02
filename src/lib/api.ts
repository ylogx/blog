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

// Cache for post data to avoid repeated disk reads
const postCache = new Map<string, Post>();
const permalinkToSlugMap = new Map<string, string>();

// Function to normalize slugs and permalinks for comparison
const normalizePathForComparison = (path: string): string => {
  return path.replace(/^\/|\/$/g, '').toLowerCase();
};

// Initialize the permalink map
function initPermalinkMap() {
  if (permalinkToSlugMap.size === 0) {
    const slugs = getPostSlugs();
    
    for (const slug of slugs) {
      try {
        const filePath = join(postsDirectory, slug);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        
        if (data.permalink) {
          const normalizedPermalink = normalizePathForComparison(data.permalink);
          permalinkToSlugMap.set(normalizedPermalink, slug.replace(/\.md$/, ""));
        }
      } catch (error) {
        console.error(`Error reading file ${slug}:`, error);
      }
    }
  }
}

export function getPostBySlug(slug: string) {
  // If slug is empty or undefined, return null
  if (!slug) return null;
  
  // Initialize the permalink map if needed
  initPermalinkMap();
  
  let realSlug = slug.replace(/\.md$/, "");
  const normalizedSlug = normalizePathForComparison(slug);
  
  // Check cache first
  if (postCache.has(normalizedSlug)) {
    return postCache.get(normalizedSlug);
  }
  
  // Check if this is a permalink path
  if (permalinkToSlugMap.has(normalizedSlug)) {
    realSlug = permalinkToSlugMap.get(normalizedSlug) as string;
  }
  
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    // As a fallback, try a direct filename match if the path contains slashes
    if (slug.includes('/')) {
      // Look for the file with a matching permalink in the frontmatter
      for (const [permalink, mappedSlug] of permalinkToSlugMap.entries()) {
        if (permalink.includes(normalizedSlug) || normalizedSlug.includes(permalink)) {
          const matchPath = join(postsDirectory, `${mappedSlug}.md`);
          if (fs.existsSync(matchPath)) {
            realSlug = mappedSlug;
            break;
          }
        }
      }
    }
    
    // Check again after the fallback attempt
    const fallbackPath = join(postsDirectory, `${realSlug}.md`);
    if (!fs.existsSync(fallbackPath)) {
      return null;
    }
  }
  
  // At this point we have a valid slug with a corresponding file
  const fileContents = fs.readFileSync(join(postsDirectory, `${realSlug}.md`), "utf8");
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
  
  const post = { 
    ...data, 
    slug: realSlug, 
    content,
    author,
    excerpt: data.excerpt || data.subtitle || '',
    coverImage: data.coverImage || data['header-img'] || '',
    permalinkMatch: data.permalink || '',
  } as Post;
  
  // Cache the post for future requests
  postCache.set(normalizedSlug, post);
  if (data.permalink) {
    postCache.set(normalizePathForComparison(data.permalink), post);
  }
  
  return post;
}

export function getAllPosts(): Post[] {
  // Initialize the permalink map if needed
  initPermalinkMap();
  
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const filePath = join(postsDirectory, slug);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      
      // Create a simplified post object for listing
      const realSlug = slug.replace(/\.md$/, "");
      
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
        author,
        excerpt: data.excerpt || data.subtitle || '',
        coverImage: data.coverImage || data['header-img'] || '',
      } as Post;
    })
    .filter(post => post !== null && post.published !== false)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
