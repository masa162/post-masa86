import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { db } from '@/lib/db'
import { formatDate, parseMarkdown } from '@/lib/markdown'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await db.getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const htmlContent = parseMarkdown(post.content)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Header />
      
      <article className="prose max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-600 mb-8">{formatDate(post.created_at)}</p>
        
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">タグ</h3>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <div className="mt-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← ホームに戻る
        </Link>
      </div>
    </div>
  )
}

