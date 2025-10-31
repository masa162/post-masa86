import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function Pagination({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  const maxPagesToShow = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
  
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-300 rounded no-underline"
        >
          前へ
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-300 rounded cursor-not-allowed">
          前へ
        </span>
      )}

      {/* First Page */}
      {startPage > 1 && (
        <>
          <Link
            href={basePath}
            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-300 rounded no-underline"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        page === currentPage ? (
          <span
            key={page}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}?page=${page}`}
            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-300 rounded no-underline"
          >
            {page}
          </Link>
        )
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link
            href={`${basePath}?page=${totalPages}`}
            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-300 rounded no-underline"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-300 rounded no-underline"
        >
          次へ
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-300 rounded cursor-not-allowed">
          次へ
        </span>
      )}
    </nav>
  )
}

