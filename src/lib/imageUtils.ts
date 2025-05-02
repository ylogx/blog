/**
 * Handles image paths to ensure they're correctly formatted
 * Converts relative paths (img/path.jpg) to absolute paths (/img/path.jpg)
 * Passes through absolute paths and URLs unchanged
 * Processes Jekyll-style image paths ({{site.baseurl}}/img/...)
 */
export function getImagePath(path: string | undefined): string {
  if (!path) {
    return '/assets/blog/default-cover.webp';
  }

  // Process Jekyll-style paths by removing the {{site.baseurl}} part
  const jekyllProcessed = path.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
  
  // If it's already an absolute URL or path, return it unchanged
  if (jekyllProcessed.startsWith('http') || jekyllProcessed.startsWith('//')) {
    return jekyllProcessed;
  }
  
  // Otherwise, ensure it starts with a slash to make it an absolute path
  return jekyllProcessed.startsWith('/') ? jekyllProcessed : `/${jekyllProcessed}`;
}

/**
 * Determines if an image path is likely to be valid
 * Used for conditional rendering decisions
 */
export function isLikelyValidImagePath(path: string | undefined): boolean {
  if (!path) return false;
  
  // Process Jekyll variables
  const processedPath = path.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
  
  // Common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  
  // Check if the path ends with a common image extension
  return imageExtensions.some(ext => processedPath.toLowerCase().endsWith(ext));
}
