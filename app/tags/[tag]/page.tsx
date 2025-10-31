import Link from 'next/link'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagParam } = await params
  const tag = decodeURIComponent(tagParam)
  const posts = await db.getPostsByTag(tag)
  const allTags = await db.getAllTags()
  const archive = await db.getArchive()

  return (
    <div className="main-container">
      <Header />
      
      <div className="content-wrapper">
        <main className="main-content">
          <div className="taxonomy-page">
            <h2 className="taxonomy-title">タグ: #{tag}</h2>
            <p className="taxonomy-count">{posts.length}件の記事</p>
            <Link
              href="/"
              className="inline-block text-sm text-blue-600 hover:text-blue-800 no-underline"
            >
              ← ホームに戻る
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="posts-grid" style={{ marginTop: '20px' }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">記事が見つかりませんでした。</p>
          )}
        </main>
        
        <aside className="sidebar">
          <SearchBox />
          <Sidebar tags={allTags} archive={archive} />
        </aside>
      </div>
    </div>
  )
}

