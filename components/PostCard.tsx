import Link from 'next/link'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/markdown'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/${post.slug}`} className="no-underline">
      <article className="post-card post-card-clickable">
        <div className="post-card-header">
          <h2 className="post-card-title">
            {post.title}
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
      </article>
    </Link>
  )
}
