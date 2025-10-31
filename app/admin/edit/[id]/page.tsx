'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/lib/types'

export const runtime = 'edge'

const PREDEFINED_TAGS = [
  '日常', '読書', '技術', '映画', '音楽', '旅行', '食べ物', '考察'
]

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [postId, setPostId] = useState<string>('')
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setPostId(id)
      fetchPost(id)
    }
    init()
  }, [])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`)
      const data = await response.json() as { post?: Post }
      
      if (data.post) {
        setPost(data.post)
        setTitle(data.post.title)
        setContent(data.post.content)
        setSelectedTags(data.post.tags || [])
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('タイトルと本文を入力してください')
      return
    }

    setSaving(true)

    try {
      const credentials = localStorage.getItem('adminCredentials')
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags,
        }),
      })

      if (response.ok) {
        alert('記事を更新しました')
        router.push('/admin')
      } else {
        alert('更新に失敗しました')
      }
    } catch (error) {
      console.error('Update failed:', error)
      alert('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  if (!post) {
    return <div className="text-center py-8">記事が見つかりません</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">記事編集 - {post.slug}</h2>
        <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">タグ</label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-semibold mb-2">
            本文（Markdown）
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={20}
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '更新中...' : '更新'}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 no-underline inline-block"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  )
}

