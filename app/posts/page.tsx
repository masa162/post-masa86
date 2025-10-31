import { db } from '@/lib/db'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

interface PostsPageProps {
  searchParams: Promise<{ 
    page?: string
    tags?: string
    q?: string
  }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const selectedTags = params.tags ? params.tags.split(',') : []
  const searchQuery = params.q || ''
  const postsPerPage = 20

  // Get posts based on filters
  let posts = await db.getPosts(9999) // Get all posts first
  
  // Filter by search query
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
    )
  }
  
  // Filter by tags
  if (selectedTags.length > 0) {
    posts = posts.filter(post => 
      selectedTags.every(tag => post.tags.includes(tag))
    )
  }

  const total = posts.length
  const totalPages = Math.ceil(total / postsPerPage)
  const start = (currentPage - 1) * postsPerPage
  const paginatedPosts = posts.slice(start, start + postsPerPage)

  const allTags = await db.getAllTags()
  const archive = await db.getArchive()

  return (
    <div className="main-container">
      <Header />
      
      <div className="content-wrapper">
        <main className="main-content">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-4">記事一覧</h1>
            
            {/* Filters */}
            <div className="mb-4">
              {/* Search */}
              <div className="mb-3">
                <form method="get" action="/posts" className="flex gap-2">
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="キーワード検索..."
                    className="search-input flex-1"
                  />
                  <button type="submit" className="search-button">
                    検索
                  </button>
                </form>
              </div>

              {/* Selected tags */}
              {selectedTags.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm mb-2">選択中のタグ:</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedTags.map(tag => (
                      <Link
                        key={tag}
                        href={`/posts?tags=${selectedTags.filter(t => t !== tag).join(',')}`}
                        className="tag-link"
                      >
                        #{tag} ×
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag selection */}
              <div>
                <p className="text-sm mb-2">タグで絞り込み:</p>
                <div className="flex gap-2 flex-wrap">
                  {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag)
                    const newTags = isSelected
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag]
                    return (
                      <Link
                        key={tag}
                        href={`/posts?tags=${newTags.join(',')}`}
                        className={`tag-link ${isSelected ? 'tag-selected' : ''}`}
                      >
                        #{tag}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              {total}件の記事
              {selectedTags.length > 0 && ` (タグ: ${selectedTags.join(', ')})`}
              {searchQuery && ` (検索: ${searchQuery})`}
            </p>

            <Link
              href="/"
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 no-underline"
            >
              ← ホームに戻る
            </Link>
          </div>

          {paginatedPosts.length > 0 ? (
            <>
              <div className="posts-grid">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  basePath={`/posts?tags=${selectedTags.join(',')}&q=${searchQuery}`}
                />
              )}
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                {total}件中 {start + 1}～{Math.min(start + postsPerPage, total)}件を表示
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center py-8">記事が見つかりませんでした</p>
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

