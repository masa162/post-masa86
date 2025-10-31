import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

export default async function Home() {
  const posts = await db.getPosts(5)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">中山雑記</h1>
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">Slug: {post.slug}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">記事がありません</p>
      )}
    </div>
  )
}

