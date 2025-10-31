'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'
import { Post } from '@/lib/types'

export const runtime = 'edge'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
    if (query) {
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/posts?limit=100')
      const data = await response.json() as { posts?: Post[] }
      const allTags = new Set<string>()
      data.posts?.forEach((post: Post) => {
        post.tags.forEach(tag => allTags.add(tag))
      })
      setTags(Array.from(allTags).sort())
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const performSearch = async (q: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?search=${encodeURIComponent(q)}&limit=100`)
      const data = await response.json() as { posts?: Post[] }
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Header />
      
      <div className="flex gap-8">
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">検索結果</h2>
            {query && (
              <p className="text-sm text-gray-600 mb-4">
                「{query}」の検索結果: {posts.length}件
              </p>
            )}
            <Link
              href="/"
              className="inline-block text-sm text-blue-600 hover:text-blue-800 no-underline"
            >
              ← ホームに戻る
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600">検索中...</div>
          ) : query && posts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              該当する記事が見つかりませんでした
            </div>
          ) : query && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600">
              キーワードを入力して検索してください
            </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-8 text-gray-600">読み込み中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

