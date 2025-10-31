import { db } from '@/lib/db'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

export default async function Home() {
  const posts = await db.getPosts(5)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Header />
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">記事がありません</p>
      )}
    </div>
  )
}

