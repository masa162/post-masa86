'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/types'

export const runtime = 'edge'

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=100')
      const data = await response.json() as { posts?: Post[] }
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`本当に「${title}」を削除しますか？`)) {
      return
    }

    try {
      const credentials = localStorage.getItem('adminCredentials')
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      })

      if (response.ok) {
        alert('削除しました')
        fetchPosts()
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('削除に失敗しました')
    }
  }

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">記事一覧</h2>
        <Link
          href="/admin/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 no-underline"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">タイトル</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">タグ</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{post.slug}</td>
                <td className="px-4 py-3 text-sm">
                  <Link href={`/${post.slug}`} className="text-blue-600 hover:text-blue-800" target="_blank">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {post.tags.join(', ')}
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <Link href={`/admin/edit/${post.id}`} className="text-blue-600 hover:text-blue-800">
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

