'use client'

import { useRouter } from 'next/navigation'
import { Post } from '@/lib/types'
import { formatDate, parseMarkdown } from '@/lib/markdown'

interface PostCardProps {
  post: Post
  showContent?: boolean
}

export default function PostCard({ post, showContent = false }: PostCardProps) {
  const router = useRouter()
  const htmlContent = showContent ? parseMarkdown(post.content) : null

  const handleClick = (e: React.MouseEvent) => {
    // リンク内のリンクをクリックした場合は、親のクリックイベントをキャンセル
    if ((e.target as HTMLElement).tagName === 'A') {
      return
    }
    // それ以外の場合は、記事ページへ遷移
    router.push(`/${post.slug}`)
  }

  return (
    <article 
      className="post-card post-card-clickable" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
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
  )
}
