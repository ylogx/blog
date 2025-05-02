/**
 * Utility to process markdown content and handle special cases
 * like Jekyll-style variables ({{site.baseurl}})
 */

/**
 * Replaces Jekyll-style template variables in markdown content
 *
 * @param content The markdown content with Jekyll variables
 * @returns The processed markdown with absolute paths
 */
export function processJekyllVariables(content: string): string {
  // Replace {{site.baseurl}} with an empty string to create absolute paths
  return content.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
}

/**
 * Process markdown content to be compatible with Next.js
 */
export function processMarkdownContent(content: string): string {
  let processedContent = content;

  // Process Jekyll variables
  processedContent = processJekyllVariables(processedContent);

  return processedContent;
}
