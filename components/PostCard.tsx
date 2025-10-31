import Link from 'next/link'
import { Post } from '@/lib/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">
        <Link
          href={`/${post.slug}`}
          className="text-gray-900 hover:text-blue-600 no-underline"
        >
          {post.title}
        </Link>
      </h2>
      <p className="text-sm text-gray-600">Slug: {post.slug}</p>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-2 flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

