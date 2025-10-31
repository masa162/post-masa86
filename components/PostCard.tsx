import Link from 'next/link'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/markdown'

interface PostCardProps {
  post: Post
  showContent?: boolean
}

export default function PostCard({ post, showContent = false }: PostCardProps) {
  // dangerouslySetInnerHTMLを使わず、プレーンテキストプレビューのみ
  const preview = post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'

  return (
    <article className="post-card">
      <Link href={`/${post.slug}`} className="post-card-link">
        <div className="post-card-header">
          <h2 className="post-card-title">{post.title}</h2>
          <p className="post-card-date">{formatDate(post.created_at)}</p>
        </div>
        
        <div className="post-card-content">
          <p className="post-card-summary">{preview}</p>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="post-card-tag">#{tag}</span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
