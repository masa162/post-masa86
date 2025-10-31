import { db } from '@/lib/db'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

export default async function Home() {
  const posts = await db.getPosts(5)
  const tags = await db.getAllTags()

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Header />
      
      <div className="flex gap-8">
        <main className="flex-1">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">記事がありません</p>
          )}
        </main>
        
        <aside className="hidden lg:block">
          <SearchBox />
          <Sidebar tags={tags} />
        </aside>
      </div>
    </div>
  )
}

