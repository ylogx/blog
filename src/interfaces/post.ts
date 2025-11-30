import type { Author } from './author'

export interface Post {
  slug: string
  title: string
  date: string
  coverImage?: string
  'header-img'?: string
  author: Author
  excerpt?: string
  subtitle?: string
  ogImage?: {
    url: string
  }
  content: string
  permalink?: string
  permalinkMatch?: string
  tags?: string[]
  published?: boolean
  preview?: boolean
}
