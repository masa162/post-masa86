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

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Header />
      
      <div className="flex gap-8">
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">タグ: #{tag}</h2>
            <p className="text-sm text-gray-600">{posts.length}件の記事</p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800 no-underline"
            >
              ← ホームに戻る
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">記事が見つかりませんでした。</p>
          )}
        </main>
        
        <aside className="hidden lg:block">
          <SearchBox />
          <Sidebar tags={allTags} />
        </aside>
      </div>
    </div>
  )
}

