import { remark } from 'remark'
import html from 'remark-html'
import { processMarkdownContent } from './processMarkdownContent'

export default async function markdownToHtml(markdown: string) {
  // Process any Jekyll-style template variables
  const processedMarkdown = processMarkdownContent(markdown)
  
  const result = await remark()
    .use(html, { sanitize: false })
    .process(processedMarkdown)
    
  return result.toString()
}
