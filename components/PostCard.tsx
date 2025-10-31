import Link from 'next/link'
import { Post } from '@/lib/types'
import { formatDate, parseMarkdown } from '@/lib/markdown'

interface PostCardProps {
  post: Post
  showContent?: boolean
}

function truncateHtml(html: string, maxLength: number): string {
  // Create a temporary div to parse HTML
  if (typeof window === 'undefined') {
    // Server-side: simple truncation
    const plainText = html.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) return html
    
    // Find a good breaking point (up to maxLength chars)
    const truncated = html.substring(0, maxLength * 3) // Allow some HTML overhead
    return truncated + '...'
  }
  return html
}

export default function PostCard({ post, showContent = false }: PostCardProps) {
  let htmlContent = null
  
  if (showContent) {
    const fullHtml = parseMarkdown(post.content)
    // Truncate to first 600 characters of HTML (includes images, YouTube, etc.)
    htmlContent = truncateHtml(fullHtml, 600)
  }

  return (
    <Link href={`/${post.slug}`} className="no-underline">
      <article className="post-card post-card-clickable">
        <div className="post-card-header">
          <h2 className="post-card-title">
            {post.title}
          </h2>
          <p className="post-card-date">{formatDate(post.created_at)}</p>
        </div>
        
        {showContent && htmlContent ? (
          <div 
            className="post-card-content-preview post-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="post-card-content">
            <p className="post-card-summary">
              {post.content.substring(0, 150)}...
            </p>
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="post-card-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
