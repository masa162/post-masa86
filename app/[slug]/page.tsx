import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'
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
  const tags = await db.getAllTags()
  const archive = await db.getArchive()

  return (
    <div className="main-container">
      <Header />
      
      <div className="content-wrapper">
        <article className="main-content">
          <div className="post-single">
            <div className="post-header">
              <h1 className="post-title-single">{post.title}</h1>
              <p className="post-date">{formatDate(post.created_at)}</p>
            </div>
            
            <div
              className="post-content-single post-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="tag-link"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
                ← ホームに戻る
              </Link>
            </div>
          </div>
        </article>
        
        <aside className="sidebar">
          <SearchBox />
          <Sidebar tags={tags} archive={archive} currentSlug={post.slug} />
        </aside>
      </div>
    </div>
  )
}

