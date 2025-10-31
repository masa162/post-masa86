import Link from 'next/link'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/markdown'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-header">
        <h2 className="post-card-title">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="post-card-date">{formatDate(post.created_at)}</p>
      </div>
      
      <div className="post-card-content">
        <p className="post-card-summary">
          {post.content.substring(0, 150)}...
        </p>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="post-card-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="post-card-footer">
        <Link href={`/${post.slug}`} className="read-more-link">
          続きを読む →
        </Link>
      </div>
    </article>
  )
}
