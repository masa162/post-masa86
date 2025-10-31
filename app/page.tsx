import { db } from '@/lib/db'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchBox from '@/components/SearchBox'
import Pagination from '@/components/Pagination'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

interface HomePageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const postsPerPage = 5 // Show 5 posts on home page
  
  const { posts, total } = await db.getPostsWithPagination(currentPage, postsPerPage)
  const tags = await db.getAllTags()
  const archive = await db.getArchive()
  const totalPages = Math.ceil(total / postsPerPage)

  return (
    <div className="main-container">
      <Header />
      
      <div className="content-wrapper">
        <main className="main-content">
          {posts.length > 0 ? (
            <>
              <div className="posts-grid">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} showContent={false} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  basePath="/"
                />
              )}
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                {total}件中 {(currentPage - 1) * postsPerPage + 1}～{Math.min(currentPage * postsPerPage, total)}件を表示
              </div>
            </>
          ) : (
            <p className="text-gray-600">記事がありません</p>
          )}
        </main>
        
        <aside className="sidebar">
          <SearchBox />
          <Sidebar tags={tags} archive={archive} />
        </aside>
      </div>
    </div>
  )
}

