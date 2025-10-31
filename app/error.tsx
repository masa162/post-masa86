'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <main className="main-content">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">エラーが発生しました</h2>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              再試行
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

